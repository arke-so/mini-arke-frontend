<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/sales-client-side'
  import { DefaultApi, type OrderSummary } from '$api/sales'
  import { browser } from '$app/environment'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import ReadOnlyMultiselect from '$components/form/multiselect/ReadOnlyMultiselect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import type { FilterQuery } from '$utils/filters'
  import type { ExtendedOption } from '$utils/generics'
  import { _ } from 'svelte-i18n'
  import SalesOrderSelectedSingleRenderer from './multiselect/SalesOrderSelectedSingleRenderer.svelte'
  import SalesOrderSingleRenderer from './multiselect/SalesOrderSingleRenderer.svelte'

  export let formAPI: any = null
  export let attr: any | undefined = undefined
  export let label: string = $_('Sales Order')
  export let placeholder: string | undefined = $_('Select Sales Order')
  export let name: string = 'orderId'
  export let id: string = name
  export let error: string | undefined = ''
  export let warning: string | undefined = ''
  export let warningPosition: FormFieldMessagePosition | undefined = undefined
  export let align: 'start' | 'end' | 'center' = 'end'
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let width: string = FormFieldClass.SelectorDefaultWidth
  export let contentWidth: string = width
  export let fetchFunction: ((query: Partial<FilterQuery>) => Promise<OrderSummary[]>) | undefined = undefined
  export let onChoose: (item: OrderSummary) => void = () => {}
  export let onChange: (item: ExtendedOption | undefined) => void = () => {}
  export let onClear: () => void = () => {}

  let itemsList: Array<OrderSummary> = []

  const salesApi = new DefaultApi(createClientApiConfig())

  function onItemChange({ detail }: CustomEvent<Array<ExtendedOption>>) {
    const [item] = detail

    onChange(item)

    if (!item) {
      onClear()
      if (!formAPI) return

      return formAPI.updateField(name, undefined)
    }

    const hit = itemsList.find(m => m.id === item.value) as OrderSummary
    onChoose(hit)

    if (!formAPI) return

    formAPI.updateField(name, item.value)
    if (errorMessage) formAPI.validateField(name)
  }

  async function fetchItems(query: Partial<FilterQuery>): Promise<OrderSummary[]> {
    if (fetchFunction) return fetchFunction(query)

    return salesApi.listOrders(query)
  }

  async function defaultFetchFunction(query: Partial<FilterQuery>): Promise<ExtendedOption[]> {
    itemsList = await fetchItems(query)

    return itemsList.map((item: OrderSummary) => ({
      label: item.internalId as string,
      value: item.id as string,
      attr: item as any,
    }))
  }

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error
  $: selectedValue = attr ? { label: attr.name, value: attr.id as string } : undefined
</script>

{#if readonly}
  <ReadOnlyMultiselect class={$$restProps.class || ''} {attr} {label} {placeholder} {name} {id} {showLabel} />
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
          itemRendererComponent={SalesOrderSingleRenderer}
          selectedItemRendererComponent={SalesOrderSelectedSingleRenderer}
          fetchFunction={defaultFetchFunction}
          value={selectedValue ? [selectedValue] : []}
          error={errorMessage}
          options={[]}
          emptyText={$_('No Orders Found')}
          class="w-full {$$restProps.class || ''}"
          multiselection={false}
          shouldFilter={false}
          allowClear
          triggerAutoWidth
          on:change={onItemChange}
          on:change />
      </div>
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} />
{/if}
