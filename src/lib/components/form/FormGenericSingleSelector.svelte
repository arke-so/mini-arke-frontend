<script lang="ts">
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'

  import { browser } from '$app/environment'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import {
    MultiSelectDefaultValues,
    type MultiselectAlignContent,
  } from '$components/form/multiselect/MultiSelect.svelte'
  import ReadOnlyMultiselect from '$components/form/multiselect/ReadOnlyMultiselect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import {
    onPageMessage,
    type SetObserverFunction,
    type UnregisterFunction,
  } from '$components/utils/PageMessageQueue.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import { type PageMessageInterface } from '$fixtures/page-messages'
  import type { FilterQuery, MinimalFilterQuery } from '$utils/filters'
  import type { ExtendedOption } from '$utils/generics'
  import { wait } from '$utils/wait'
  import { onMount } from 'svelte'
  import { _ } from 'svelte-i18n'

  type T = $$Generic

  export let formAPI: any = null
  export let attr: any | undefined = undefined
  export let label: string = $_('Item')
  export let placeholder: string | undefined = $_('Select Item Placeholder')
  export let emptyText: string = $_('No Records Found')
  export let newRecordText: string = $_('Add New Item')
  export let name: string = 'itemId'
  export let id: string = name
  export let error: string | undefined = ''
  export let warning: string | undefined = ''
  export let warningPosition: FormFieldMessagePosition | undefined = undefined
  export let align: MultiselectAlignContent = MultiSelectDefaultValues.align
  export let showLabel: boolean = MultiSelectDefaultValues.showLabel
  export let showErrorMessage: boolean = MultiSelectDefaultValues.showErrorMessage
  export let disabled: boolean = MultiSelectDefaultValues.disabled
  export let readonly: boolean = MultiSelectDefaultValues.readonly
  export let width: string = FormFieldClass.SelectorDefaultWidth
  export let contentWidth: string = width
  export let allowNewRecord: boolean = MultiSelectDefaultValues.allowNewRecord
  export let newRecordPageMessageId: string | undefined = undefined
  export let allowClear: boolean = MultiSelectDefaultValues.allowClear
  export let itemRendererComponent: ConstructorOfATypedSvelteComponent | undefined = undefined
  export let selectedItemRendererComponent: ConstructorOfATypedSvelteComponent | undefined = undefined

  export let onChoose: (item: T) => void = () => {}
  export let onChange: (item: ExtendedOption | undefined) => void = () => {}
  export let onClear: () => void = () => {}

  export let onCreateRecord: (() => URL | string) | undefined = undefined

  export let fetchFunction: (query: Partial<FilterQuery>) => Promise<T[]> = () => Promise.resolve([])
  export let optionMappingFunction: (item: T) => ExtendedOption<T> = item => ({
    label: (item as any).name,
    value: (item as any).id as string,
    attr: item,
  })

  let itemsList: Array<T> = []
  let attentionSeeker = false
  let selectedValue: ExtendedOption | undefined = undefined

  let setPageMessageObserver: SetObserverFunction | undefined = undefined
  let unregisterPageMessage: UnregisterFunction | undefined = undefined

  function onCreateNewRecord() {
    if (!browser) return
    if (!onCreateRecord) {
      console.warn('onCreateRecord function was not provided')
      return
    }

    const newRecordRoute = onCreateRecord()
    const proxy = window.open(newRecordRoute, '_blank')
    setPageMessageObserver?.(proxy)
  }

  async function afterCreateNewRecord(event: MessageEvent<PageMessageInterface>) {
    if (!browser) return

    const newRecord = event.data.payload as T

    itemsList = [...itemsList, newRecord]

    attr = newRecord
    selectedValue = optionMappingFunction(newRecord)

    onChoose(newRecord)
    updateFormValue(newRecord)

    attentionSeeker = true
    await wait(3000)
    attentionSeeker = false
  }

  function updateFormValue(nextItem: T | undefined) {
    if (!formAPI) return

    if (!nextItem) {
      formAPI.updateField(name, undefined)
      return
    }

    const nextValue = optionMappingFunction(nextItem).value
    formAPI.updateField(name, nextValue)
    if (errorMessage) formAPI.validateField(name)
  }

  function onSelectionChange({ detail }: CustomEvent<Array<ExtendedOption<T>>>) {
    const [nextItem] = detail
    selectedValue = nextItem

    onChange(nextItem)

    if (!nextItem) {
      updateFormValue(undefined)
      onClear()
      return
    }

    onChoose(nextItem.attr as T)
    updateFormValue(nextItem.attr as T)
  }

  async function defaultFetchFunction(query: MinimalFilterQuery) {
    itemsList = await fetchFunction(query)

    return itemsList.map(optionMappingFunction)
  }

  onMount(() => {
    if (!newRecordPageMessageId) return

    const { unregister, setObserver } = onPageMessage(newRecordPageMessageId, afterCreateNewRecord)

    setPageMessageObserver = setObserver
    unregisterPageMessage = unregister

    return () => unregisterPageMessage?.()
  })

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error
  $: selectedValue = attr ? optionMappingFunction(attr as T) : undefined
</script>

{#if readonly}
  <ReadOnlyMultiselect {selectedValue} width={FormFieldClass.MinWidth} {label} {placeholder} {name} {id} {showLabel} />
{:else if browser}
  <div>
    <Label for={name} id="label-{id}" class={showLabel ? '' : 'sr-only'}>{label}</Label>
    <FormFieldMessages {id} error={errorMessage} {warning} {showErrorMessage} {warningPosition}>
      <div>
        <MultiSelect
          {align}
          {placeholder}
          {width}
          {contentWidth}
          {disabled}
          {warning}
          {allowNewRecord}
          {allowClear}
          {emptyText}
          {newRecordText}
          {itemRendererComponent}
          {selectedItemRendererComponent}
          fetchFunction={defaultFetchFunction}
          value={selectedValue ? [selectedValue] : []}
          error={errorMessage}
          options={[]}
          class="w-full {attentionSeeker ? 'attention-seeker shadow-border' : ''} {$$restProps.class || ''}"
          multiselection={false}
          shouldFilter={false}
          onCreateNew={onCreateNewRecord}
          on:change={onSelectionChange}
          on:change />
      </div>
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} />
{/if}
