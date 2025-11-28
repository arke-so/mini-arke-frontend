<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/supply-client-side'
  import { SuppliersApi, type CompanyAttr, type SupplierSummary } from '$api/supply'
  import { browser } from '$app/environment'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import ReadOnlyMultiselect from '$components/form/multiselect/ReadOnlyMultiselect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import {
    onPageMessage,
    type SetObserverFunction,
    type UnregisterFunction,
  } from '$components/utils/PageMessageQueue.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import { PageMessage, type PageMessageInterface } from '$fixtures/page-messages'
  import { type MinimalFilterQuery } from '$utils/filters'
  import type { ExtendedOption } from '$utils/generics'
  import { upsertSupplierRoute } from '$utils/routes'
  import { wait } from '$utils/wait'
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import { _ } from 'svelte-i18n'
  import { FormFieldClass } from './form'
  import FormFieldMessages from './FormFieldMessages.svelte'

  export let formAPI: any = null
  export let attr: CompanyAttr | undefined = undefined
  export let label: string = $_('Supplier')
  export let placeholder: string | undefined = $_('Select Supplier Placeholder')
  export let name: string = 'supplierId'
  export let id: string = name
  export let error: string | undefined = ''
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let width: string = FormFieldClass.SelectorDefaultWidth
  export let contentWidth: string = width
  export let readonly: boolean = false
  export let allowNewRecord: boolean = false
  export let allowClear: boolean = false
  export let disabled: boolean = false
  export let onChoose: (item: SupplierSummary) => void = () => {}
  export let onChange: (item: ExtendedOption | undefined) => void = () => {}
  export let onClear: () => void = () => {}

  let suppliersList: Array<SupplierSummary> = []
  let attentionSeeker = false

  let setPageMessageObserver: SetObserverFunction | undefined = undefined
  let unregisterPageMessage: UnregisterFunction | undefined = undefined

  const suppliersApi = new SuppliersApi(createClientApiConfig())
  const dispatch = createEventDispatcher()

  function onCreateNewRecord() {
    if (!browser) return

    const proxy = window.open(upsertSupplierRoute(), '_blank')
    setPageMessageObserver?.(proxy)
  }

  async function afterCreateNewRecord(event: MessageEvent<PageMessageInterface>) {
    if (!browser) return

    const nextSupplier: SupplierSummary = event.data.payload as SupplierSummary

    if (nextSupplier?.id) {
      selectedValue = { label: nextSupplier.name, value: nextSupplier.id }
      dispatch('choose', nextSupplier)
      onChoose(nextSupplier)
      updateFormValue(nextSupplier)
      attentionSeeker = true
      await wait(3000)
      attentionSeeker = false
    }
  }

  function updateFormValue(supplier: SupplierSummary | undefined) {
    if (!formAPI) return

    if (!supplier) {
      formAPI.updateField(name, undefined)
      return
    }

    if (name === 'supplierAttr') {
      const companyAttr: CompanyAttr = {
        id: supplier.id,
        name: supplier.name,
        vat: supplier.vatNo || '',
        address: '',
      }
      formAPI.updateField(name, companyAttr)
    } else {
      formAPI.updateField(name, supplier.id)
    }

    if (errorMessage) formAPI.validateField(name)
  }

  function onSupplierChange({ detail }: CustomEvent<Array<ExtendedOption>>) {
    const [supplier] = detail

    onChange(supplier)

    if (!supplier) {
      onClear()
      updateFormValue(undefined)
      return dispatch('clear')
    }

    const hit = suppliersList.find(s => s.id === supplier.value)
    dispatch('choose', hit)
    onChoose(hit as SupplierSummary)
    updateFormValue(hit as SupplierSummary)
  }

  async function fetchFunction(query: MinimalFilterQuery) {
    suppliersList = await suppliersApi.listSuppliers(query)

    return suppliersList.map((supplier: SupplierSummary) => ({
      label: supplier.name,
      value: supplier.id as string,
    }))
  }

  onMount(() => {
    const { unregister, setObserver } = onPageMessage(PageMessage.SupplierCreated, afterCreateNewRecord)

    setPageMessageObserver = setObserver
    unregisterPageMessage = unregister
  })

  onDestroy(() => unregisterPageMessage?.())

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error

  $: selectedValue = attr ? { label: attr.name, value: attr.id as string } : undefined
</script>

{#if readonly}
  <ReadOnlyMultiselect {attr} width={FormFieldClass.MinWidth} {label} {placeholder} {name} {id} {showLabel} />
{:else if browser}
  <div>
    <Label for={name} id="label-{id}" class={showLabel ? '' : 'sr-only'}>{label}</Label>
    <FormFieldMessages {id} error={errorMessage} {showErrorMessage}>
      <MultiSelect
        {placeholder}
        {width}
        {contentWidth}
        {allowNewRecord}
        {allowClear}
        {fetchFunction}
        {disabled}
        value={selectedValue ? [selectedValue] : []}
        error={errorMessage}
        options={[]}
        emptyText={$_('No Suppliers Found')}
        newRecordText={$_('Add New Supplier')}
        class="w-full {attentionSeeker ? 'attention-seeker shadow-border' : ''}"
        multiselection={false}
        shouldFilter={false}
        onCreateNew={onCreateNewRecord}
        on:change={onSupplierChange}
        on:change />
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} />
{/if}
