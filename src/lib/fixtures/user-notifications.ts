import type { NotificationSummary } from '$api/iam'
import ProductionPlannedNotification from '$components/user-notifications/notifications-types/ProductionPlannedNotification.svelte'
import ProductionStartedNotification from '$components/user-notifications/notifications-types/ProductionStartedNotification.svelte'
import ProductionUpdatedNotification from '$components/user-notifications/notifications-types/ProductionUpdatedNotification.svelte'
import PurchaseOrderNotification from '$components/user-notifications/notifications-types/PurchaseOrderNotification.svelte'
import QuoteNotification from '$components/user-notifications/notifications-types/QuoteNotification.svelte'
import SalesOrderNotification from '$components/user-notifications/notifications-types/SalesOrderNotification.svelte'
import SalesTransportDocumentNotification from '$components/user-notifications/notifications-types/SalesTransportDocumentNotification.svelte'
import SupplyTransportDocumentNotification from '$components/user-notifications/notifications-types/SupplyTransportDocumentNotification.svelte'
import TriggerNotification from '$components/user-notifications/notifications-types/TriggerNotification.svelte'
import { BadgeEuro, Bell, Cog, Package, ShoppingCart, Truck } from 'lucide-svelte'

export type InternalUserNotificationsProps = {
  hasUserActions?: (notification: InternalUserNotification) => boolean
  component?: ConstructorOfATypedSvelteComponent
  message?: string
  icon?: ConstructorOfATypedSvelteComponent
  iconClass?: string
}

export type InternalUserNotification<T = any> = NotificationSummary &
  InternalUserNotificationsProps & { id: string; metadata?: T }

export type UserNotificationMiddleware = (notifications: Array<InternalUserNotification>) => Array<InternalUserNotification>

export type UserNotificationActionPayload = {
  notification: InternalUserNotification
  action?: string
}

export const NOTIFICATIONS_LIMIT: number = 50



export const TriggerNotificationTypeEnum = Object.freeze({
  TriggerSupplyNeedsNotification: 'trigger_supply_needs_notification',
})

const SUPPLY_ICON_CLASS = 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
const SALES_ICON_CLASS = 'bg-pink-500/20 border border-pink-500/20 text-pink-600'
const PRODUCTION_ICON_CLASS = 'bg-violet-500/10 border border-violet-500/20 text-violet-600'

