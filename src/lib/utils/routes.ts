import { Products, TransportDocument, type ProductsType, type TransportDocumentType } from '$fixtures/routes'
import { APP_BASE_PATH } from '$lib/fixtures/constants'
import { stringifyJSON } from '$utils/json'
import { OffersListType } from './offers'

export type NotificationEventPayload = {
  notificationId: string
  action: string
}

export type RouteOptions = {
  useReferrer?: boolean
  returnURL?: string
  notificationEvent?: NotificationEventPayload
  params?: Record<string, string | undefined>
  cloneId?: string
  inputPayload?: unknown
  salesChannelId?: string
}

export const RouteQueryParam = Object.freeze({
  Referrer: 'ref',
  ReturnURL: 'returnURL',
  NotificationEventId: 'neid',
  NotificationEventAction: 'nea',
  CloneId: 'cloneId',
  InputPayload: 'inputPayload',
  SalesChannelId: 'channelId',
})

/**
 * Create a route by prepending the app base path to the given path
 * @param path {string} - the path to prepend
 * @returns {string} - the resulting path
 */
export function createRoute(path: string, options?: RouteOptions): string {
  const query = createQueryString(options)
  return createURL(path, query)
}

export function createQueryString(options: RouteOptions = {}): string {
  const params = new URLSearchParams()
  if (options?.useReferrer) params.set(RouteQueryParam.Referrer, 'true')
  if (options?.returnURL) params.set(RouteQueryParam.ReturnURL, encodeURIComponent(options.returnURL))
  if (options?.cloneId) params.set(RouteQueryParam.CloneId, options.cloneId)
  if (options?.salesChannelId || options?.salesChannelId === '') params.set(RouteQueryParam.SalesChannelId, options.salesChannelId)
  if (options?.inputPayload) {
    const payload = stringifyJSON(options.inputPayload)
    if (payload) params.set(RouteQueryParam.InputPayload, payload)
  }
  if (options?.notificationEvent) {
    params.set(RouteQueryParam.NotificationEventId, options.notificationEvent.notificationId)
    params.set(RouteQueryParam.NotificationEventAction, options.notificationEvent.action)
  }
  if (options?.cloneId) params.set('cloneId', options.cloneId)
  if (options?.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value) params.set(key, value)
    }
  }
  return params.toString()
}

export function createURL(path: string, query?: string): string {
  if (path.startsWith(APP_BASE_PATH)) return path + (query ? `?${query}` : '')
  return `${APP_BASE_PATH}${path}${query ? `?${query}` : ''}`
}

export const loginRouteId = () => '/login'
export const loginRoute = (returnURL?: string) => {
  if (returnURL) return `/login?returnURL=${encodeURIComponent(returnURL)}`

  return '/login'
}

export const healthRouteId = () => '/healthz'
export const healthRoute = () => '/healthz'

export const appRootRouteId = () => createRoute('/(index)')
export const appRootRoute = () => createRoute('')

export const salesRouteId = () => createRoute('/(index)/sales')
export const salesRoute = (options: RouteOptions = {}) => createRoute('/sales', options)

export const salesListRouteId = () => createRoute('/(index)/sales/list')
export const salesListRoute = (options: RouteOptions = {}) => createRoute('/sales/list', options)

export const purchaseRouteId = () => createRoute('/(index)/purchase')
export const purchaseRoute = (options: RouteOptions = {}) => createRoute('/purchase', options)

export const purchaseListRouteId = () => createRoute('/(index)/purchase/list')
export const purchaseListRoute = (options: RouteOptions = {}) => createRoute('/purchase/list', options)

export const purchaseNeedsRoute = (options: RouteOptions = {}) => createRoute('/purchase/needs', options)
export const purchaseNeedsRouteId = () => createRoute('/(index)/purchase/needs')

export const purchaseNeedsSoRoute = (options: RouteOptions = {}) => createRoute('/purchase/needs', options)
export const purchaseNeedsSoRouteId = () => createRoute('/(index)/purchase/needs')

export const purchaseCustomNeedsSoRoute = (options: RouteOptions = {}) => createRoute('/purchase/needs/custom-needs', options)
export const purchaseCustomNeedsSoRouteId = () => createRoute('/(index)/purchase/needs/custom-needs')

export const purchaseAssistantRoute = (options: RouteOptions = {}) => createRoute('/purchase/assistant', options)
export const purchaseAssistantRouteId = () => createRoute('/(index)/purchase/assistant')

export const productionRouteId = () => createRoute('/(index)/production')
export const productionRoute = () => createRoute('/production')

