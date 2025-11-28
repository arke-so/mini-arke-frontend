<script lang="ts">
  import TextFieldRaw from '$components/form/TextFieldRaw.svelte'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let label: string = $_('VAT')
  export let placeholder: string | undefined = undefined
  export let name: string = 'vat'
  export let value: string = ''
  export let id: string = name
  export let type: string = 'number'
  export let defaultHandler: boolean = !!formAPI
  export let focus: boolean = false
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let min: number = 1
  export let max: number = 100

  function onInput(event: InputEvent) {
    value = (event.target as HTMLInputElement).value

    if (!formAPI) return
    formAPI.updateField(name, value)
  }
</script>

<TextFieldRaw
  value={formAPI?.form[name] || value}
  error={formAPI?.errors[name]}
  rightLabel="%"
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
  on:input={onInput}
  on:input />
