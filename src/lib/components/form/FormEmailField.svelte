<script lang="ts">
  import TextFieldRaw from '$components/form/TextFieldRaw.svelte'
  import { _ } from 'svelte-i18n'
  import type { FormFieldMessagePosition } from './form'

  export let formAPI: any = null
  export let label: string = $_('Email')
  export let placeholder: string | undefined = undefined
  export let name: string = 'email'
  export let id: string = name
  export let type: string = 'text'
  export let value: string = ''
  export let defaultHandler: boolean = !!formAPI
  export let focus: boolean = false
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let error: string | undefined = undefined
  export let errorPosition: FormFieldMessagePosition = 'bottom'
  export let onChange: (value: string) => void = () => {}

  let internalError: string | undefined = undefined

  function onInput(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value

    onChange(value)

    if (!formAPI) return
    formAPI.updateField(name, value)
  }
</script>

<TextFieldRaw
  {...$$restProps}
  error={formAPI?.errors[name] || error || internalError}
  {errorPosition}
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
  bind:value
  on:input={onInput}
  on:input />
