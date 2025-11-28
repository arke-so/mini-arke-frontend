import { createClientApiConfig } from '$api/clients-utils/iam-client-side'
import { NotificationsApi, type ListNotificationsRequest, type NotificationSummary } from '$api/iam'
import { NOTIFICATIONS_LIMIT, type InternalUserNotification } from '$fixtures/user-notifications'
import { enrichNotificationsList } from '$utils/user-notifications'
import { derived, get, writable } from 'svelte/store'

const notificationsApi = new NotificationsApi(createClientApiConfig())
const POLL_INTERVAL = 20_000

export type NotificationsStore = {
  initialized: boolean
  unreadCount: number
  notifications: Array<InternalUserNotification>
}

function createNotificationsStore() {
  const INITIAL_STATE: NotificationsStore = {
    initialized: false,
    unreadCount: 0,
    notifications: [],
  }
  const store = writable<NotificationsStore>(INITIAL_STATE)
  const { subscribe, update } = store

  let pollThread: NodeJS.Timeout | null = null
  let notificationsIdMap: Record<string, string> = {}

  async function fetchNotifications() {
    try {
      const currentState = get(store)
      const latestNotification = currentState.notifications[0] || null
      const from = latestNotification?.createdTs ? latestNotification?.createdTs : undefined

      const fetchingOptions: ListNotificationsRequest = {
        from,
        limit: NOTIFICATIONS_LIMIT,
      }
      const fetchedNotifications = await notificationsApi.listNotifications(fetchingOptions)
      const nextNotifications = enrichNotificationsList(fetchedNotifications)

      if (nextNotifications.length === 0) return

      setNotifications(nextNotifications)
    } catch (error) {
      console.error('[warning] Something went wrong while fetching notifications', error)
    }
  }

  function setNotifications(notifications: Array<InternalUserNotification>) {
    const filteredNotifications = notifications.filter(
      notification => notificationsIdMap[notification.id] === undefined,
    )

    if (filteredNotifications.length === 0) return

    filteredNotifications.forEach(({ id }) => {
      notificationsIdMap[id] = id
    })

    update(({ notifications, unreadCount, ...rest }) => {
      const nextNotifications = [...filteredNotifications, ...notifications]

      return {
        ...rest,
        unreadCount: unreadCount + filteredNotifications.length,
        notifications: nextNotifications,
      }
    })
  }

  function resetUnread() {
    update(prevState => ({
      ...prevState,
      initialized: true,
      unreadCount: 0,
    }))
  }

  function findRelatedNotifications(notificationId: string): Array<InternalUserNotification> {
    const notificationsList = get(notificationsStore).notifications

    if (notificationId?.startsWith('trigger_')) {
      const notification = notificationsList.find(n => n.id === notificationId)
      
      if (!notification) return []

      return notificationsList.filter(n => notification.metadata?.notificationsIds?.includes(n.id))
    }

    return notificationsList.filter(n => n.id === notificationId)
  }

  function aknowledgeNotifications(notificationIds: Array<string>) {
    update(({ notifications, ...rest }) => {
      const aknowledgeList = notifications.filter(n => notificationIds.includes(n.id))

      if (aknowledgeList.length > 0) {
        aknowledgeList.forEach(notification => {
          notification.acknowledged = {
            at: new Date(),
            by: {
              fullName: 'Me',
              id: 'me',
              username: 'me',
            },
          }
        })
      }

      return {
        ...rest,
        notifications,
      }
    })
  }

  async function refetch() {
    stop()
    await fetchNotifications()
    start()
  }

  function init(notifications: Array<NotificationSummary> = []) {
    setNotifications(enrichNotificationsList(notifications))
    resetUnread()
    start()
  }

  function start() {
    stop()

    // pollThread = setInterval(fetchNotifications, POLL_INTERVAL)
  }

  function stop() {
    if (!pollThread) return

    clearInterval(pollThread)
    pollThread = null
  }

  return {
    subscribe,
    findRelatedNotifications,
    aknowledgeNotifications,
    resetUnread,
    refetch,
    start,
    stop,
    init,
  }
}

export const notificationsStore = createNotificationsStore()
export const notificationsList = derived(notificationsStore, $store => $store.notifications)
