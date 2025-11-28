<script lang="ts">
  import TextFieldRaw from '$components/form/TextFieldRaw.svelte'
  import { UnitOfMeasures } from '$fixtures/uom'
  import { getUOMDisplayedSymbol, getUOMMinQuantity, getUOMStep } from '$utils/uom'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let label: string = $_('Quantity')
  export let placeholder: string | undefined = undefined
  export let name: string = 'quantity'
  export let id: string = name
  export let type: string = 'number'
  export let value: string = ''
  export let defaultHandler: boolean = !!formAPI
  export let focus: boolean = false
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let rightLabel: string | undefined = undefined
  export let min: number | undefined = undefined
  export let max: number | undefined = undefined
  export let allowNegativeValues: boolean = false
  export let step: number | undefined = undefined
  export let uom: string | undefined = UnitOfMeasures.Default
  export let disabled: boolean = false

  const dispatch = createEventDispatcher()

  function normalizeQuantityByUOM(value: number) {
    if (!uom) return value
    if (uom !== UnitOfMeasures.Default) return value

    const step = getUOMStep(uom || UnitOfMeasures.Default)
    const min = getUOMMinQuantity(uom || UnitOfMeasures.Default)

    if (allowNegativeValues) return Math.round(value / step) * step

    return Math.max(min, Math.round(value / step) * step)
  }

  function normalizeValue(value: string) {
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value)
  }

  function formatValue(value: string) {
    return allowNegativeValues ? value.replace(/[^0-9\.-]/g, '') : value.replace(/[^0-9\.,]/g, '')
  }

  function onInput(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value
    const nextValue = formatValue(value)

    dispatch('change', normalizeValue(nextValue))

    if (!formAPI) return
    formAPI.updateField(name, nextValue)
  }

  async function onBlur(event: FocusEvent) {
    const nextValue = formatValue((event.target as HTMLInputElement).value)
    const normalizedValue = normalizeQuantityByUOM(normalizeValue(nextValue))

    dispatch('change', normalizedValue)

    if (!formAPI) return
    formAPI.updateField(name, normalizedValue)
  }

  $: locked = formAPI?.locked || false
</script>

<TextFieldRaw
  {...$$restProps}
  value={value || formAPI?.form[name]}
  error={formAPI?.errors[name] || $$restProps.error}
  rightLabel={uom ? $_(getUOMDisplayedSymbol(uom)) : rightLabel}
  step={uom ? getUOMStep(uom) : step}
  min={uom ? getUOMMinQuantity(uom) : min}
  disabled={disabled || locked}
  {max}
  {label}
  {placeholder}
  {name}
  {id}
  {type}
  {focus}
  {showLabel}
  {showErrorMessage}
  {defaultHandler}
  {formAPI}
  on:input={onInput}
  on:blur={onBlur}
  on:focus
  on:blur
  on:input />