export const productionExecutionRouteId = () => createRoute('/(index)/production/execution')
export const productionExecutionRoute = (options: RouteOptions = {}) => createRoute(`/production/execution`, options)

export const productionXMissingMaterialsRouteId = () => createRoute('/(index)/production/execution/[pid]/supply-needs')
export const productionXMissingMaterialsRoute = ({
  productionItemId,
  ...options
}: RouteOptions & { productionItemId?: string } = {}) =>
  createRoute(`/production/execution/${productionItemId}/supply-needs`, options)

export const productionPlanningRouteId = () => createRoute('/(index)/production/planning')
export const productionPlanningRoute = (options: RouteOptions = {}) => createRoute('/production/planning', options)

export const productionWizardRouteId = () => createRoute('/(index)/production/planning/upsert')
export const productionWizardRoute = (options: RouteOptions = {}) => createRoute('/production/planning/upsert', options)

export const productionWizardLandingRouteId = () => createRoute('/(index)/production/planning/upsert/landing')
export const productionWizardLandingRoute = (options: RouteOptions = {}) =>
  createRoute('/production/planning/upsert/landing', options)

export const productionWizardSelectProductsRouteId = () => createRoute('/(index)/production/planning/upsert/input')
export const productionWizardSelectProductsRoute = (options: RouteOptions & { manual?: boolean } = {}) =>
  createRoute('/production/planning/upsert/input', {
    ...options,
    ...(options.manual ? { params: { manual: 'true', ...(options.params || {}) } } : {}),
  })

export const productionWizardConfigurationRouteId = () =>
  createRoute('/(index)/production/planning/upsert/configuration')
export const productionWizardConfigurationRoute = (options: RouteOptions = {}) =>
  createRoute('/production/planning/upsert/configuration', options)

export const productionWizardPreviewRouteId = () => createRoute('/(index)/production/planning/upsert/preview')
export const productionWizardPreviewRoute = (options: RouteOptions = {}) =>
  createRoute('/production/planning/upsert/preview', options)

export const workerProductionPhasesRouteId = () => createRoute('/worker/production')
export const workerProductionPhasesRoute = () => createRoute('/worker/production')

export const workerProductionPhaseUpsertRouteId = () => createRoute('/worker/production/[phase]')
export const workerProductionPhaseUpsertRoute = (phaseId: string) => createRoute(`/worker/production/${phaseId}`)

export const workerProductionUpsertProductionRouteId = () => createRoute('/worker/production/[phase]/upsert/[pid]')
export const workerProductionUpsertProductionRoute = ({ phaseId, productionId }: RouteOptions & { phaseId: string; productionId: string }) =>
  createRoute(`/worker/production/${phaseId}/upsert/${productionId}`)

export const workerProductionPhaseFinalizeRouteId = () => createRoute('/worker/production/[phase]/upsert/[pid]/finalize')
export const workerProductionPhaseFinalizeRoute = ({ phaseId, productionId }: RouteOptions & { phaseId: string; productionId: string }) =>
  createRoute(`/worker/production/${phaseId}/upsert/${productionId}/finalize`)

export const analyticsRouteId = () => createRoute('/(index)/analytics')
export const analyticsRoute = (options: RouteOptions = {}) => createRoute('/analytics', options)

export const analyticsPurchaseRouteId = () => createRoute('/(index)/analytics/purchase')
export const analyticsPurchaseRoute = (options: RouteOptions = {}) => createRoute('/analytics/purchase', options)

export const planProductionRouteId = () => createRoute('/(index)/production/plan')
export const planProductionRoute = (options?: RouteOptions) => createRoute('/production/plan', options)
export const startProductionRoute = ({
  productInventoryItemId = '',
  ...options
}: RouteOptions & { productInventoryItemId: string }) =>
  createRoute(`/production/start/${productInventoryItemId}`, options)
export const finishProductionRoute = ({
  productInventoryItemId = '',
  ...options
}: RouteOptions & { productInventoryItemId: string }) =>
  createRoute(`/production/finish/${productInventoryItemId}`, options)

export const goodsRouteId = () => createRoute('/(index)/goods')
export const goodsRoute = () => createRoute('/goods')

export const rawMaterialsRouteId = () => createRoute('/(index)/goods/materials')
export const rawMaterialsRoute = () => createRoute('/goods/materials')

// Updated to handle dynamic route parameters
export const productsRouteId = (productType: ProductsType = Products.Product) =>
  createRoute(`/(index)/goods/${productType}`)
export const productsRoute = (productType: ProductsType = Products.Product, options?: RouteOptions) =>
  createRoute(`/goods/${productType}`, options)

