<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/sales-client-side'
  import { DefaultApi, type CompanyAttr, type CustomerSummary } from '$api/sales'
  import { browser } from '$app/environment'
  import { FormFieldClass } from '$components/form/form'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import ReadOnlyMultiselect from '$components/form/multiselect/ReadOnlyMultiselect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import { onPageMessage, unregisterPageMessage } from '$components/utils/PageMessageQueue.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import { PageMessage, type PageMessageInterface } from '$fixtures/page-messages'
  import { type FilterQuery, type MinimalFilterQuery } from '$utils/filters'
  import type { ExtendedOption } from '$utils/generics'
  import { upsertCustomerRoute } from '$utils/routes'
  import { wait } from '$utils/wait'
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let attr: CompanyAttr | undefined = undefined
  export let label: string = $_('Customer')
  export let placeholder: string | undefined = $_('Select Customer Placeholder')
  export let name: string = 'customerId'
  export let id: string = name
  export let error: string | undefined = ''
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let width: string = FormFieldClass.SelectorDefaultWidth
  export let contentWidth: string = width
  export let readonly: boolean = false
  export let allowNewRecord: boolean = false
  export let fetchFunction: ((query: Partial<FilterQuery>) => Promise<CustomerSummary[]>) | undefined = undefined
  export let onChoose: (item: CustomerSummary) => void = () => {}
  export let onChange: (item: ExtendedOption | undefined) => void = () => {}
  export let onClear: () => void = () => {}

  let customersList: Array<CustomerSummary> = []
  let attentionSeeker = false

  const customersApi = new DefaultApi(createClientApiConfig())
  const dispatch = createEventDispatcher()

  function onCreateNewRecord() {
    if (!browser) return

    window.open(upsertCustomerRoute(), '_blank')
  }

  async function afterCreateNewRecord(event: MessageEvent<PageMessageInterface>) {
    if (!browser) return

    const nextCustomer: CustomerSummary = event.data.payload as CustomerSummary

    if (nextCustomer?.id) {
      selectedValue = { label: nextCustomer.name, value: nextCustomer.id }
      dispatch('choose', nextCustomer)
      onChoose(nextCustomer)
      formAPI.updateField(name, nextCustomer.id)
      attentionSeeker = true
      await wait(3000)
      attentionSeeker = false
    }
  }

  function onCustomerChange({ detail }: CustomEvent<Array<ExtendedOption>>) {
    const [customer] = detail

    onChange(customer)

    if (!customer) {
      onClear()
      return dispatch('clear')
    }

    const hit = customersList.find(s => s.id === customer.value)
    dispatch('choose', hit)
    onChoose(hit as CustomerSummary)

    if (!formAPI) return
    formAPI.updateField(name, customer.value)
    if (errorMessage) formAPI.validateField(name)
  }

  async function fetchData(query: Partial<MinimalFilterQuery>) {
    if (fetchFunction) return fetchFunction(query)

    return customersApi.listCustomers(query)
  }

  async function defaultFetchFunction(query: MinimalFilterQuery) {
    customersList = await fetchData(query)

    return customersList.map((customer: CustomerSummary) => ({
      label: customer.name,
      value: customer.id as string,
    }))
  }

  onMount(() => onPageMessage(PageMessage.CustomerCreated, afterCreateNewRecord))
  onDestroy(() => unregisterPageMessage(PageMessage.CustomerCreated))

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
        fetchFunction={defaultFetchFunction}
        value={selectedValue ? [selectedValue] : []}
        error={errorMessage}
        options={[]}
        emptyText={$_('No Customers Found')}
        newRecordText={$_('Add New Customer')}
        class="w-full {attentionSeeker ? 'attention-seeker shadow-border' : ''} {$$restProps.class || ''}"
        multiselection={false}
        shouldFilter={false}
        allowClear
        onCreateNew={onCreateNewRecord}
        on:change={onCustomerChange}
        on:change />
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} class={$$restProps.class || ''} />
{/if}
