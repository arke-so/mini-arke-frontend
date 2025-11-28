import { createClientApiConfig } from '$api/clients-utils/iam-client-side'
import { NotificationsApi, type NotificationSummary } from '$api/iam'
import {
  InternalNotificationTypesMap,
  type InternalUserNotification,
  type UserNotificationActionType,
} from '$fixtures/user-notifications'
import { notificationsStore } from '$stores/user-notifications'
import type { NotificationEventPayload } from './routes'

export function isUserActionableNotification(notification: InternalUserNotification): boolean {
  if (!notification.type) return false

  return InternalNotificationTypesMap[notification.type]?.hasUserActions?.(notification) || false
}

export function enrichNotification(notification: NotificationSummary): InternalUserNotification | null {
  if (!notification.type || !InternalNotificationTypesMap[notification.type]) return null

  const meta = InternalNotificationTypesMap[notification.type] || {
    message: notification.type,
    hasUserActions: () => false,
  }

  return {
    ...notification,
    ...meta,
    id: notification?.id || Math.random().toString(),
  }
}

export function enrichNotificationsList(notifications: Array<NotificationSummary>): Array<InternalUserNotification> {
  let result: Array<InternalUserNotification> = []

  notifications.forEach(notification => {
    const enriched = enrichNotification(notification)

    if (enriched) result.push(enriched)
    else console.warn('[warning] No existing mapping for notification', notification)
  })

  return result
}

export function getNotificationEventPayload(
  notification: InternalUserNotification | null,
  action: UserNotificationActionType,
): NotificationEventPayload {
  return {
    notificationId: notification?.id || '',
    action,
  }
}

export async function aknowledgeNotification(id: string) {
  const involvedNotifications = notificationsStore.findRelatedNotifications(id)
  const involvedIds = involvedNotifications.map(n => n.id)

  if (involvedNotifications.length === 0) return

  const notificationsApi = new NotificationsApi(createClientApiConfig())
  await Promise.all(involvedIds.map(notificationId => notificationsApi.acknowledgeNotification({ notificationId })))
  notificationsStore.aknowledgeNotifications(involvedIds)
}
