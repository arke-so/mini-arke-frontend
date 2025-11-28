<script lang="ts">
  import { browser } from '$app/environment'
  import type { FormFieldMessagePosition } from '$components/form/form'
  import { Input } from '$ds/components/ui/input'
  import { Label } from '$ds/components/ui/label'
  import { joinClassnames } from '$utils/classnames'
  import { getUserMessagingClasses } from '$utils/form'
  import FormFieldMessages from './FormFieldMessages.svelte'

  export let label: string
  export let placeholder: string | undefined = undefined
  export let name: string
  export let value: string | undefined = undefined
  export let id: string = name
  export let type: string = 'text'
  export let error: string | undefined = undefined
  export let errorPosition: FormFieldMessagePosition = 'bottom'
  export let warning: string | undefined = undefined
  export let warningPosition: FormFieldMessagePosition | undefined = undefined
  export let focus: boolean = false
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let autoWidth: boolean = false
  export let rightLabel: string | undefined = undefined
  export let disabled: boolean = false
  export let textAlign: 'left' | 'right' = 'left'

  function focusField() {
    if (!browser) return

    setTimeout(() => {
      const field: HTMLInputElement | null = document.querySelector(`#${name}`)

      if (field) field.focus()
    }, 1)
  }

  $: if (focus) focusField()
  $: classes = joinClassnames(
    $$restProps.class || '',
    getUserMessagingClasses(error, warning),
    rightLabel && textAlign === 'left' ? 'pr-4' : '',
    rightLabel && textAlign === 'right' ? 'pl-4' : '',
    textAlign === 'right' ? 'text-right' : '',
  )
  $: labelAria = {
    'aria-labelledby': `label-${id}`,
  }
</script>

<div class:numeric={type === 'number'} class:flex-1={autoWidth}>
  <Label for={name} id="label-{id}" class={showLabel ? '' : 'sr-only'}>{label}</Label>
  <FormFieldMessages {id} {error} {warning} {showErrorMessage} {errorPosition} {warningPosition} let:aria>
    <div class="relative">
      <Input
        {id}
        {name}
        {placeholder}
        {type}
        {disabled}
        autocomplete="off"
        autocorrect="off"
        {...labelAria}
        {...aria}
        {...$$restProps}
        class={classes}
        bind:value
        on:input
        on:focus
        on:keyup
        on:blur />

      <slot name="right">
        {#if rightLabel}
          <div
            class="pointer-events-none absolute top-0 flex h-full max-w-16 items-center text-sm text-muted-foreground/60 {textAlign ===
            'left'
              ? 'right-0 mr-2.5'
              : 'left-0 ml-2.5'} ">
            {rightLabel}
          </div>
        {/if}
      </slot>
    </div>
  </FormFieldMessages>
</div>

<style>
  .numeric :global(input[type='number']::-webkit-outer-spin-button),
  .numeric :global(input[type='number']::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }
  .numeric :global(input[type='number']) {
    -moz-appearance: textfield;
  }
</style>
