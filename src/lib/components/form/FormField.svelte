<script lang="ts">
  import TextFieldRaw from '$components/form/TextFieldRaw.svelte'
  import type { FormFieldMessagePosition } from '$components/form/form'

  export let formAPI: any = null
  export let label: string
  export let placeholder: string | undefined = undefined
  export let name: string
  export let id: string = name
  export let type: string = 'text'
  export let focus: boolean = false
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let warning: string | undefined = undefined
  export let warningPosition: FormFieldMessagePosition | undefined = undefined
  export let disabled: boolean = false
  export let rightLabel: string | undefined = undefined

  function onInput(event: Event) {
    if (!formAPI) return

    formAPI.updateField(name, (event.target as HTMLInputElement).value)
    if (formAPI.errors[name]) formAPI.validateField(name)
  }

  $: locked = formAPI?.locked || false
</script>

<TextFieldRaw
  value={formAPI?.form[name]}
  error={formAPI?.errors[name]}
  {...$$restProps}
  disabled={disabled || locked}
  {label}
  {warning}
  {warningPosition}
  {placeholder}
  {name}
  {rightLabel}
  {id}
  {type}
  {focus}
  {showLabel}
  {showErrorMessage}
  {formAPI}
  on:input={onInput}
  on:input />
