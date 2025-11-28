<script lang="ts">
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import { Label } from '$ds/components/ui/label'
  import * as Select from '$ds/components/ui/select/index'
  import type { BasicOption } from '$utils/generics'
  import type { SelectContentProps, Selected } from 'bits-ui'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'
  import type { FormFieldMessagePosition } from './form'
  import FormFieldMessages from './FormFieldMessages.svelte'

  export let items: Array<BasicOption> = []
  export let value: string | undefined
  export let name: string
  export let id: string = name
  export let error: string | undefined = undefined
  export let showErrorMessage: boolean = true
  export let warning: string | undefined = ''
  export let warningPosition: FormFieldMessagePosition | undefined = undefined
  export let errorPosition: FormFieldMessagePosition | undefined = undefined
  export let showLabel: boolean = true
  export let label: string
  export let placeholder: string | undefined = undefined
  export let small: boolean = false
  export let disabled: boolean = false
  export let align: SelectContentProps['align'] = 'end'
  export let contentWidth: string = ''
  export let allowClear: boolean = false
  export let onSelectedChange: ((selected: Selected<unknown> | undefined) => void) | undefined = undefined
  export let onOpenChange: ((isOpen: boolean) => void) | undefined = undefined
  export let onClear: (() => void) | undefined = undefined

  const dispatch = createEventDispatcher()

  function onDefaultSelectedChange(selected: Selected<unknown> | undefined) {
    value = selected?.value as string

    dispatch('change', {
      value,
      selected,
    })
  }

  $: selected = value ? items.find(item => item.value === value) : undefined
  $: classes = $$restProps.class || ''
  $: aria = {
    'aria-labelledby': `label-${id}`,
    ...(!!error ? { 'aria-invalid': true } : {}),
  }
</script>

<div>
  <Label for={name} id="label-{id}" class={showLabel ? '' : 'sr-only'}>{label}</Label>
  <FormFieldMessages {id} {warning} {showErrorMessage} {warningPosition} {error} {errorPosition}>
    {#key selected}
      <Select.Root onSelectedChange={onSelectedChange || onDefaultSelectedChange} {onOpenChange} {selected} {disabled}>
        <Select.Trigger class="{classes} aria-[invalid]:bg-destructive/5" {...aria}>
          <Select.Value placeholder={placeholder || label} />
        </Select.Trigger>
        <Select.Content class="max-h-60 overflow-y-auto {contentWidth}" {align}>
          {#if allowClear && value && onClear}
            <div class="p-1">
              <Button
                variant="ghost"
                class="relative flex h-auto w-full cursor-default select-none flex-col items-start justify-start rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-error/20 focus:bg-error/20"
                on:click={e => {
                  e.preventDefault()
                  onClear?.()
                }}>
                <div class="flex items-center justify-start">
                  <IcoNoir.X class="{IconSize.Small} mr-2" />
                  {$_('Remove Selection')}
                </div>
                <div class="text-sm text-muted-foreground">
                  {selected?.label || ''}
                </div>
              </Button>
            </div>
            <Select.Separator />
          {/if}
          <Select.Group>
            <Select.Label>{label}</Select.Label>
            {#each items as item (item.value)}
              <Select.Item
                class={small ? 'text-xs' : ''}
                value={item.value}
                label={item.label}
                disabled={!!item.disabled}>
                {item.label}
              </Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
        <Select.Input {name} on:change />
      </Select.Root>
    {/key}
  </FormFieldMessages>
</div>
