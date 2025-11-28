<script lang="ts">
  import type { CompanyAttr } from '$api/sales'
  import { browser } from '$app/environment'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import ReadOnlyMultiselect from '$components/form/multiselect/ReadOnlyMultiselect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import { type MinimalFilterQuery } from '$utils/filters'
  import type { BasicOption, ExtendedOption } from '$utils/generics'
  import { _ } from 'svelte-i18n'
  import AddressSingleRenderer from './multiselect/AddressSingleRenderer.svelte'

  export let formAPI: any = null
  export let label: string = $_('Address')
  export let placeholder: string | undefined = $_('Select Address Placeholder')
  export let name: string = 'address'
  export let value: string | undefined = undefined
  export let key: string = ''
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
  export let contentWidth: string = FormFieldClass.SelectorContentTableCellWidth
  export let fetchFunction: (query: MinimalFilterQuery) => Promise<BasicOption[]>
  export let onChoose: (item: BasicOption) => void = () => {}
  export let onChange: (item: ExtendedOption | undefined) => void = () => {}

  let selectedValue: ExtendedOption | undefined = undefined
  let readOnlyAttr: CompanyAttr | undefined = undefined

  function encodeOption(option: BasicOption): ExtendedOption {
    return {
      label: option.label,
      value: encodeURIComponent(option.value),
    }
  }

  function decodeOption(option: ExtendedOption): BasicOption {
    return {
      label: option.label,
      value: decodeURIComponent(option.value),
    }
  }

  function onSelectionChange({ detail }: CustomEvent<Array<ExtendedOption>>) {
    const [originalSelected] = detail
    const selected = originalSelected ? decodeOption(originalSelected) : undefined

    onChange(selected)

    if (!selected && formAPI) return formAPI.updateField(name, undefined)
    if (!selected) return

    onChoose(selected)

    if (!formAPI) return

    formAPI.updateField(name, selected.value)
    if (errorMessage) formAPI.validateField(name)
  }

  async function fetchItems(query: MinimalFilterQuery): Promise<BasicOption[]> {
    if (!fetchFunction) throw new Error('[FormAddressSelector] fetchFunction must be provided')

    const items = await fetchFunction(query)
    const search = query.search?.trim() || ''
    const normalizedItems = items.map(encodeOption)

    return search !== ''
      ? normalizedItems.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
      : normalizedItems
  }

  async function loadValue(v?: string) {
    if (!v) {
      selectedValue = undefined
      return
    }

    const encodedValue = encodeURIComponent(v)
    const addresses = await fetchItems({})
    const addressHit = addresses.find(address => address.value === encodedValue)
    const selectedAddress = addressHit ? addressHit : addresses.find(address => address.value.startsWith(encodedValue))

    if (!selectedAddress) return

    selectedValue = {
      ...selectedAddress,
    }
  }

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error
  $: loadValue(value)
  $: locked = formAPI?.locked || false
  $: readOnlyAttr = readonly ? { name: value as string, vat: '' } : undefined
</script>

{#if readonly}
  <ReadOnlyMultiselect
    class={$$restProps.class || 'w-full'}
    attr={readOnlyAttr}
    {width}
    {label}
    {placeholder}
    {name}
    {id}
    {showLabel} />
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
          disabled={disabled || locked}
          {warning}
          fetchFunction={fetchItems}
          itemRendererComponent={AddressSingleRenderer}
          value={selectedValue ? [selectedValue] : []}
          error={errorMessage}
          options={[]}
          emptyText={$_('No Addresses Found')}
          class="w-full {$$restProps.class || ''}"
          multiselection={false}
          shouldFilter={false}
          allowClear
          triggerAutoWidth
          on:change={onSelectionChange}
          on:change />
      </div>
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} class={$$restProps.class || 'w-full'} />
{/if}
