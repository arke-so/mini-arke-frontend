<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/supply-client-side'
  import {
    InventoryApi,
    ListRawMaterialsModeEnum,
    PricesAttrCurrencyEnum,
    RawMaterialsApi,
    type PricedQuantifiedItem,
    type RawMaterialSummary,
  } from '$api/supply'
  import { UtilStyle } from '$components/utils'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Table } from '$ds/components/ui/_table'
  import { Label } from '$ds/components/ui/label'
  import { DEFAULT_CURRENCY_CODE } from '$fixtures/currencies'
  import { UnitOfMeasures } from '$fixtures/uom'
  import { isMobile } from '$stores/app'
  import { getCurrencyDisplayedSybol } from '$utils/currencies'
  import type { FilterQuery } from '$utils/filters'
  import { floatStringToFloat, floatToCurrencyString } from '$utils/prices'
  import { upsertMaterialRoute } from '$utils/routes'
  import { getUOMMinQuantity } from '$utils/uom'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'
  import FormNumericQuantity from './FormNumericQuantity.svelte'
  import FormPriceField from './FormPriceField.svelte'
  import FormRawMaterialSelector from './FormRawMaterialSelector.svelte'
  import TextFieldRaw from './TextFieldRaw.svelte'
  import { FormFieldClass } from './form'

  export let formAPI: any = null
  export let name: string = 'rawMaterials'
  export let id: string = name
  export let label: string = $_('Materials')
  export let showLabel: boolean = true
  export let key: string | number | undefined = undefined
  export let value: Array<PricedQuantifiedItem> = []
  export let supplierId: string | undefined = undefined
  export let multipleSuppliers: boolean = false
  export let showPrice: boolean = false
  export let showQuantity: boolean = true
  export let editablePrice: boolean = true
  export let disabled: boolean = false
  export let warnings: Array<any> = []
  export let mode: ListRawMaterialsModeEnum = ListRawMaterialsModeEnum.All
  export let checkInventory: boolean = false
  export let fetchMaterials: ((query: Partial<FilterQuery>) => Promise<RawMaterialSummary[]>) | undefined = undefined
  export let customHandler: ((nextValue: Array<PricedQuantifiedItem>) => Array<unknown>) | undefined = undefined
  export let onUpdate: (nextValue: Array<PricedQuantifiedItem>) => void = () => {}
  export let onItemsUpdate: (items: RawMaterialSummary[]) => void = () => {}

  type InternalPricedQuantifiedItem = {
    name: string
    id: string
    extraId: string
    quantity: string
    minQuantity?: number
    rawMaterialAttr?: RawMaterialSummary
    currency: string
    deals: Array<any>
    unit: string
    vat: string
    uom: string
  }

  const dispatch = createEventDispatcher()
  const inventoryApi = new InventoryApi(createClientApiConfig())
  const rawMaterialsApi = new RawMaterialsApi(createClientApiConfig())
  const EMPTY_ITEM: InternalPricedQuantifiedItem = {
    name: '',
    id: '',
    extraId: '',
    quantity: '0',
    minQuantity: 1,
    rawMaterialAttr: undefined,
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

  function getEmptyItems() {
    return internalItems.filter(item => item.name === '' || item.id === '' || !item?.quantity)
  }

  function getCompletedItems(): Array<PricedQuantifiedItem> {
    return internalItems
      .filter(item => !!item.name && !!item.id && !!item?.quantity)
      .map(({ name, quantity, extraId, id, unit, vat, currency, uom, deals }) => ({
        name,
        quantity: parseFloat(quantity),
        extraId,
        id,
        uom,
        prices: {
          deals,
          unit: floatStringToFloat(unit),
          vat: parseInt(vat),
          currency: currency as PricesAttrCurrencyEnum,
        },
      }))
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

  function onRawMaterialCleared(index: number) {
    if (isNaN(index)) return

    internalItems[index] = { ...EMPTY_ITEM }
    internalItems = internalItems
    internalWarnings[index] = null
  }

  function onRawMaterialSelected({ detail }: CustomEvent<RawMaterialSummary>, item: InternalPricedQuantifiedItem) {
    const smallestQtyDeal = detail?.prices?.deals?.sort((a, b) => a.minQuantity - b.minQuantity)[0]

    item.rawMaterialAttr = detail
    item.id = detail.id as string
    item.extraId = detail.externalId as string
    item.name = detail.name
    item.quantity = !!smallestQtyDeal?.minQuantity
      ? smallestQtyDeal?.minQuantity?.toString()
      : getUOMMinQuantity(detail.uom || UnitOfMeasures.Default).toString() || '1'
    item.minQuantity = smallestQtyDeal?.minQuantity
    item.uom = detail.uom || UnitOfMeasures.Default
    item.vat = (detail?.prices?.vat || 0).toString()
    item.currency = detail.prices?.currency || DEFAULT_CURRENCY_CODE
    item.unit = floatToCurrencyString(detail.prices?.unit || 0)

    onQuantityChange(item)
    onFocus()
    internalItems = internalItems
  }

  async function onQuantityChange(item: InternalPricedQuantifiedItem) {
    if (!item.id) return

    const quantity = parseFloat(item.quantity)
    let deals = [...(item.rawMaterialAttr?.prices?.deals || [])].reverse()

    if (!deals.length) {
      const rawMaterial = await rawMaterialsApi.showRawMaterial({ rawMaterialId: item.id })
      if (!rawMaterial) return

      deals = rawMaterial.prices?.deals || []
    }

    const deal = deals.find(d => d.minQuantity <= quantity)
    if (!deal) return

    item.unit = floatToCurrencyString(deal?.unit)
    internalItems = internalItems
    handleWarnings(item)
  }

  async function handleWarnings(item: InternalPricedQuantifiedItem) {
    if (!checkInventory) return

    const index = internalItems.findIndex(i => i.id === item.id)

    if (!item.id) return
    if (index === -1) return

    internalWarnings[index] = null

    const inventoryItems = await inventoryApi.listRawMaterialInventoryItemsByRawMaterial({
      rawMaterialId: item.id,
    })

    const inventoryItemId = inventoryItems.find(i => i.rawMaterialId === item.id)?.id

    if (!inventoryItemId) {
      internalWarnings[index] = { quantity: $_('Raw Material Not In Stock') }
      return
    }
    const { buckets } = await inventoryApi.getRawMaterialInventoryItem({ rawMaterialInventoryItemId: inventoryItemId! })

    if (Number(item.quantity) > (buckets?.inStock || 0)) {
      internalWarnings[index] = {
        quantity: $_('Quantity Exceeds Available Quantity'),
      }
    }
  }

  function onPriceChange(item: InternalPricedQuantifiedItem, value: string) {
    item.unit = value
    onChange(internalItems)
  }

  function onSupplierChange(_: string | undefined) {
    internalItems = [{ ...EMPTY_ITEM }]
  }

  function triggerChangeIfValid() {
    const nextValue = getCompletedItems()

    onItemsUpdate(internalItems.map(i => i.rawMaterialAttr).filter(i => !!i) as RawMaterialSummary[])
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

  async function loadData(_: string | number | undefined) {
    const editorValue: Array<PricedQuantifiedItem> | undefined = formAPI?.form[name] || value

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
        }))
      : [{ ...EMPTY_ITEM }]

    onFocus()
  }

  $: locked = formAPI?.locked || disabled || false
  $: onSupplierChange(supplierId)
  $: loadData(key)
  $: onChange(internalItems)
  $: errorMessage = typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]
