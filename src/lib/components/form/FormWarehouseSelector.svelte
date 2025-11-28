<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/iam-client-side'
  import { WarehousesApi, WarehouseSummaryTypeEnum, type WarehouseSummary } from '$api/iam'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import FormGenericSingleSelector from '$components/form/FormGenericSingleSelector.svelte'
  import {
    MultiSelectDefaultValues,
    type MultiselectAlignContent,
  } from '$components/form/multiselect/MultiSelect.svelte'
  import WarehouseSingleRenderer from '$components/form/multiselect/WarehouseSingleRenderer.svelte'
  import { type FilterQuery } from '$utils/filters'
  import type { ExtendedOption } from '$utils/generics'
  import { warehouseSortFunction } from '$utils/warehouses'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let attr: any | undefined = undefined
  export let label: string = $_('Warehouse')
  export let placeholder: string | undefined = $_('Select Warehouse Placeholder')
  export let emptyText: string = $_('No Warehouses Found')
  export let name: string = 'warehouseId'
  export let id: string = name
  export let error: string | undefined = ''
  export let errorPosition: FormFieldMessagePosition | undefined = undefined
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
  export let allowClear: boolean = MultiSelectDefaultValues.allowClear
  export let allowSelectAll: boolean = false
  export let itemRendererComponent: ConstructorOfATypedSvelteComponent | undefined = WarehouseSingleRenderer
  export let selectedItemRendererComponent: ConstructorOfATypedSvelteComponent | undefined = undefined

  export let onChoose: (item: WarehouseSummary) => void = () => {}
  export let onChange: (item: ExtendedOption | undefined) => void = () => {}
  export let onClear: () => void = () => {}

  const warehousesApi = new WarehousesApi(createClientApiConfig())
  const ALL_WAREHOUSES_RECORD = {
    id: 'ALL',
    name: $_('All Warehouses'),
    address: {
      address: '',
      country: '',
      name: '',
    },
    type: WarehouseSummaryTypeEnum.DistributionCenter,
  }

  function optionMappingFunction(item: WarehouseSummary): ExtendedOption<WarehouseSummary> {
    return {
      label: item.name,
      value: item.id as string,
      attr: item,
    }
  }

  async function fetchFunction(query: Partial<FilterQuery>): Promise<WarehouseSummary[]> {
    const warehouses = await warehousesApi.listWarehouses()

    warehouses.sort(warehouseSortFunction)

    return [...(allowSelectAll ? [ALL_WAREHOUSES_RECORD] : []), ...warehouses].filter(item => {
      if (query.search) return item.name.toLowerCase().includes(query.search.toLowerCase())

      return true
    })
  }
</script>

<FormGenericSingleSelector
  {formAPI}
  {attr}
  {id}
  {name}
  {label}
  {showErrorMessage}
  {error}
  {errorPosition}
  {warning}
  {warningPosition}
  {showLabel}
  {align}
  {placeholder}
  {width}
  {contentWidth}
  {disabled}
  {readonly}
  {allowNewRecord}
  {allowClear}
  {emptyText}
  {itemRendererComponent}
  {selectedItemRendererComponent}
  {optionMappingFunction}
  {fetchFunction}
  {onChoose}
  {onChange}
  {onClear} />
