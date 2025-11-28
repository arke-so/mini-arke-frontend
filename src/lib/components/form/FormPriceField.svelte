<script lang="ts">
  import TextFieldRaw from '$components/form/TextFieldRaw.svelte'
  import { DEFAULT_CURRENCY_CODE } from '$fixtures/currencies'
  import { getCurrencyDisplayedSybol } from '$utils/currencies'
  import { dotNotationToComa } from '$utils/numbers'
  import { floatToCurrencyString, formatCurrency } from '$utils/prices'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let label: string = $_('Price')
  export let currency: string = DEFAULT_CURRENCY_CODE
  export let placeholder: string | undefined = undefined
  export let name: string = 'price'
  export let value: string = ''
  export let id: string = name
  export let defaultHandler: boolean = !!formAPI
  export let focus: boolean = false
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let rounded: boolean = true
  export let disabled: boolean = false

  const dispatch = createEventDispatcher()

  function onInput(event: InputEvent) {
    const inputValue = formatCurrency((event.target as HTMLInputElement).value)

    dispatch('change', inputValue)

    if (!formAPI) return
    formAPI.updateField(name, inputValue)
  }

  async function onBlur(event: FocusEvent) {
    parsedValue = formatCurrency((event.target as HTMLInputElement).value)
    value = parsedValue
    dispatch('change', parsedValue)
  }

  function valueToString(value: string | number) {
    if (typeof value === 'number') return floatToCurrencyString(value)

    return value
  }

  $: currencySymbol = getCurrencyDisplayedSybol(currency)
  $: parsedValue = formatCurrency(dotNotationToComa(valueToString(formAPI?.form[name] || value)))
</script>

<TextFieldRaw
  {...$$restProps}
  type="string"
  value={parsedValue}
  error={formAPI?.errors[name]}
  class="{$$restProps.class} pr-8"
  autocomplete="off"
  {label}
  {placeholder}
  {name}
  {id}
  {focus}
  {showLabel}
  {showErrorMessage}
  {defaultHandler}
  {formAPI}
  {disabled}
  on:blur={onBlur}
  on:input={onInput}
  on:focus
  on:blur
  on:input>
  <svelte:fragment slot="right">
    <div
      class="{rounded
        ? 'rounded-r-md'
        : ''} pointer-events-none absolute right-0 top-0 flex h-full max-w-16 items-center px-2.5 text-sm text-muted-foreground/60">
      {currencySymbol}
    </div>
  </svelte:fragment>
</TextFieldRaw>
