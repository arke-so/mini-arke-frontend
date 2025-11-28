<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/product-client-side'
  import { createClientApiConfig as salesClientApiConfig } from '$api/clients-utils/sales-client-side'
  import type { DateAttr, PricesAttr, ProductInventoryItemSummary, ProductSummary } from '$api/product'
  import { DefaultApi, ListProductInventoryItemByProductModeEnum, ListProductsModeEnum } from '$api/product'
  import { DefaultApi as SalesDefaultApi } from '$api/sales'
  import { PricesAttrCurrencyEnum, type PricedQuantifiedItem } from '$api/supply'
  import { browser } from '$app/environment'
  import { UtilStyle } from '$components/utils'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Table } from '$ds/components/ui/_table'
  import { Button } from '$ds/components/ui/button'
  import * as Collapsible from '$ds/components/ui/collapsible'
  import { Label } from '$ds/components/ui/label'
  import * as Tooltip from '$ds/components/ui/tooltip'
  import { DEFAULT_CURRENCY_CODE } from '$fixtures/currencies'
  import { UnitOfMeasures } from '$fixtures/uom'
  import { isMobile } from '$stores/app'
  import { getCurrencyDisplayedSybol } from '$utils/currencies'
  import { type FilterQuery, type MinimalFilterQuery } from '$utils/filters'
  import { floatStringToFloat, floatToCurrencyString } from '$utils/prices'
  import { upsertProductRoute } from '$utils/routes'
  import { getUOMMinQuantity } from '$utils/uom'
  import { BadgeEuro } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'
  import { FormFieldClass } from './form'
  import FormNumericQuantity from './FormNumericQuantity.svelte'
  import FormPriceField from './FormPriceField.svelte'
  import FormProductLotSelector from './FormProductLotSelector.svelte'
  import FormProductsCSVImport from './FormProductsCSVImport.svelte'
  import FormProductSelector from './FormProductSelector.svelte'
  import IconButton from './IconButton.svelte'
  import TextFieldRaw from './TextFieldRaw.svelte'

  export let formAPI: any = null
  export let name: string = 'products'
  export let id: string = name
  export let label: string = $_('Products')
  export let showLabel: boolean = true
  export let key: string | number | undefined = undefined
  export let value: Array<PricedQuantifiedItem> = []
  export let showPrice: boolean = false
  export let editablePrice: boolean = true
  export let showQuantity: boolean = true
  export let warnings: Array<any> = []
  export let disabled: boolean = false
  export let showLot: boolean = false
  export let showCSVImport: boolean = false
  export let useCustomerPriceList: boolean = false
  export let customerId: string | null = null
  export let orderId: string | undefined = undefined
  export let warehouseId: string | undefined = undefined
  export let mode: ListProductsModeEnum = ListProductsModeEnum.All
  export let feedProducts: Array<PricedQuantifiedItem> = []
  export let fetchProducts: ((query: Partial<FilterQuery>) => Promise<ProductSummary[]>) | undefined = undefined
  export let customHandler: ((nextValue: Array<PricedQuantifiedItem>) => Array<unknown>) | undefined = undefined
  export let onUpdate: (nextValue: Array<PricedQuantifiedItem>) => void = () => {}
  export let onCsvImportComplete: (importedProducts: PricedQuantifiedItem[]) => void = () => {}

  type InternalPricedQuantifiedItem = {
    name: string
    id: string
    extraId: string
    quantity: string
    minQuantity?: number
    maxQuantity?: number
    lotMaxQuantity?: number
    attr?: ProductSummary
    currency: string
    deals: Array<any>
    unit: string
    vat: string
    uom: string
    orderId?: string
    lot?: string
    itemId?: string
    customerPrice?: PricedQuantifiedItem | undefined
    offerId?: string
    offerInternalId?: string
  }

  const dispatch = createEventDispatcher()
  const productsApi = new DefaultApi(createClientApiConfig())
  const salesApi = new SalesDefaultApi(salesClientApiConfig())
  const EMPTY_ITEM: InternalPricedQuantifiedItem = {
    name: '',
    id: '',
    extraId: '',
    quantity: '0',
    minQuantity: 1,
    attr: undefined,
    currency: DEFAULT_CURRENCY_CODE,
    deals: [],
    unit: '0',
    vat: '0',
    uom: UnitOfMeasures.Default,
  }
  const TIME_THRESHOLD = 400

  let timer: NodeJS.Timeout
  let internalItems: Array<InternalPricedQuantifiedItem> = [{ ...EMPTY_ITEM }]
  let internalWarnings: Array<any> = []
  let csvImportOpen = false
  let isHovering = false
  let customerPriceList: Array<PricedQuantifiedItem> = []

  function internalItemsToQuantifiedItems(items: Array<InternalPricedQuantifiedItem>): Array<PricedQuantifiedItem> {
    return items.map(
      ({
        name,
        quantity,
        extraId,
        id,
        unit,
        vat,
        currency,
        uom,
        deals,
        lot,
        itemId,
        orderId,
        offerId,
        offerInternalId,
      }) => ({
        name,
        quantity: parseFloat(quantity),
        extraId,
        id,
        uom,
        lot,
        itemId,
        orderId,
        prices: {
          deals,
          unit: floatStringToFloat(unit),
          vat: parseInt(vat),
          currency: currency as PricesAttrCurrencyEnum,
        },
        meta: {
          offerId,
          offerInternalId,
        },
      }),
    )
  }

  function pricesToPricesAttr(item: InternalPricedQuantifiedItem): PricesAttr {
    return {
      unit: floatStringToFloat(item.unit),
      vat: parseInt(item.vat),
      currency: item.currency as PricesAttrCurrencyEnum,
      deals: item.deals || [],
    }
  }

  function isValidItem(item: InternalPricedQuantifiedItem): boolean {
    return !!item.name && !!item.id && !!item?.quantity
  }

  function isEmptyItem(item: InternalPricedQuantifiedItem): boolean {
    return item.name === '' || item.id === '' || !item?.quantity
  }

  function getEmptyItems() {
    if (showLot) return internalItems.filter(item => isEmptyItem(item) || !item?.lot)

    return internalItems.filter(isEmptyItem)
  }

  function getCompletedItems(): Array<PricedQuantifiedItem> {
    if (showLot)
      return internalItemsToQuantifiedItems(
        internalItems.filter(item => {
          const qty = Number(item.quantity)
          const itemLotMaxQuantity = item.lotMaxQuantity || 1
          return isValidItem(item) && !!item.lot && qty > 0 && qty <= itemLotMaxQuantity
        }),
      )

    return internalItemsToQuantifiedItems(internalItems.filter(isValidItem))
  }

  function onFocus() {
    const emptyItems = getEmptyItems()

    if (!locked && emptyItems.length < 1) {
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

    internalItems.splice(index, 1)
    internalWarnings.splice(index, 1)

    if (internalItems.length === 0) {
      internalItems = [{ ...EMPTY_ITEM }]
      internalWarnings = []
    }

    internalItems = internalItems
  }

  function onProductSelected({ detail }: CustomEvent<ProductSummary>, item: InternalPricedQuantifiedItem) {
    const smallestQtyDeal = detail?.prices?.deals?.sort((a, b) => a.minQuantity - b.minQuantity)[0]

    item.attr = detail
    item.id = detail.id as string
    item.extraId = detail.internalId as string
    item.name = detail.name
    item.quantity = getUOMMinQuantity(detail.uom || UnitOfMeasures.Default).toString() || '1'
    item.minQuantity = 1
    item.uom = detail.uom || UnitOfMeasures.Default
    item.vat = (detail?.prices?.vat || 0).toString()
    item.currency = detail.prices?.currency || DEFAULT_CURRENCY_CODE
    item.unit = floatToCurrencyString(detail.prices?.unit || 0)

    onQuantityChange(item)
    onFocus()
    internalItems = internalItems
  }

  function onLotCleared(index: number) {
    if (isNaN(index)) return

    internalItems[index].lot = undefined
    internalItems[index].itemId = undefined
    onQuantityChange(internalItems[index])
    internalItems = internalItems
  }

  function onLotSelected(event: CustomEvent<ProductInventoryItemSummary>, item: InternalPricedQuantifiedItem) {
    const { id: itemId, lot, buckets, orderId: lotOrderId } = event.detail
    item.itemId = itemId
    item.lot = lot
    item.lotMaxQuantity = buckets?.available || 0
    item.orderId = lotOrderId
    onQuantityChange(item)
    onFocus()
    internalItems = internalItems
  }

  async function onQuantityChange(item: InternalPricedQuantifiedItem, index?: number) {
    if (showPrice) updatePriceByDeal(item)
    if (showLot) handleWarningsByLot(item)
  }

  function getProductPrices(item: InternalPricedQuantifiedItem): PricesAttr | undefined {
    item.customerPrice = undefined
    item.offerId = undefined
    item.offerInternalId = undefined

    if (useCustomerPriceList && customerPriceList?.length) {
      const customerPrice = customerPriceList.find(p => p.id === item.id)

      item.customerPrice = customerPrice
      item.offerId = customerPrice?.meta?.offer_id
      item.offerInternalId = customerPrice?.meta?.offer_internal_id

      return customerPrice?.prices || item.attr?.prices || pricesToPricesAttr(item)
    }

    return item.attr?.prices || pricesToPricesAttr(item)
  }

  function updatePriceByDeal(item: InternalPricedQuantifiedItem) {
    const quantity = parseFloat(item.quantity)
    const productPrices = getProductPrices(item)
    const deals = [...(productPrices?.deals || [])].reverse()
    const deal = deals.find(d => d.minQuantity <= quantity)
    const unitPrice = deal?.unit || productPrices?.unit || 0

    item.unit = floatToCurrencyString(unitPrice)
    internalItems = internalItems
  }

  async function handleWarningsByLot(item: InternalPricedQuantifiedItem) {
    const index = internalItems.findIndex(i => i.itemId === item.itemId)

    internalWarnings[index] = null

    if (!item.itemId) return
    if (index === -1) return

    if (!disabled && item.lotMaxQuantity === undefined) {
      const { buckets } = await productsApi.showProductInventoryItem({ productInventoryItemId: item.itemId })
      item.lotMaxQuantity = buckets?.available || 0
    }

    const lotMaxQuantity = item.lotMaxQuantity

    if (lotMaxQuantity === undefined) return
    if (showLot && Number(item.quantity) > lotMaxQuantity) {
      internalWarnings[index] = {
        quantity: $_('Quantity Exceeds Lot Available Quantity'),
      }
    }
  }

  function onPriceChange(item: InternalPricedQuantifiedItem, value: string) {
    item.unit = value
    onChange(internalItems)
  }

  async function fetchLotItems(
    item: InternalPricedQuantifiedItem,
    query: MinimalFilterQuery,
  ): Promise<ProductInventoryItemSummary[]> {
    const inventoryItems = await productsApi.listProductInventoryItemByProduct({
      ...query,
      warehouseId,
      mode: ListProductInventoryItemByProductModeEnum.Available,
      productId: item.id,
    })

    return inventoryItems
      .filter(it => !!it.lot)
      .sort((a, b) => (a.created as DateAttr).at.getTime() - (b.created as DateAttr).at.getTime())
  }

  function triggerChangeIfValid() {
    const nextValue = getCompletedItems()

    dispatch('change', nextValue)
    onUpdate(nextValue)

    if (!formAPI) return
    if (!!customHandler) {
      formAPI?.updateField(name, customHandler(nextValue))
      return
    }

    formAPI.updateField(name, nextValue)

    if (errorMessage) formAPI.validateField(name)
  }

  function onChange(_: Array<InternalPricedQuantifiedItem>) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(triggerChangeIfValid, TIME_THRESHOLD)
  }

  async function onCustomerChange(cid: string | null) {
    customerPriceList = cid ? await salesApi.getCustomerPriceList({ customerId: cid }) : []

    internalItems.forEach(item => onQuantityChange(item))
  }

  async function loadData(_: string | number | undefined) {
    const editorValue: Array<PricedQuantifiedItem & { lot: string; itemId: string }> | undefined =
      formAPI?.form[name] || value

    if (!editorValue) return

    internalItems = editorValue?.length
      ? editorValue.map(item => ({
          name: item.name,
          quantity: item.quantity.toString(),
          extraId: item.extraId || '',
          id: item.id || '',
          deals: item.prices?.deals || [],
          currency: item.prices?.currency || DEFAULT_CURRENCY_CODE,
          unit: floatToCurrencyString(item.prices?.unit || 0),
          vat: (item.prices?.vat || 0).toString(),
          uom: item.uom || UnitOfMeasures.Default,
          lot: item.lot,
          itemId: item.itemId,
          orderId: item.orderId,
          offerId: item.meta?.offerId,
          offerInternalId: item.meta?.offerInternalId,
        }))
      : [{ ...EMPTY_ITEM }]

    if (browser && editorValue.length && showLot) internalItems.forEach(item => onQuantityChange(item))

    onFocus()
  }

  function loadFeedProducts(products: PricedQuantifiedItem[]) {
    const importedInternalItems: InternalPricedQuantifiedItem[] = products.map(item => ({
      name: item.name,
      quantity: item.quantity.toString(),
      extraId: item.extraId || '',
      id: item.id || '',
      deals: item.prices?.deals || [],
      currency: item.prices?.currency || DEFAULT_CURRENCY_CODE,
      unit: floatToCurrencyString(item.prices?.unit || 0),
      vat: (item.prices?.vat || 0).toString(),
      uom: item.uom || UnitOfMeasures.Default,
      orderId: item.orderId,
      minQuantity: 1,
    }))

    internalItems = [...importedInternalItems, { ...EMPTY_ITEM }]
    internalWarnings = []

    setTimeout(() => triggerChangeIfValid(), 0)
  }

  function onCSVImport(importedProducts: PricedQuantifiedItem[], closeCSVImport: boolean = true) {
    loadFeedProducts(importedProducts)
    onCsvImportComplete(importedProducts)
    if (closeCSVImport) csvImportOpen = false
  }

  $: locked = formAPI?.locked || disabled || false
  $: loadData(key)
  $: if (browser && useCustomerPriceList) onCustomerChange(customerId)
  $: onChange(internalItems)
  $: errorMessage = typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]
  $: if (feedProducts.length > 0) loadFeedProducts(feedProducts)
