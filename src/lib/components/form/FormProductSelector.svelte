<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/product-client-side'
  import { DefaultApi, ListProductsModeEnum, type ProductSummary } from '$api/product'
  import { browser } from '$app/environment'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import ProductSingleRenderer from '$components/form/multiselect/ProductSingleRenderer.svelte'
  import ReadOnlyMultiselect from '$components/form/multiselect/ReadOnlyMultiselect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import { type MinimalFilterQuery } from '$utils/filters'
  import type { ExtendedOption } from '$utils/generics'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let productAttr: any | undefined = undefined
  export let label: string = $_('Product')
  export let placeholder: string | undefined = $_('Select Product Placeholder')
  export let name: string = 'productId'
  export let id: string = name
  export let error: string | undefined = ''
  export let warning: string | undefined = ''
  export let warningPosition: FormFieldMessagePosition | undefined = undefined
  export let align: 'start' | 'end' | 'center' = 'end'
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let mode: ListProductsModeEnum = ListProductsModeEnum.All
  export let width: string = FormFieldClass.SelectorDefaultWidth
  export let contentWidth: string = width
  export let fetchFunction: ((query: MinimalFilterQuery) => Promise<ProductSummary[]>) | undefined = undefined
  export let onChoose: (item: ProductSummary) => void = () => {}
  export let onChange: (item: ExtendedOption | undefined) => void = () => {}

  let productsList: Array<ProductSummary> = []

  const productsApi = new DefaultApi(createClientApiConfig())
  const dispatch = createEventDispatcher()

  function onProductChange({ detail }: CustomEvent<Array<ExtendedOption>>) {
    const [product] = detail

    onChange(product)

    if (!product) {
      dispatch('clear')
      if (!formAPI) return

      return formAPI.updateField(name, undefined)
    }

    const hit = productsList.find(m => m.id === product.value)
    dispatch('choose', hit)
    onChoose(hit as ProductSummary)

    if (!formAPI) return

    formAPI.updateField(name, product.value)
    if (errorMessage) formAPI.validateField(name)
  }

  async function fetchItems(query: MinimalFilterQuery): Promise<ProductSummary[]> {
    if (fetchFunction) return fetchFunction(query)

    return productsApi.listProducts({
      ...query,
      mode,
    })
  }

  async function defaultFetchFunction(query: MinimalFilterQuery): Promise<ExtendedOption[]> {
    productsList = await fetchItems(query)

    return productsList.map((product: ProductSummary) => ({
      label: product.name,
      value: product.id as string,
      attr: product as any,
    }))
  }

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error
  $: selectedValue = productAttr ? { label: productAttr.name, value: productAttr.id as string } : undefined
</script>

{#if readonly}
  <ReadOnlyMultiselect
    class="{$$restProps.class || ''} {width}"
    attr={productAttr}
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
          {disabled}
          {warning}
          itemRendererComponent={ProductSingleRenderer}
          fetchFunction={defaultFetchFunction}
          value={selectedValue ? [selectedValue] : []}
          error={errorMessage}
          options={[]}
          emptyText={$_('No Products Found')}
          class="w-full {$$restProps.class || ''}"
          multiselection={false}
          shouldFilter={false}
          allowClear
          triggerAutoWidth
          on:change={onProductChange}
          on:change />
      </div>
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} />
{/if}
