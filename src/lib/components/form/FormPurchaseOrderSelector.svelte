<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/supply-client-side'
  import { OrdersApi, type OrderSummary } from '$api/supply'
  import { browser } from '$app/environment'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import ReadOnlyMultiselect from '$components/form/multiselect/ReadOnlyMultiselect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import type { MinimalFilterQuery } from '$utils/filters'
  import type { ExtendedOption } from '$utils/generics'
  import { _ } from 'svelte-i18n'
  import PurchaseOrderSingleRenderer from './multiselect/PurchaseOrderSingleRenderer.svelte'

  export let formAPI: any = null
  export let attr: any | undefined = undefined
  export let label: string = $_('Purchase Order')
  export let placeholder: string | undefined = $_('Select Purchase Order')
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
  export let supplierId: string | undefined = undefined
  export let allowClear: boolean = false
  export let fetchFunction: ((query: Partial<MinimalFilterQuery>) => Promise<OrderSummary[]>) | undefined = undefined
  export let onChoose: (item: OrderSummary) => void = () => {}
  export let onClear: () => void = () => {}
  export let customOptions: ExtendedOption[] = []

  let itemsList: Array<OrderSummary> = []

  const supplyApi = new OrdersApi(createClientApiConfig())

  function onItemChange({ detail }: CustomEvent<Array<ExtendedOption>>) {
    const [item] = detail

    if (!item) {
      onClear()
      if (!formAPI) return

      return formAPI.updateField(name, undefined)
    }

    const hit = itemsList.find(m => {
      return m.id === item.value
    }) as OrderSummary
    onChoose(hit)

    if (!formAPI) return

    formAPI.updateField(name, item.value)
    if (errorMessage) formAPI.validateField(name)
  }

  async function fetchItems(query: MinimalFilterQuery): Promise<OrderSummary[]> {
    if (fetchFunction) return fetchFunction(query)

    if (supplierId) {
      return supplyApi.listOrdersBySupplier({ ...query, supplierId })
    }

    return supplyApi.listOrders(query)
  }

  async function defaultFetchFunction(query: MinimalFilterQuery): Promise<ExtendedOption[]> {
    itemsList = await fetchItems(query)

    const mappedOptions = itemsList.map((item: OrderSummary) => ({
      label: item.internalId as string,
      value: item.id as string,
      attr: item as any,
    }))

    return [...customOptions, ...mappedOptions]
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
          {allowClear}
          itemRendererComponent={PurchaseOrderSingleRenderer}
          fetchFunction={defaultFetchFunction}
          value={selectedValue ? [selectedValue] : []}
          error={errorMessage}
          options={[]}
          emptyText={$_('No Orders Found')}
          class="w-full {$$restProps.class || ''}"
          multiselection={false}
          shouldFilter={false}
          triggerAutoWidth
          on:change={onItemChange} />
      </div>
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} />
{/if}