export const productBundlesRouteId = () => createRoute('/(index)/goods/bundles')
export const productBundlesRoute = (options?: RouteOptions) => createRoute('/goods/bundles', options)

export const stockRouteId = () => createRoute('/(index)/stock')
export const stockRoute = () => createRoute('/stock')

export const stockMaterialsRouteId = () => createRoute('/(index)/stock/materials')
export const stockMaterialsRoute = (options?: RouteOptions) => createRoute('/stock/materials', options)

export const stockProductsRouteId = () => createRoute('/(index)/stock/products')
export const stockProductsRoute = (options?: RouteOptions) => createRoute('/stock/products', options)

export const stockMaterialsEventsRouteId = () => createRoute('/(index)/stock/events/materials')
export const stockMaterialsEventsRoute = () => createRoute('/stock/events/materials')

export const stockProductsEventsRouteId = () => createRoute('/(index)/stock/events/products')
export const stockProductsEventsRoute = () => createRoute('/stock/events/products')

export const deliveryRouteId = (type: TransportDocumentType = TransportDocument.Inbound) =>
  createRoute(`/(index)/stock/delivery/${type}`)
export const deliveryRoute = (type: TransportDocumentType = TransportDocument.Inbound, options: RouteOptions = {}) =>
  createRoute(`/stock/delivery/${type}`, options)

export const upsertDeliveryDocumentRoute = (
  type: TransportDocumentType,
  documentId: string = '',
  options: RouteOptions = {},
) => createRoute(`/stock/delivery/${type}/upsert${documentId ? '/' + documentId : ''}`, options)

export const contactsRouteId = () => createRoute('/(index)/contacts')
export const contactsRoute = () => createRoute('/contacts')

export const suppliersRouteId = () => createRoute('/(index)/contacts/suppliers')
export const suppliersRoute = () => createRoute('/contacts/suppliers')

export const customersRouteId = () => createRoute('/(index)/contacts/customers')
export const customersRoute = () => createRoute('/contacts/customers')

export const customerAffiliatesRoute = ({ customerId, ...options }: RouteOptions & { customerId?: string } = {}) =>
  createRoute(`/contacts/customers/upsert/${customerId}/affiliates`, options)

export const customerPricesListRoute = ({ customerId, ...options }: RouteOptions & { customerId?: string } = {}) =>
  createRoute(`/contacts/customers/upsert/${customerId}/prices-list`, options)

export const customerOffersRoute = ({ customerId, type = OffersListType.Active, ...options }: RouteOptions & { customerId: string; type?: OffersListType }) =>
  createRoute(`/contacts/customers/upsert/${customerId}/offers/${type}`, options)

export const accountingRouteId = () => createRoute('/(index)/accounting')
export const accountingRoute = () => createRoute('/accounting')

export const toolsRouteId = () => createRoute('/(index)/tools')
export const toolsRoute = () => createRoute('/tools')

export const settingsRouteId = () => createRoute('/(index)/settings')
export const settingsRoute = (options: RouteOptions = {}) => createRoute('/settings', options)

export const usersRouteId = () => createRoute('/(index)/settings/users')
export const usersRoute = () => createRoute('/settings/users')

export const invoicingRouteId = () => createRoute('/(index)/settings/invoicing')
export const invoicingRoute = () => createRoute('/settings/invoicing')

export const productionSettingsRouteId = () => createRoute('/(index)/settings/production')
export const productionSettingsRoute = () => createRoute('/settings/production')

export const processesSettingsRouteId = () => createRoute('/(index)/settings/production/processes')
export const processesSettingsRoute = (options: RouteOptions = {}) =>
  createRoute('/settings/production/processes', options)

export const salesChannelsSettingsRouteId = () => createRoute('/(index)/settings/channels')
export const salesChannelsSettingsRoute = (options: RouteOptions = {}) => createRoute('/settings/channels', options)

export const warehousesSettingsRouteId = () => createRoute('/(index)/settings/warehouses')
export const warehousesSettingsRoute = (options: RouteOptions = {}) => createRoute('/settings/warehouses', options)

export const salesSettingsRouteId = () => createRoute('/(index)/settings/sales')
export const salesSettingsRoute = (options: RouteOptions = {}) => createRoute('/settings/sales', options)

export const preferencesSettingsRouteId = () => createRoute('/(index)/settings/preferences')
export const preferencesSettingsRoute = (options: RouteOptions = {}) => createRoute('/settings/preferences', options)

export const configSettingsRouteId = () => createRoute('/(index)/settings/config')
export const configSettingsRoute = (options: RouteOptions = {}) => createRoute('/settings/config', options)

