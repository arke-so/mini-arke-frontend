<script lang="ts" context="module">
  export type ExtendedProductDetails = ProductDetails & {
    planned?: number
    inProduction?: number
  }

  export type InternalPlanningProductItem = {
    name: string
    id: string
    internalId: string
    quantity: string
    uom: string
    priority: number
    productAttr?: ProductSummary
  }
</script>

<script lang="ts">
  import {
    ListProductsModeEnum,
    type ProductDetails,
    type ProductionPlanProduct,
    type ProductSummary,
  } from '$api/product'
  import PrioritySelector from '$components/orders/PrioritySelector.svelte'
  import { UtilStyle } from '$components/utils'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Table, TableClass } from '$ds/components/ui/_table'
  import { Label } from '$ds/components/ui/label'
  import { UnitOfMeasures } from '$fixtures/uom'
  import { upsertProductRoute } from '$utils/routes'
  import { _ } from 'svelte-i18n'
  import { FormFieldClass } from './form'
  import FormNumericQuantity from './FormNumericQuantity.svelte'
  import FormProductSelector from './FormProductSelector.svelte'

  export let formAPI: any = null
  export let name: string = 'products'
  export let id: string = name
  export let label: string = $_('Products')
  export let showLabel: boolean = true
  export let key: string | number | undefined = undefined
  export let value: Array<ProductionPlanProduct> = []
  export let warnings: Array<any> = []
  export let mode: ListProductsModeEnum = ListProductsModeEnum.All
  export let customHandler: ((nextValue: Array<ProductionPlanProduct>) => Array<unknown>) | undefined = undefined
  export let onUpdate: (nextValue: Array<ProductionPlanProduct>) => void = () => {}

  const EMPTY_ITEM: InternalPlanningProductItem = {
    name: '',
    id: '',
    internalId: '',
    quantity: '1',
    uom: UnitOfMeasures.Default,
    priority: 3,
  }
  const TIME_THRESHOLD = 400

  let timer: NodeJS.Timeout
  let internalItems: Array<InternalPlanningProductItem> = [{ ...EMPTY_ITEM }]
  let internalWarnings: Array<any> = []

  function getEmptyItems() {
    return internalItems.filter(item => item.id === '' || !item?.quantity)
  }

  function getCompletedItems(): Array<InternalPlanningProductItem> {
    return internalItems.filter(item => !!item.id && !!item?.quantity)
  }

  function onFocus() {
    const emptyItems = getEmptyItems()
    if (emptyItems.length < 1) {
      internalItems = [...internalItems, { ...EMPTY_ITEM }]
    }
  }

  function onBlur() {
    const emptyItems = getEmptyItems()
    if (emptyItems.length > 1) {
      internalItems.splice(internalItems.length - 1, 1)
      internalItems = internalItems
    }
  }

  function onProductCleared(index: number) {
    if (isNaN(index)) return

    internalItems[index] = { ...EMPTY_ITEM }
    internalItems = getCompletedItems()
    onFocus()
  }

  async function onProductSelected({ detail }: CustomEvent<ProductSummary>, item: InternalPlanningProductItem) {
    const productId = detail.id as string

    item.id = productId
    item.name = detail.name
    item.internalId = detail.internalId as string
    item.uom = detail.uom || UnitOfMeasures.Default
    item.productAttr = detail

    onFocus()
    internalItems = internalItems
  }

  function onQuantityChange(item: InternalPlanningProductItem, index: number) {
    internalWarnings = []
  }

  function toProductionPlanProduct(item: InternalPlanningProductItem): ProductionPlanProduct {
    return {
      id: item.id,
      name: item.name,
      internalId: item.internalId,
      quantity: Number(item.quantity),
      uom: item.uom,
      priority: item.priority,
      categories: [],
    }
  }

  function triggerChangeIfValid() {
    const nextValue = getCompletedItems().map(toProductionPlanProduct)

    onUpdate(nextValue)

    if (!formAPI) return
    if (!!customHandler) {
      formAPI?.updateField(name, customHandler(nextValue))
      return
    }

    formAPI.updateField(name, nextValue)
  }

  function onChange(_: Array<InternalPlanningProductItem>) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(triggerChangeIfValid, TIME_THRESHOLD)
  }

  async function loadData(_: string | number | undefined, v: Array<ProductionPlanProduct>) {
    const editorValue: Array<ProductionPlanProduct> = formAPI?.form[name] || v

    if (!editorValue) return

    internalItems = editorValue?.length
      ? editorValue.map(item => ({
          name: item.name as string,
          id: item.id as string,
          internalId: item.internalId || '',
          quantity: item.quantity?.toString() || '1',
          uom: item.uom || UnitOfMeasures.Default,
          priority: item.priority || 3,
        }))
      : [{ ...EMPTY_ITEM }]

    onFocus()
  }

  $: loadData(key, value)
  $: onChange(internalItems)
  $: errorMessage = typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]