</script>

<div class="w-full" role="group" on:mouseenter={() => (isHovering = true)} on:mouseleave={() => (isHovering = false)}>
  <Label for={name} id="label-{id}" class="mb-1.5 block {showLabel ? '' : 'sr-only'}">{label}</Label>
  <div class="relative flex h-0 items-center justify-between">
    {#if !locked && showCSVImport}
      <IconButton
        variant="secondary"
        tooltip={$_('Import CSV')}
        on:click={() => (csvImportOpen = !csvImportOpen)}
        class="absolute -top-10 right-0 z-10 transition-opacity duration-200 {isHovering || csvImportOpen
          ? 'opacity-100'
          : 'opacity-0'}">
        <IcoNoir.Upload class={IconSize.Small} />
      </IconButton>
    {/if}
  </div>

  {#if showCSVImport}
    <Collapsible.Root bind:open={csvImportOpen}>
      <Collapsible.Content>
        <div class="border-t bg-muted/30 p-4">
          <h4 class="mb-3 text-sm font-medium">{$_('Import Products from CSV')}</h4>
          <FormProductsCSVImport disabled={locked} onImportComplete={onCSVImport} />
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  {/if}

  <Table.Root>
    <svelte:fragment slot="thead">
      <Table.Head main>{$_('Product')}</Table.Head>
      <Table.Head class="hidden min-w-48 md:table-cell">{$_('Product ID')}</Table.Head>

      {#if showLot}
        <Table.Head class="hidden md:table-cell">{$_('Lot')}</Table.Head>
      {/if}

      {#if showQuantity}
        <Table.Head class="w-36">{$_('Quantity')}</Table.Head>
      {/if}

      {#if showPrice}
        <Table.Head class="w-28">{$_('Price')}</Table.Head>
      {/if}

      {#if !$isMobile && showPrice}
        <Table.Head class="w-20">{$_('VAT')}</Table.Head>
      {/if}
    </svelte:fragment>

    <svelte:fragment slot="tbody">
      {#each internalItems as item, index}
        <Table.Row>
          <Table.Cell flush main>
            <FormProductSelector
              {mode}
              disabled={locked}
              fetchFunction={fetchProducts}
              warning={warnings?.[index]?.name}
              warningPosition="floating-bottom"
              productAttr={item.id ? { id: item.id, name: item.name, extraId: item.extraId } : undefined}
              class="h-10 rounded-none border-transparent focus:border-primary"
              width={FormFieldClass.SelectorTableCellWidth}
              contentWidth={FormFieldClass.SelectorContentTableCellWidth}
              value={item.id}
              showLabel={false}
              on:clear={() => onProductCleared(index)}
              on:choose={event => onProductSelected(event, item)} />
          </Table.Cell>
          <Table.Cell class="hidden px-2 md:table-cell">
            <div class="flex items-center justify-between gap-2">
              {#if item.extraId}
                <a
                  tabindex="-1"
                  class={UtilStyle.Link}
                  href={upsertProductRoute({ productId: item.id })}
                  target="_blank">
                  {item.extraId}
                </a>
              {:else}
                -
              {/if}

              {#if !!item.offerId}
                <Tooltip.Root openDelay={200} disableHoverableContent>
                  <Tooltip.Trigger asChild let:builder>
                    <Button size="icon" variant="link" builders={[builder]} tabindex={-1}>
                      <BadgeEuro
                        class="{IconSize.Medium} attention-seeker rounded-full text-muted-foreground shadow-muted-foreground/30" />
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content class="max-w-52">
                    <p>
                      {$_('Product Offer Tooltip', { values: { offer: item.offerInternalId } })}
                    </p>
                  </Tooltip.Content>
                </Tooltip.Root>
              {/if}
            </div>
          </Table.Cell>

          {#if showLot}
            <Table.Cell class="hidden md:table-cell" flush>
              <FormProductLotSelector
                attr={item.itemId ? { id: item.itemId, name: item.lot } : undefined}
                warning={warnings?.[index]?.name}
                warningPosition="floating-bottom"
                disabled={!item.id || locked}
                productId={item.id}
                class="h-10 rounded-none border-transparent focus:border-primary"
                width="min-w-40 w-40 md:w-48 overflow-hidden overflow-ellipsis"
                showLabel={false}
                fetchFunction={query => fetchLotItems(item, query)}
                on:clear={() => onLotCleared(index)}
                on:choose={event => onLotSelected(event, item)} />
            </Table.Cell>
          {/if}
          {#if showQuantity}
            <Table.Cell flush>
              <FormNumericQuantity
                type="number"
                name="minQuantity-{index}"
                label={$_('Min Quantity')}
                showLabel={false}
                disabled={!item.id || locked}
                uom={item?.uom || UnitOfMeasures.Default}
                value={item.quantity}
                warning={warnings?.[index]?.quantity}
                error={internalWarnings?.[index]?.quantity}
                warningPosition="floating-bottom"
                errorPosition="floating-bottom"
                on:change={({ detail }) => {
                  item.quantity = detail
                  onQuantityChange(item, index)
                }}
                on:focus={onFocus}
                on:blur={onBlur}
                placeholder={$_('Quantity')}
                class="{FormFieldClass.TableCell} pr-12" />
            </Table.Cell>
          {/if}

          {#if showPrice}
            <Table.Cell flush>
              <FormPriceField
                name="unit-{index}"
                label={$_('Price')}
                showLabel={false}
                rounded={false}
                disabled={locked || !editablePrice}
                currency={getCurrencyDisplayedSybol(item?.currency || DEFAULT_CURRENCY_CODE)}
                bind:value={item.unit}
                on:change={({ detail }) => onPriceChange(item, detail)}
                placeholder={$_('Price')}
                class={FormFieldClass.TableCell} />
            </Table.Cell>
          {/if}

          {#if !$isMobile && showPrice}
            <Table.Cell flush>
              <TextFieldRaw
                name="vat-{index}"
                label={$_('VAT')}
                rightLabel="%"
                showLabel={false}
                rounded={false}
                disabled={locked || !editablePrice}
                bind:value={item.vat}
                placeholder={$_('VAT')}
                class={FormFieldClass.TableCell} />
            </Table.Cell>
          {/if}
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
