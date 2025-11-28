import { createClientApiConfig } from '$api/clients-utils/supply-client-side'
import { OrderDetailsStatusEnum, OrdersApi, type BulkOrderDetails, type MissingRawMaterial } from '$api/supply'
import { goto } from '$app/navigation'
import { createConfirmable } from '$components/utils/ConfirmDialog.svelte'
import { DEFAULT_CURRENCY_CODE } from '$fixtures/currencies'
import { notifySuccess } from '$utils/notifications'
import { renderPrice } from '$utils/prices'
import { purchaseRoute } from '$utils/routes'

const ordersApi = new OrdersApi(createClientApiConfig())

export type WrappedMissingRawMaterial = {
  selected: boolean
  o: MissingRawMaterial
  id: string
  activeAlternative: MissingRawMaterial
}

export type SelectionCounts = {
  selectedCount: number
  ordersCount: number
  totalEstimatedCost: number
}

export type BulkPurchaseOrderOptions = {
  ordersCount: number
  totalEstimatedCost: number
  currency?: string
  items: WrappedMissingRawMaterial[]
  filterFunction?: (item: WrappedMissingRawMaterial) => boolean
  afterCreateOrdersCallback?: () => void | Promise<void>
  translations: {
    title: string
    message: (count: number, totalCost: string) => string
    confirmLabel: string
    successTitle: string
    successDescription: string
  }
}

export function isSuitableOfPurchase(item: WrappedMissingRawMaterial): boolean {
  return (item.o.inventory.missing || 0) > 0
}

export function calculateSelectionCounts(items: Array<WrappedMissingRawMaterial>): SelectionCounts {
  const suitableSelected = items.filter(isSuitableOfPurchase).filter(i => i.selected)
  
  return {
    selectedCount: suitableSelected.length,
    ordersCount: new Set(suitableSelected.map(i => i.activeAlternative.supplierId)).size,
    totalEstimatedCost: suitableSelected.reduce(
      (acc, item) =>
        acc +
        (item.activeAlternative.estimatedCost?.unit || 0) +
        ((item.activeAlternative.estimatedCost?.unit || 0) * (item.activeAlternative.estimatedCost?.vat || 0)) / 100,
      0,
    )
  }
}

export function createBulkPurchaseOrders(options: BulkPurchaseOrderOptions) {
  const {
    ordersCount,
    totalEstimatedCost,
    currency = DEFAULT_CURRENCY_CODE,
    items,
    filterFunction = (item) => (item.o.inventory.missing || 0) > 0 && item.selected,
    afterCreateOrdersCallback,
    translations,
  } = options

  function showConfirmDialog() {
    createConfirmable({
      title: translations.title,
      message: translations.message(ordersCount, renderPrice(totalEstimatedCost, currency)),
      confirmLabel: translations.confirmLabel,
      isDestructive: false,
      onConfirm: executeCreateOrders,
      target: null,
    })
  }

  async function executeCreateOrders() {
    const suitableSelected = items.filter(filterFunction)
    const bulkOrderDetails: Array<BulkOrderDetails> = suitableSelected.map(item => ({
      rawMaterialId: item.activeAlternative.id as string,
      quantity: item.activeAlternative.inventory.missing || 0,
    }))

    await ordersApi.createBulkOrder({ bulkOrderDetails })
    
    if (afterCreateOrdersCallback) await afterCreateOrdersCallback()

    goto(
      purchaseRoute({
        params: {
          query: JSON.stringify({
            status: OrderDetailsStatusEnum.Draft,
          }),
        },
      }),
    )
    notifySuccess({ 
      title: translations.successTitle, 
      description: translations.successDescription 
    })
  }

  showConfirmDialog()
}