</script>

<div class="w-full">
  <Label for={name} id="label-{id}" class="mb-1.5 block {showLabel ? '' : 'sr-only'}">{label}</Label>

  <Table.Root>
    <svelte:fragment slot="thead">
      <Table.Head class={TableClass.NarrowMainCell}>{$_('Product')}</Table.Head>
      <Table.Head class="hidden min-w-48 md:table-cell">{$_('Product ID')}</Table.Head>
      <Table.Head class="hidden min-w-48 md:table-cell">{$_('Priority')}</Table.Head>
      <Table.Head class="w-36">{$_('Quantity')}</Table.Head>
    </svelte:fragment>

    <svelte:fragment slot="tbody">
      {#each internalItems as item, index}
        <Table.Row>
          <Table.Cell flush class={TableClass.NarrowMainCell}>
            <FormProductSelector
              {mode}
              warning={warnings?.[index]?.name}
              warningPosition="floating-bottom"
              productAttr={item.id ? { id: item.id, name: item.name, internalId: item.internalId } : undefined}
              class="h-10 rounded-none border-transparent focus:border-primary"
              width={FormFieldClass.SelectorTableCellWidth}
              contentWidth={FormFieldClass.SelectorContentTableCellWidth}
              value={item.id}
              showLabel={false}
              on:clear={() => onProductCleared(index)}
              on:choose={event => onProductSelected(event, item)} />
          </Table.Cell>
          <Table.Cell class="hidden {TableClass.IDCell} px-2 md:table-cell">
            {#if item.internalId}
              <a tabindex="-1" class={UtilStyle.Link} href={upsertProductRoute({ productId: item.id })} target="_blank">
                {item.internalId}
              </a>
            {:else}
              -
            {/if}
          </Table.Cell>

          <Table.Cell class="hidden {TableClass.IDCell} px-2 md:table-cell">
            <PrioritySelector
              value={item.priority}
              disabled={!item.id}
              onChange={level => (item.priority = level.value)}
              class="h-10 w-full justify-end rounded-none border-transparent bg-transparent focus:border-primary" />
          </Table.Cell>

          <Table.Cell flush class="md:min-w-40">
            <FormNumericQuantity
              type="number"
              name="minQuantity-{index}"
              label={$_('Min Quantity')}
              disabled={!item.id}
              showLabel={false}
              warning={warnings?.[index]?.quantity}
              error={internalWarnings?.[index]?.quantity}
              warningPosition="floating-bottom"
              errorPosition="floating-bottom"
              {...{
                ...{},
                /* TODO: fix this*/
                /* @ts-ignore */
              }}
              uom={item?.uom || UnitOfMeasures.Default}
              value={item.quantity}
              on:change={({ detail }) => {
                item.quantity = detail
                onQuantityChange(item, index)
              }}
              on:focus={onFocus}
              on:blur={onBlur}
              placeholder={$_('Quantity')}
              class="{FormFieldClass.TableCell} pr-12" />
          </Table.Cell>
        </Table.Row>
      {/each}
    </svelte:fragment>
  </Table.Root>

  {#if !!errorMessage}
    <div id="error-{id}" class="mt-1 flex items-center gap-1 text-xs font-semibold text-destructive">
      <IcoNoir.LongArrowLeftUp class={IconSize.Small} />
      {errorMessage}
    </div>
  {/if}
</div>
