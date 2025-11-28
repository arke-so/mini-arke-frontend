<script lang="ts">
  import { browser } from '$app/environment'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Label } from '$ds/components/ui/label'
  import { Textarea } from '$ds/components/ui/textarea'

  export let formAPI: any = null
  export let label: string
  export let name: string
  export let id: string = name
  export let value: string = ''
  export let focus: boolean = false
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let placeholder: string | undefined = undefined

  function focusField() {
    if (!browser) return

    setTimeout(() => {
      const field: HTMLTextAreaElement | null = document.querySelector(`#${name}`)

      if (field) field.focus()
    }, 1)
  }

  function onInput(event: Event) {
    if (!formAPI) return

    formAPI.updateField(name, (event.target as HTMLInputElement).value)
    if (formAPI.errors[name]) formAPI.validateField(name)
  }

  $: locked = formAPI?.locked || false
  $: if (focus) focusField()
  $: error = formAPI?.errors[name]
  $: classes = ($$restProps.class || '') + (!!error ? ' border-destructive bg-destructive/5' : '')
  $: aria = {
    'aria-labelledby': `label-${id}`,
    'aria-describedby': `error-${id}`,
    'aria-invalid': !!error,
  }
</script>

<div>
  <Label for={name} id="label-{id}" class={showLabel ? '' : 'sr-only'}>{label}</Label>
  <Textarea
    {...$$restProps}
    {id}
    {name}
    {placeholder}
    {...aria}
    disabled={locked}
    value={formAPI?.form[name] || value}
    class={classes}
    on:input={onInput}
    on:input />

  {#if showErrorMessage && !!error}
    <div id="error-{id}" class="mt-1 flex items-center gap-1 text-xs font-semibold text-destructive">
      <IcoNoir.LongArrowLeftUp class={IconSize.Small} />
      {error}
    </div>
  {/if}
</div>
