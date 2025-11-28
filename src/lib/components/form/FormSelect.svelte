<script lang="ts">
  import { browser } from '$app/environment'
  import SelectField from '$components/form/SelectField.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import { joinClassnames } from '$utils/classnames'
  import type { BasicOption } from '$utils/generics'
  import type { SelectContentProps, Selected } from 'bits-ui'
  import { FormFieldClass } from './form'

  export let formAPI: any = null
  export let label: string
  export let showLabel: boolean = true
  export let name: string
  export let allowClear: boolean = false
  export let value: string | null | undefined = allowClear ? null : ''
  export let disabled: boolean = false
  export let key: string | number | undefined = undefined
  export let fetchOnOpen: boolean = false
  export let items: Array<BasicOption> = []
  export let contentWidth: string = ''
  export let maxWidth: string = FormFieldClass.MaxWidth
  export let align: SelectContentProps['align'] = 'end'
  export let placeholder: string | undefined = undefined
  export let fetchFunction: (() => Promise<Array<BasicOption>>) | undefined = undefined
  export let onChange:
    | ((event: { value: string | null; selected: Selected<unknown> | undefined }) => void)
    | undefined = undefined

  let internalItems: Array<BasicOption> = []
  let isDisabled: boolean = false
  let inflight: boolean = false

  function onSelectedChange(selected: Selected<unknown> | undefined) {
    if (!selected) return

    value = selected.value as string

    if (formAPI) {
      formAPI.updateField(name, value)
    }

    if (onChange) onChange({ value, selected })
  }

  function onClear() {
    if (!allowClear) return

    value = null
    if (formAPI) formAPI.updateField(name, null)
    if (onChange) onChange({ value: null, selected: undefined })
  }

  function onOpen(isOpen: boolean) {
    if (isOpen && fetchOnOpen) fetchItems(key)
  }

  async function fetchItems(_: string | number | undefined, i?: Array<BasicOption>) {
    try {
      inflight = true

      if (fetchFunction) internalItems = await fetchFunction()
      else internalItems = items

      if (selected === '') {
        const [item] = internalItems

        if (internalItems.length === 1) isDisabled = true
        if (!formAPI) return

        formAPI.updateField(name, item.value)
      }
    } catch {
    } finally {
      inflight = false
    }
  }

  $: locked = formAPI?.locked || false
  $: selected = formAPI?.form[name] || value
  $: if (browser) fetchItems(key)
  $: fetchItems(1, items)
</script>

{#if !browser || inflight}
  <FormFieldSkeleton {showLabel} />
{:else}
  <SelectField
    {name}
    {label}
    {showLabel}
    {contentWidth}
    {align}
    {allowClear}
    placeholder={placeholder || label}
    items={internalItems}
    value={selected}
    error={formAPI?.errors[name]}
    disabled={disabled || locked || isDisabled}
    class={joinClassnames(maxWidth, $$restProps.class || '')}
    {onSelectedChange}
    {onClear}
    onOpenChange={onOpen}
    small />
{/if}
