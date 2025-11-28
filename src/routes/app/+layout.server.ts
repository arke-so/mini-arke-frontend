import { createAuthenticationConfig } from '$api/clients-utils/iam-client.js'
import { NotificationsApi } from '$api/iam'
import { DependsID } from '$fixtures/depends'
import { NOTIFICATIONS_LIMIT } from '$fixtures/user-notifications'

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
  event.depends(DependsID.AppIndex)
  const notificationsApi = new NotificationsApi(createAuthenticationConfig(event))
  const notifications = await notificationsApi.listNotifications({ limit: NOTIFICATIONS_LIMIT })

  return {
    notifications,
  }
}
