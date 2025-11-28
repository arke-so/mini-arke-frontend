<script lang="ts">
  import TextFieldRaw from '$components/form/TextFieldRaw.svelte'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let label: string = $_('Quantity')
  export let placeholder: string | undefined = undefined
  export let name: string = 'quantity'
  export let value: string = ''
  export let id: string = name
  export let type: string = 'text'
  export let defaultHandler: boolean = !!formAPI
  export let focus: boolean = false
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let rightLabel: string | undefined = undefined
  export let min: number | undefined = undefined
  export let max: number | undefined = undefined
  export let onChange: (value: number) => void = () => {}
  export let onInput: (value: number, target: HTMLInputElement) => void = () => {}

  const dispatch = createEventDispatcher()

  function normalizeValue(value: string) {
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value)
  }

  function formatValue(value: string) {
    return value.replace(/[^0-9.-]/g, '')
  }

  function onFieldInput(event: InputEvent) {
    const fieldValue = (event.target as HTMLInputElement).value
    const nextValue = formatValue(fieldValue)
    const normalized = normalizeValue(nextValue)

    dispatch('change', normalized)
    onChange(normalized)
    onInput(normalized, event.target as HTMLInputElement)

    if (!formAPI) return
    formAPI.updateField(name, nextValue)

    if (formAPI?.errors[name]) formAPI?.validateField(name)
  }

  async function onBlur(event: FocusEvent) {
    const nextValue = formatValue((event.target as HTMLInputElement).value)
    const normalizedValue = normalizeValue(nextValue)

    dispatch('change', normalizedValue)
    onChange(normalizedValue)

    if (!formAPI) return
    formAPI.updateField(name, normalizeValue(nextValue))
  }
</script>

<TextFieldRaw
  value={formAPI?.form[name] || value}
  error={formAPI?.errors[name]}
  {min}
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
  {rightLabel}
  on:input={onFieldInput}
  on:blur={onBlur}
  on:input />
