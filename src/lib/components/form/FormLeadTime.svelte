<script lang="ts">
  import TextFieldRaw from '$components/form/TextFieldRaw.svelte'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let label: string
  export let placeholder: string | undefined = undefined
  export let name: string = 'leadTime'
  export let id: string = name
  export let type: string = 'number'
  export let defaultHandler: boolean = !!formAPI
  export let focus: boolean = false
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let min: number = 1
  export let max: number = 365

  function onInput(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value

    formAPI.updateField(name, `${value}d`)
  }

  $: parsedValue = formAPI?.form[name]?.replace(/\D/g, '')
</script>

<TextFieldRaw
  value={parsedValue}
  error={formAPI?.errors[name]}
  rightLabel={$_('Days')}
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