export const configArketsSettingsRouteId = () => createRoute('/(index)/settings/config/arkets')
export const configArketsSettingsRoute = (options: RouteOptions = {}) => createRoute('/settings/config/arkets', options)

export const docNotesTemplateId = () => createRoute(`/(index)/settings/doc-notes`)
export const docNotesTemplate = (options: RouteOptions = {}) => createRoute(`/settings/doc-notes`, options)

export const docNotesRouteId = (template: string) => createRoute(`/(index)/settings/doc-notes/templates/${template}`)
export const docNotesRoute = (template: string, options: RouteOptions = {}) => createRoute(`/settings/doc-notes/templates/${template}`, options)

export const webhooksSettingsRouteId = () => createRoute('/(index)/settings/webhooks')
export const webhooksSettingsRoute = (options: RouteOptions = {}) => createRoute('/settings/webhooks', options)

export const upsertWebhookRouteId = () => createRoute('/(index)/settings/webhooks/upsert/[[webhookId]]')
export const upsertWebhookRoute = (webhookId: string = '', options: RouteOptions = {}) => 
  createRoute(`/settings/webhooks/upsert/${webhookId}`, options)

export const apiKeysSettingsRouteId = () => createRoute('/(index)/settings/api-keys')
export const apiKeysSettingsRoute = (options: RouteOptions = {}) => createRoute('/settings/api-keys', options)

export const upsertApiKeyRouteId = () => createRoute('/(index)/settings/api-keys/upsert/[[apiKeyId]]')
export const upsertApiKeyRoute = (apiKeyId: string = '', options: RouteOptions = {}) => 
  createRoute(`/settings/api-keys/upsert/${apiKeyId}`, options)

export const customFormRouteId = () => createRoute('/(index)/settings/forms/[module]/[domain]')
export const customFormRoute = (module: string, domain: string) => createRoute(`/settings/forms/${module}/${domain}`)

export const qrScanRoute = () => createRoute('/qr')

export const upsertUserRoute = (userId: string = '', useReferrer?: boolean) =>
  createRoute(`/settings/users/upsert/${userId}`, { useReferrer })

export const updatePasswordRoute = (userId: string = '', useReferrer?: boolean) =>
  createRoute(`/settings/users/upsert/${userId}/change-password/`, { useReferrer })

export const upsertSupplierRoute = (supplierId: string = '', useReferrer?: boolean) =>
  createRoute(`/contacts/suppliers/upsert/${supplierId}`, { useReferrer })

export const upsertCustomerRoute = (customerId: string = '', useReferrer?: boolean) =>
  createRoute(`/contacts/customers/upsert/${customerId}`, { useReferrer })

export const upsertCustomerOfferRoute = ({ customerId, offerId , ...options }: RouteOptions & { customerId: string; offerId?: string }) =>
  createRoute(`/contacts/customers/upsert/${customerId}/offers/upsert${offerId ? '/' + offerId : ''}`, options)

export const upsertMaterialRoute = ({ materialId, ...options }: RouteOptions & { materialId?: string } = {}) =>
  createRoute(`/goods/materials/upsert${materialId ? '/' + materialId : ''}`, options)

export const cloneMaterialRoute = ({ materialId, ...options }: RouteOptions & { materialId?: string } = {}) =>
  createRoute(`/goods/materials/upsert?cloneId=${materialId}`, options)

export const upsertMaterialAggregateRoute = (materialId: string, aggregateId: string = '', useReferrer?: boolean) =>
  createRoute(`/goods/materials/upsert/${materialId}/aggregates/${aggregateId}`, { useReferrer })

export const upsertAlternativeMaterialRoute = ({
  materialId,
  ...options
}: RouteOptions & { materialId?: string } = {}) =>
  createRoute(`/goods/materials/upsert/${materialId}/alternatives`, options)

export const upsertProductLandingRoute = (options: RouteOptions = {}) => createRoute(`/goods/products/upsert/landing`, options)

export const upsertProductRoute = ({
  productId,
  productType = Products.Product,
  purchasable,
  ...options
}: RouteOptions & { productId?: string; productType?: ProductsType; purchasable?: boolean } = {}) =>
  createRoute(`/goods/${productType}/upsert${productId ? '/' + productId : ''}`, {
    ...options,
    params: {
      ...options.params || {},
      purchasable: purchasable ? 'true' : undefined,
    },
  })

export const upsertProductSupplierRoute = ({ productId, supplierId = 'add', ...options }: RouteOptions & { productId?: string; supplierId?: string } = {}) =>
  createRoute(`/goods/products/upsert/${productId}/suppliers/${supplierId}`, options)

