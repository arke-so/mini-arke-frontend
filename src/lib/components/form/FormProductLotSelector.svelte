<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/product-client-side'
  import { DefaultApi, type ProductInventoryItemSummary } from '$api/product'
  import { browser } from '$app/environment'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import LotSingleRenderer from '$components/form/multiselect/LotSingleRenderer.svelte'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import ReadOnlyMultiselect from '$components/form/multiselect/ReadOnlyMultiselect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import { type MinimalFilterQuery } from '$utils/filters'
  import type { ExtendedOption } from '$utils/generics'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let attr: any | undefined = undefined
  export let productId: string | undefined = undefined
  export let label: string = $_('Lot')
  export let placeholder: string | undefined = $_('Select Lot Placeholder')
  export let name: string = 'lot'
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
  export let orderId: string | undefined = undefined
  export let warehouseId: string | undefined = undefined
  export let fetchFunction: ((query: MinimalFilterQuery) => Promise<ProductInventoryItemSummary[]>) | undefined =
    undefined
  export let onChoose: (item: ProductInventoryItemSummary) => void = () => {}
  export let onChange: (item: ExtendedOption | undefined) => void = () => {}

  let inventoryItemsList: Array<ProductInventoryItemSummary> = []

  const productsApi = new DefaultApi(createClientApiConfig())
  const dispatch = createEventDispatcher()

  function onItemChange({ detail }: CustomEvent<Array<ExtendedOption>>) {
    const [item] = detail

    onChange(item)

    if (!item) {
      dispatch('clear')
      if (!formAPI) return

      return formAPI.updateField(name, undefined)
    }

    const hit = inventoryItemsList.find(m => m.id === item.value)
    dispatch('choose', hit)
    onChoose(hit as ProductInventoryItemSummary)

    if (!formAPI) return

    formAPI.updateField(name, item.value)
    if (errorMessage) formAPI.validateField(name)
  }

  async function fetchItems(query: MinimalFilterQuery): Promise<ProductInventoryItemSummary[]> {
    if (fetchFunction) return fetchFunction(query)
    if (productId)
      return productsApi.listProductInventoryItemByProduct({
        ...query,
        productId,
        warehouseId,
        orderId,
      })

    return productsApi.listProductInventoryItems(query)
  }

  async function defaultFetchFunction(query: MinimalFilterQuery): Promise<ExtendedOption[]> {
    inventoryItemsList = await fetchItems(query)

    return inventoryItemsList
      .filter(it => !!it.lot)
      .map((item: ProductInventoryItemSummary) => ({
        label: item.lot || '-',
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
          itemRendererComponent={LotSingleRenderer}
          fetchFunction={defaultFetchFunction}
          value={selectedValue ? [selectedValue] : []}
          error={errorMessage}
          options={[]}
          emptyText={$_('No Lots Found')}
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
