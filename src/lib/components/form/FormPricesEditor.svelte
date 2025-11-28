<script lang="ts">
  import type { PricesAttr, PricesAttrCurrencyEnum, PricesAttrDealsInner } from '$api/supply'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Table } from '$ds/components/ui/_table'
  import { Label } from '$ds/components/ui/label'
  import { DEFAULT_CURRENCY_CODE } from '$fixtures/currencies'
  import { currencyStringToFloat, floatStringToFloat, floatToCurrencyString } from '$utils/prices'
  import { getUOMDisplayedSymbol, getUOMStep } from '$utils/uom'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'
  import FormCurrency from './FormCurrency.svelte'
  import FormPriceField from './FormPriceField.svelte'
  import FormVatField from './FormVatField.svelte'
  import TextFieldRaw from './TextFieldRaw.svelte'
  import { FormFieldClass } from './form'

  export let formAPI: any = null
  export let name: string = 'prices'
  export let id: string = name
  export let label: string = $_('Prices')
  export let showLabel: boolean = true
  export let uom: string = 'unit'
  export let currency: string = DEFAULT_CURRENCY_CODE
  export let key: number | string | undefined = undefined
  export let showVAT: boolean = true
  export let value: PricesAttr = {
    currency: currency as PricesAttrCurrencyEnum,
    unit: 0,
    vat: 22,
    deals: [],
  }

  type DealInternal = {
    minQuantity: string
    unit: string
    category: string | undefined
  }

  const EMPTY_ITEM: DealInternal = { minQuantity: '', unit: '', category: '' }
  const TIME_THRESHOLD = 400
  const dispatch = createEventDispatcher()

  let timer: NodeJS.Timeout
  let internalValue = {
    unit: '',
    vat: '',
  }
  let internalItems: Array<DealInternal> = [{ ...EMPTY_ITEM }]

  function getEmptyItems() {
    return internalItems.filter(item => item.minQuantity === '' || item.unit === '')
  }

  function getCompletedItems() {
    return internalItems
      .filter(item => item.minQuantity !== '' && item.unit !== '')
      .map(({ category, minQuantity, unit }) => ({
        minQuantity: floatStringToFloat(minQuantity),
        unit: currencyStringToFloat(unit),
        category,
      }))
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

  function sortDeals(deals: Array<PricesAttrDealsInner>) {
    return deals.sort((a, b) => a.minQuantity - b.minQuantity)
  }

  function triggerChangeIfValid() {
    const deals = sortDeals(getCompletedItems())

    const lowestQtyDeal = deals[0]
    const nextValue = {
      ...internalValue,
      currency,
      unit: lowestQtyDeal?.unit || 0,
      vat: parseInt(internalValue.vat),
      deals,
    }

    dispatch('change', nextValue)

    if (!formAPI) return
    formAPI.updateField(name, nextValue)
  }

  function onPriceChange(item: DealInternal, value: string) {
    item.unit = value
    onChange(internalItems, internalValue.vat)
  }

  function onChange(_: Array<DealInternal>, vat: string) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(triggerChangeIfValid, TIME_THRESHOLD)
  }

  function loadData(_: number | string | undefined) {
    const editorValue: PricesAttr | undefined = formAPI?.form[name] || value

    if (!editorValue) return

    internalValue = {
      unit: editorValue.unit?.toString() || '',
      vat: editorValue.vat?.toString() || '',
    }

    internalItems = editorValue?.deals?.length
      ? editorValue.deals.map(deal => ({
          minQuantity: deal.minQuantity.toString(),
          unit: floatToCurrencyString(deal.unit),
          category: deal.category,
        }))
      : [{ ...EMPTY_ITEM }]

    onFocus()
  }

  $: loadData(key)
  $: onChange(internalItems, internalValue.vat)
  $: errorMessage = typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]
  $: uomSymbol = $_(getUOMDisplayedSymbol(uom))
  $: uomStep = getUOMStep(uom)
</script>

<div class="w-full">
  <div class="mb-4 hidden">
    <FormCurrency bind:value={currency} disabled />
  </div>

  <Label for={name} id="label-{id}" class="mb-1 block {showLabel ? '' : 'sr-only'}">{label}</Label>

  <Table.Root>
    <svelte:fragment slot="thead">
      <Table.Head>{$_('Price')}</Table.Head>
      <Table.Head>{$_('Quantity')}</Table.Head>
      <Table.Head>{$_('Category')}</Table.Head>
    </svelte:fragment>

    <svelte:fragment slot="tbody">
      {#each internalItems as item, index}
        <Table.Row>
          <Table.Cell flush>
            <FormPriceField
              name="unit-{index}"
              label={$_('Price')}
              showLabel={false}
              rounded={false}
              {currency}
              bind:value={item.unit}
              on:focus={onFocus}
              on:blur={onBlur}
              on:change={({ detail }) => onPriceChange(item, detail)}
              placeholder={$_('Price')}
              class={FormFieldClass.TableCell} />
          </Table.Cell>
          <Table.Cell flush>
            <TextFieldRaw
              type="number"
              name="minQuantity-{index}"
              label={$_('Min Quantity')}
              showLabel={false}
              rightLabel={uomSymbol}
              rounded={false}
              step={uomStep}
              min={1}
              bind:value={item.minQuantity}
              on:focus={onFocus}
              on:blur={onBlur}
              placeholder={$_('Quantity')}
              class="{FormFieldClass.TableCell} pr-12" />
          </Table.Cell>
          <Table.Cell flush>
            <TextFieldRaw
              name="category-{index}"
              label={$_('Category')}
              showLabel={false}
              bind:value={item.category}
              on:focus={onFocus}
              on:blur={onBlur}
              placeholder={$_('Category')}
              class={FormFieldClass.TableCell} />
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

  <div class="mt-4 {showVAT ? '' : 'sr-only'} {FormFieldClass.MaxWidth}">
    <FormVatField bind:value={internalValue.vat} />
  </div>
</div>