export const cloneProductRoute = ({
  productId,
  productType = Products.Product,
  ...options
}: RouteOptions & { productId?: string; productType?: ProductsType } = {}) =>
  createRoute(`/goods/${productType}/upsert?cloneId=${productId}`, options)

export const upsertProductBundleRoute = ({ bundleId, ...options }: RouteOptions & { bundleId?: string } = {}) => createRoute(`/goods/bundles/upsert${bundleId ? '/' + bundleId : ''}`, options)

export const documentExtractionRouteId = () => createRoute(`/document-extraction`)
export const documentExtractionRoute = (options?: RouteOptions) => createRoute('/document-extraction', options)

export const documentExtractionUploadRouteId = () => createRoute(`/document-extraction/upload`)
export const documentExtractionUploadRoute = (options?: RouteOptions) =>
  createRoute('/document-extraction/upload', options)

export const documentExtractionExtractionRouteId = () => createRoute(`/document-extraction/extraction`)
export const documentExtractionExtractionRoute = (options?: RouteOptions) =>
  createRoute('/document-extraction/extraction', options)

export const documentExtractionMatchingRouteId = () => createRoute(`/document-extraction/matching`)
export const documentExtractionMatchingRoute = (options?: RouteOptions) =>
  createRoute('/document-extraction/matching', options)

export const documentExtractionReviewRouteId = () => createRoute(`/document-extraction/review`)
export const documentExtractionReviewRoute = (options?: RouteOptions) =>
  createRoute('/document-extraction/review', options)

export const documentExtractionOrganizePhasesRouteId = () => createRoute(`/document-extraction/organize-phases`)
export const documentExtractionOrganizePhasesRoute = (options?: RouteOptions) =>
  createRoute('/document-extraction/organize-phases', options)

export const documentExtractionSaveRouteId = () => createRoute(`/document-extraction/save`)
export const documentExtractionSaveRoute = (options?: RouteOptions) => createRoute('/document-extraction/save', options)

export const upsertOrderRoute = ({ orderId, ...options }: RouteOptions & { orderId?: string } = {}) =>
  createRoute(`/purchase/upsert${orderId ? '/' + orderId : ''}`, options)

export const purchaseOrdersDeliveryRoute = (orderId: string, useReferrer?: boolean) =>
  createRoute(`/purchase/upsert/${orderId}/delivery`, { useReferrer })

export const salesOrdersShippingRoute = (orderId?: string, useReferrer?: boolean) =>
  createRoute(`/sales/upsert/${orderId}/shipping`, { useReferrer })

export const upsertTransportDocumentRoute = ({orderId, documentId = 'add',  ...options}: RouteOptions & { orderId?: string; documentId?: string }) =>
  createRoute(`/purchase/upsert/${orderId}/delivery/${documentId}`, options)

export const upsertSalesOrderTransportDocumentRoute = (
  orderId: string,
  documentId: string = 'add',
  useReferrer?: boolean,
) => createRoute(`/sales/upsert/${orderId}/shipping/${documentId}`, { useReferrer })

export const upsertSalesOrderRoute = ({ orderId = '', ...options }: RouteOptions & { orderId?: string } = {}) =>
  createRoute(`/sales/upsert${orderId ? '/' + orderId : ''}`, options)

export const upsertSalesOrderLandingRoute = (useReferrer?: boolean) =>
  upsertSalesOrderRoute({ orderId: 'landing', useReferrer })

export const upsertSalesOrderQuoteRoute = ({
  orderId = 'temp',
  quoteId = '',
  ...options
}: RouteOptions & { orderId?: string; quoteId?: string } = {}) =>
  createRoute(`/sales/upsert/${orderId}/quotes/${quoteId}`, options)

export const createMaterialStockAdjustmentRoute = (materialId: string = '', useReferrer?: boolean) =>
  createRoute(`/stock/adjustments/materials/${materialId}`, { useReferrer })

export const createProductStockAdjustmentRoute = (productId: string = '', useReferrer?: boolean) =>
  createRoute(`/stock/adjustments/products/${productId}`, { useReferrer })

export const adminRouteId = () => createRoute('/(index)/admin')
export const adminRoute = () => createRoute('/admin')

export const adminMaintenanceRouteId = () => createRoute('/(index)/admin/maintenance')
export const adminMaintenanceRoute = () => createRoute('/admin/maintenance')

export function isCurrentRoute(currentRouteId: string | null, routeId: string): boolean {
  return currentRouteId === routeId
}

export function urlParamsToObject(urlParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {}
  urlParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}