export const InternalNotificationTypesMap: Record<string, InternalUserNotificationsProps> = Object.freeze({
  PRODUCTION_STARTED: {
    hasUserActions: (n: InternalUserNotification<ProductionStartedNotificationPayload>) => (!!n.metadata?.quantity && !!n.metadata?.product_name),
    message: 'Notification A Production Of Number Of Products Was Started',
    component: ProductionStartedNotification,
    icon: Cog,
    iconClass: PRODUCTION_ICON_CLASS,
  },
  PRODUCTION_FINALIZED: {
    hasUserActions: () => true,
    message: 'Notification A Number Of Productions Were Planned',
    component: ProductionPlannedNotification,
    icon: Cog,
    iconClass: PRODUCTION_ICON_CLASS,
  },
  PRODUCTION_UPDATED: {
    hasUserActions: () => true,
    message: 'Notification A Production Status Was Updated By Number',
    component: ProductionUpdatedNotification,
    icon: Cog,
    iconClass: PRODUCTION_ICON_CLASS,
  },
  RAW_MATERIALS_RECEIVED: {
    hasUserActions: () => false,
    message: 'Notification Raw Materials Received',
    icon: Package,
    iconClass: SUPPLY_ICON_CLASS,
  },
  PURCHASE_ORDER_CREATED: {
    hasUserActions: () => false,
    message: 'Notification A Purchase Order Was Created',
    component: PurchaseOrderNotification,
    icon: ShoppingCart,
    iconClass: SUPPLY_ICON_CLASS,
  },
  PURCHASE_ORDER_SENT: {
    hasUserActions: () => false,
    message: 'Notification A Purchase Order Was Sent',
    component: PurchaseOrderNotification,
    icon: ShoppingCart,
    iconClass: SUPPLY_ICON_CLASS,
  },
  PURCHASE_ORDER_ACCEPTED: {
    hasUserActions: () => false,
    message: 'Notification A Purchase Order Was Accepted',
    component: PurchaseOrderNotification,
    icon: ShoppingCart,
    iconClass: SUPPLY_ICON_CLASS,
  },
  SUPPLY_TRANSPORT_DOCUMENT_CREATED: {
    hasUserActions: () => false,
    message: 'Notification A Supply Transport Document Was Created',
    component: SupplyTransportDocumentNotification,
    icon: Package,
    iconClass: SUPPLY_ICON_CLASS,
  },
  SUPPLY_TRANSPORT_DOCUMENT_ACCEPTED: {
    hasUserActions: () => false,
    message: 'Notification A Supply Transport Document Was Accepted',
    component: SupplyTransportDocumentNotification,
    icon: Package,
    iconClass: SUPPLY_ICON_CLASS,
  },
  NEW_SALES_ORDER_RECEIVED: {
    hasUserActions: () => false,
    message: 'Notification New Sales Order Received',
    component: SalesOrderNotification,
    icon: BadgeEuro,
    iconClass: SALES_ICON_CLASS,
  },
  SALES_ORDER_ACCEPTED: {
    hasUserActions: () => false,
    message: 'Notification A Sales Order Was Accepted',
    component: SalesOrderNotification,
    icon: BadgeEuro,
    iconClass: SALES_ICON_CLASS,
  },
  SALES_ORDER_CREATED: {
    hasUserActions: () => false,
    message: 'Notification A Sales Order Was Created',
    component: SalesOrderNotification,
    icon: BadgeEuro,
    iconClass: SALES_ICON_CLASS,
  },
  QUOTE_SENT: {
    hasUserActions: (n: InternalUserNotification) => !!n.metadata?.order_id && !!n.metadata?.id,
    message: 'Notification A Sales Order Quote Was Sent',
    component: QuoteNotification,
    icon: BadgeEuro,
    iconClass: SALES_ICON_CLASS,
  },
  QUOTE_CREATED: {
    hasUserActions: (n: InternalUserNotification) => !!n.metadata?.order_id && !!n.metadata?.id,
    message: 'Notification A Sales Order Quote Was Created',
    component: QuoteNotification,
    icon: BadgeEuro,
    iconClass: SALES_ICON_CLASS,
  },
  QUOTE_ACCEPTED: {
    hasUserActions: (n: InternalUserNotification) => !!n.metadata?.order_id && !!n.metadata?.id,
    message: 'Notification A Sales Order Quote Was Accepted',
    component: QuoteNotification,
    icon: BadgeEuro,
    iconClass: SALES_ICON_CLASS,
  },
  SALES_TRANSPORT_DOCUMENT_CREATED: {
    hasUserActions: () => false,
    message: 'Notification A Sales Transport Document Was Created',
    component: SalesTransportDocumentNotification,
    icon: Truck,
    iconClass: SALES_ICON_CLASS,
  },
  SALES_ORDER_SHIPPED: {
    hasUserActions: () => false,
    message: 'Notification A Sales Order Was Shipped',
    component: SalesTransportDocumentNotification,
    icon: Truck,
    iconClass: SALES_ICON_CLASS,
  },

  [TriggerNotificationTypeEnum.TriggerSupplyNeedsNotification]: {
    hasUserActions: () => true,
    message: 'Notification Recompute Supply Needs Due To Sales Orders',
    component: TriggerNotification,
    icon: Bell,
    iconClass: 'bg-amber-500/20 border border-amber-500',
  },
})

export const UserNotificationAction = Object.freeze({
  StartProduction: 'start-production',
  CompleteProduction: 'complete-production',
  SetupShipping: 'setup-shipping',
  ShowInventory: 'show-inventory',
  CalculateSupplyNeeds: 'calculate-supply-needs',
  ShowSupplyTransportDocument: 'show-supply-transport-document',
  SetSalesOrdersPriority: 'set-sales-orders-priority',
  SmartFiltersApplied: 'smart-filters-applied',
})

export type UserNotificationActionType = (typeof UserNotificationAction)[keyof typeof UserNotificationAction]

export type ProductionStartedNotificationPayload = {
  id: string
  product_id: string
  product_name: string
  product_internal_id: string
  quantity: number
  uom: string
}

export type ProductionUpdatedNotificationPayload = {
  id: string
  product_id: string
  product_name: string
  product_internal_id: string
  quantity: number
  produced_quantity: number
  uom: string
}