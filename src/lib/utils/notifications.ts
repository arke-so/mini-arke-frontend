import { toast } from 'svelte-sonner'

const DEFAULT_TIMEOUT = 5000

export const NotificationType = Object.freeze({
  Info: 'info',
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
  Default: 'default',
})

export type BasicNotification = {
  id?: number | string
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export type Notification = BasicNotification & {
  type: 'info' | 'success' | 'warning' | 'error' | 'default'
}

function createNotification(
  notification: Notification = {
    type: NotificationType.Default,
    duration: DEFAULT_TIMEOUT,
    title: '',
    description: '',
  },
) {
  const { type, title, ...rest } = notification

  switch (type) {
    case NotificationType.Info:
      return toast.info(title, rest)
    case NotificationType.Success:
      return toast.success(title, rest)
    case NotificationType.Warning:
      return toast.warning(title, rest)
    case NotificationType.Error:
      return toast.error(title, rest)
    default:
      return toast(title, rest)
  }
}

export function notifySuccess(notification: BasicNotification) {
  createNotification({
    type: NotificationType.Success,
    ...notification,
  })
}

export function notifyError(notification: BasicNotification) {
  createNotification({
    type: NotificationType.Error,
    ...notification,
  })
}