</script>

<div class="w-full">
  <Label for={name} id="label-{id}" class="mb-1.5 block {showLabel ? '' : 'sr-only'}">{label}</Label>

  <Table.Root>
    <svelte:fragment slot="thead">
      <Table.Head main>{$_('Material')}</Table.Head>
      <Table.Head class="hidden min-w-48 md:table-cell">{$_('Material ID')}</Table.Head>

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
            <FormRawMaterialSelector
              {supplierId}
              {mode}
              warning={warnings?.[index]?.name}
              warningPosition="floating-bottom"
              fetchFunction={fetchMaterials}
              attr={item.id ? { id: item.id, name: item.name, extraId: item.extraId } : undefined}
              class="h-10 rounded-none border-transparent focus:border-primary"
              width={FormFieldClass.SelectorTableCellWidth}
              contentWidth={FormFieldClass.SelectorContentTableCellWidth}
              value={item.id}
              showLabel={false}
              disabled={(!supplierId && !multipleSuppliers) || disabled || locked}
              on:choose={() => dispatch('material-updated', { index })}
              on:clear={() => onRawMaterialCleared(index)}
              on:choose={event => onRawMaterialSelected(event, item)} />
          </Table.Cell>
          <Table.Cell class="hidden px-2 md:table-cell">
            {#if item.extraId}
              <a
                tabindex="-1"
                class={UtilStyle.Link}
                href={upsertMaterialRoute({ materialId: item.id })}
                target="_blank">
                {item.extraId}
              </a>
            {:else}
              -
            {/if}
          </Table.Cell>

          {#if showQuantity}
            <Table.Cell flush>
              <FormNumericQuantity
                type="number"
                name="minQuantity-{index}"
                label={$_('Min Quantity')}
                showLabel={false}
                uom={item?.uom || UnitOfMeasures.Default}
                value={item.quantity}
                disabled={!item.id || locked || disabled}
                error={internalWarnings?.[index]?.quantity}
                errorPosition="floating-bottom"
                on:change={({ detail }) => {
                  item.quantity = detail
                  onQuantityChange(item)
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
                disabled={disabled || locked || !editablePrice}
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
                value={item?.vat}
                disabled
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
