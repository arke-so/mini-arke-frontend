<script lang="ts">
  import type { FormFieldMessagePosition } from '$components/form/form'
  import { Button } from '$ds/components/ui/button'
  import { Eye, EyeOff } from 'lucide-svelte'
  import type { FormUtilAPI } from './FormUtil.svelte'
  import TextFieldRaw from './TextFieldRaw.svelte'

  export let formAPI: FormUtilAPI | undefined = undefined
  export let value: string = ''
  export let label: string
  export let placeholder: string | undefined = undefined
  export let name: string
  export let id: string = name
  export let error: string | undefined = undefined
  export let errorPosition: FormFieldMessagePosition = 'bottom'
  export let focus: boolean = false
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let tabindex: string | number | undefined = undefined

  let showPassword = false
  $: actualType = showPassword ? 'text' : 'password'

  function handlePasswordToggleClick(event: MouseEvent) {
    event.preventDefault()
    showPassword = !showPassword
  }

  function onInput(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value

    if (!formAPI) return
    formAPI.updateField(name, value)
  }
</script>

<TextFieldRaw
  {...$$restProps}
  error={formAPI?.errors[name] || error}
  {errorPosition}
  {label}
  {placeholder}
  {name}
  {id}
  type={actualType}
  {focus}
  {showLabel}
  {showErrorMessage}
  {formAPI}
  {tabindex}
  bind:value
  on:input={onInput}>
  <div slot="right" class="absolute right-0 top-0 flex h-full items-center">
    <Button variant="ghost" size="icon" type="button" on:click={handlePasswordToggleClick} tabindex={-1}>
      {#if showPassword}
        <EyeOff class="h-4 w-4" />
      {:else}
        <Eye class="h-4 w-4" />
      {/if}
    </Button>
  </div>
</TextFieldRaw>
