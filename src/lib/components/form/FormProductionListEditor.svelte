<script lang="ts" context="module">
  export type ExtendedProductDetails = ProductDetails & {
    planned?: number
    inProduction?: number
  }

  export type QuantifiedProductItem = {
    name: string
    id: string
    internalId: string
    quantity: string
    lot?: string
    generatedLotId: boolean
    minQuantity?: number
    plannedQuantity?: number
    inProductionQuantity?: number
    productAttr: ExtendedProductDetails | undefined
    materials: Array<PricedQuantifiedItem>
    plan: PlanPhase[]
  }
</script>

<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/product-client-side'
  import {
    DefaultApi,
    type PlanPhase,
    type ProductDetails,
    type ProductInventoryItemSummary,
    type ProductSummary,
  } from '$api/product'
  import { type PricedQuantifiedItem } from '$api/supply'
  import { UtilStyle } from '$components/utils'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Table, TableClass } from '$ds/components/ui/_table'
  import { Label } from '$ds/components/ui/label'
  import { UnitOfMeasures } from '$fixtures/uom'
  import { upsertProductRoute } from '$utils/routes'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'
  import { FormFieldClass } from './form'
  import FormNumericQuantity from './FormNumericQuantity.svelte'
  import FormProductLotSelector from './FormProductLotSelector.svelte'
  import FormProductSelector from './FormProductSelector.svelte'
  import FormSwitch from './FormSwitch.svelte'
  import TextFieldRaw from './TextFieldRaw.svelte'

  export let formAPI: any = null
  export let name: string = 'products'
  export let id: string = name
  export let label: string = $_('Products')
  export let showLabel: boolean = true
  export let key: string | number | undefined = undefined
  export let value: Array<ExtendedProductDetails> = []
  export let selectionReadonly: boolean = false
  export let showPlannedQuantity: boolean = false
  export let showInProductionQuantity: boolean = false
  export let showLot: boolean = false
  export let warnings: Array<any> = []
  export let customHandler: ((nextValue: Array<QuantifiedProductItem>) => Array<unknown>) | undefined = undefined
  export let preloadedProductId: string | undefined = undefined
  export let preloadedQuantity: string | undefined = undefined

  const dispatch = createEventDispatcher()
  const productsApi = new DefaultApi(createClientApiConfig())
  const EMPTY_ITEM: QuantifiedProductItem = {
    name: '',
    id: '',
    internalId: '',
    quantity: '1',
    minQuantity: 1,
    materials: [],
    plan: [],
    productAttr: undefined,
    generatedLotId: true,
    lot: undefined,
  }
  const TIME_THRESHOLD = 400

  let timer: NodeJS.Timeout
  let internalItems: Array<QuantifiedProductItem> = [{ ...EMPTY_ITEM }]
  let internalWarnings: Array<any> = []
  let isPreloading = false

  function getEmptyItems() {
    return internalItems.filter(item => item.id === '' || !item?.quantity)
  }

  function getCompletedItems(): Array<QuantifiedProductItem> {
    if (showPlannedQuantity)
      return internalItems.filter(
        item => !!item.id && !!item?.quantity && Number(item?.quantity) <= (item?.plannedQuantity || 1),
      )

    if (showInProductionQuantity)
      return internalItems.filter(
        item => !!item.id && !!item?.quantity && Number(item?.quantity) <= (item?.inProductionQuantity || 1),
      )

    return internalItems.filter(item => !!item.id && !!item?.quantity)
  }

  function onFocus() {
    // const emptyItems = getEmptyItems()
    // if (emptyItems.length < 1) {
    //   internalItems = [...internalItems, { ...EMPTY_ITEM }]
    // }
  }

  function onBlur() {
    // const emptyItems = getEmptyItems()
    // if (emptyItems.length > 1) {
    //   internalItems.splice(internalItems.length - 1, 1)
    //   internalItems = internalItems
    // }
  }

  function onProductCleared(index: number) {
    if (isNaN(index)) return

    internalItems[index] = { ...EMPTY_ITEM }
    internalItems = internalItems
  }

  async function onProductSelected({ detail }: CustomEvent<ProductSummary>, item: QuantifiedProductItem) {
    // console.log('onProductSelected', detail, item)
    const productId = detail.id as string

    item.id = productId
    item.name = detail.name
    item.internalId = detail.internalId as string
    item.lot = undefined
    item.generatedLotId = true

    internalItems = internalItems

    const productDetails = await productsApi.showProduct({ productId })

    item.productAttr = productDetails
    item.materials = productDetails.rawMaterials || []
    item.plan = productDetails.plan || []

    internalItems = internalItems

    // onFocus()
    // internalItems = internalItems
  }

  function onInventoryItemSelected({ detail }: CustomEvent<ProductInventoryItemSummary>, item: QuantifiedProductItem) {
    item.lot = detail.id
    internalItems = internalItems
  }

  function onClearInventoryItem(index: number) {
    if (isNaN(index)) return

    internalItems[index].lot = undefined
    internalItems[index].generatedLotId = true
    internalItems = internalItems
  }

  function onQuantityChange(item: QuantifiedProductItem, index: number) {
    if (!showPlannedQuantity && !showInProductionQuantity) return

    internalWarnings = []

    const plannedQuantity = item.plannedQuantity || 1
    const inProductionQuantity = item.inProductionQuantity || 1

    if (showPlannedQuantity && Number(item.quantity) > plannedQuantity) {
      internalWarnings[index] = {
        quantity: $_('Quantity Cannot Be Greater Than Planned Quantity'),
      }
    }

    if (showInProductionQuantity && Number(item.quantity) > inProductionQuantity) {
      internalWarnings[index] = {
        quantity: $_('Quantity Cannot Be Greater Than In Production Quantity'),
      }
    }
  }

  function triggerChangeIfValid() {
    const nextValue = getCompletedItems()

    dispatch('change', nextValue)

    if (!formAPI) return
    if (!!customHandler) {
      formAPI?.updateField(name, customHandler(nextValue))
      return
    }

    formAPI.updateField(name, nextValue)
  }

  function onChange(_: Array<QuantifiedProductItem>) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(triggerChangeIfValid, TIME_THRESHOLD)
  }

  async function preloadProduct(productId: string, quantity?: string) {
    if (!productId || isPreloading) return

    try {
      isPreloading = true
      const product = await productsApi.showProduct({ productId })

      if (product) {
        const qty = quantity ? quantity : '1'

        internalItems = [
          {
            id: productId,
            name: product.name,
            internalId: product.internalId || '',
            quantity: qty,
            minQuantity: 1,
            materials: product.rawMaterials || [],
            plan: product.plan || [],
            productAttr: product,
            generatedLotId: true,
            lot: undefined,
          },
        ]

        // Trigger change to update the form value
        triggerChangeIfValid()
      }
    } catch (error) {
      console.error('Error preloading product')
    } finally {
      isPreloading = false
    }
  }

  async function loadData(_: string | number | undefined, editorValue: Array<ExtendedProductDetails>) {
    if (!editorValue) return

    internalItems = editorValue?.length
      ? editorValue.map(item => ({
          name: item.name,
          id: item.id as string,
          internalId: item.internalId || '',
          quantity: '1',
          ...(item.planned ? { quantity: item.planned.toString() } : {}),
          ...(item.inProduction ? { quantity: item.inProduction.toString() } : {}),
          minQuantity: 1,
          ...(item.planned ? { plannedQuantity: item.planned } : {}),
          ...(item.inProduction ? { inProductionQuantity: item.inProduction } : {}),
          productAttr: item,
          materials: item.rawMaterials || [],
          plan: item.plan || [],
          generatedLotId: true,
        }))
      : [{ ...EMPTY_ITEM }]

    onFocus()
  }

  $: loadData(key, value)
  $: onChange(internalItems)
  $: if (preloadedProductId && !internalItems.some(item => item.id === preloadedProductId)) {
    preloadProduct(preloadedProductId, preloadedQuantity)
  }
  $: errorMessage = typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]
</script>

<div class="w-full">
  <Label for={name} id="label-{id}" class="mb-1.5 block {showLabel ? '' : 'sr-only'}">{label}</Label>

  <Table.Root>
    <svelte:fragment slot="thead">
      <Table.Head class={TableClass.NarrowMainCell}>{$_('Product')}</Table.Head>
      <Table.Head class="hidden min-w-48 md:table-cell">{$_('Product ID')}</Table.Head>

      {#if showLot}
        <Table.Head class="hidden md:table-cell">{$_('Lot')}</Table.Head>
      {/if}

      {#if showPlannedQuantity}
        <Table.Head class="w-48">{$_('Planned Quantity')}</Table.Head>
      {/if}

      {#if showInProductionQuantity}
        <Table.Head class="w-48">{$_('In Production')}</Table.Head>
      {/if}

      <Table.Head class="w-36">{$_('Quantity')}</Table.Head>
    </svelte:fragment>

    <svelte:fragment slot="tbody">
      {#each internalItems as item, index}
        <Table.Row>
          <Table.Cell flush class={TableClass.NarrowMainCell}>
            <FormProductSelector
              warning={warnings?.[index]?.name}
              warningPosition="floating-bottom"
              productAttr={item.id ? { id: item.id, name: item.name, internalId: item.internalId } : undefined}
              class="h-10 rounded-none border-transparent focus:border-primary"
              width={FormFieldClass.SelectorTableCellWidth}
              contentWidth={FormFieldClass.SelectorContentTableCellWidth}
              value={item.id}
              showLabel={false}
              readonly={selectionReadonly}
              on:choose={() => dispatch('product-updated', { index })}
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

          {#if showLot}
            <Table.Cell class="hidden md:table-cell" flush={!item.generatedLotId}>
              {#if item.generatedLotId && !item.lot}
                <FormSwitch
                  bind:checked={item.generatedLotId}
                  disabled={!item.id}
                  name="customLotId-{index}"
                  label={$_('System Generated Lot ID Label')}
                  class="text-xs" />
              {:else}
                <FormProductLotSelector
                  warning={warnings?.[index]?.name}
                  warningPosition="floating-bottom"
                  productId={item.id}
                  class="h-10 rounded-none border-transparent focus:border-primary"
                  width="min-w-40 w-40 md:w-48 overflow-hidden overflow-ellipsis"
                  value={item.id}
                  showLabel={false}
                  on:clear={() => onClearInventoryItem(index)}
                  on:choose={event => onInventoryItemSelected(event, item)} />
              {/if}
            </Table.Cell>
          {/if}

          {#if showPlannedQuantity}
            <Table.Cell flush>
              <TextFieldRaw
                name="inProductionQuantity-{index}"
                label={$_('In Production Quantity')}
                showLabel={false}
                {...{
                  ...{},
                  /* TODO: fix this*/
                  /* @ts-ignore */
                }}
                uom={item?.productAttr?.uom || UnitOfMeasures.Default}
                value={item.plannedQuantity}
                placeholder={$_('Planned Quantity')}
                class="{FormFieldClass.TableCell} pr-12"
                disabled />
            </Table.Cell>
          {/if}

          {#if showInProductionQuantity}
            <Table.Cell flush>
              <TextFieldRaw
                name="inProgressQuantity-{index}"
                label={$_('In Production')}
                showLabel={false}
                {...{
                  ...{},
                  /* TODO: fix this*/
                  /* @ts-ignore */
                }}
                uom={item?.productAttr?.uom || UnitOfMeasures.Default}
                value={item.inProductionQuantity}
                placeholder={$_('In Production')}
                class="{FormFieldClass.TableCell} pr-12"
                disabled />
            </Table.Cell>
          {/if}

          <Table.Cell flush class="md:min-w-40">
            <FormNumericQuantity
              type="number"
              name="minQuantity-{index}"
              label={$_('Min Quantity')}
              showLabel={false}
              max={item.plannedQuantity || undefined}
              warning={warnings?.[index]?.quantity}
              error={internalWarnings?.[index]?.quantity}
              warningPosition="floating-bottom"
              errorPosition="floating-bottom"
              {...{
                ...{},
                /* TODO: fix this*/
                /* @ts-ignore */
              }}
              uom={item?.productAttr?.uom || UnitOfMeasures.Default}
              value={item.quantity}
              on:change={({ detail }) => {
                item.quantity = detail
                onQuantityChange(item, index)
              }}
              on:focus={onFocus}
              on:blur={onBlur}
              placeholder={$_('Quantity')}
              class="{FormFieldClass.TableCell} pr-12"
              disabled={item.plannedQuantity !== undefined || item.inProductionQuantity !== undefined} />
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
