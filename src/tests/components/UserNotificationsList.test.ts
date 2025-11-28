import type { NotificationSummary } from '$api/iam'
import UserNotificationsList from '$components/user-notifications/UserNotificationsList.svelte'
import { notificationsList, notificationsStore } from '$stores/user-notifications'
import { DEFAULT_LOCALE } from '$utils/dates'
import { render, waitFor } from '@testing-library/svelte'
import { locale } from 'svelte-i18n'
import { get } from 'svelte/store'
import { beforeAll, describe, expect, it, vi } from 'vitest'

vi.mock('$api/iam', async () => {
  const actual = await vi.importActual<typeof import('$api/iam')>('$api/iam')
  return {
    ...actual,
    NotificationsApi: vi.fn().mockImplementation(() => ({
      listNotifications: async function(): Promise<NotificationSummary[]> {
        return [
          {
            "id": "23e985d3-4ab8-4daf-ae28-6f5351dd51cd",
            "type": "PURCHASE_ORDER_SENT",
            "category": "purchase_orders_updates",
            "createdTs": 1762426710035,
            "metadata": {
              "id": "340a45a1-54e2-411e-b22c-8ffebcaf1c75"
            }
          },
          {
            "id": "13dfc347-86b9-4933-bb85-659c84c7087f",
            "type": "SALES_ORDER_CREATED",
            "category": "sales_orders_updates",
            "createdTs": 1762446683115,
            "metadata": {
            "external_id": "",
              "id": "b23426ca-45e7-4b8c-9813-4c4862a82f46"
            }
          },
        ]
      },
    })),
  };
})

describe('UserNotificationsList.svelte', () => {
  const HEADING_TITLE = 'My notifications'

  beforeAll(() => {
    locale.set(DEFAULT_LOCALE);
    notificationsStore.init()
    notificationsStore.refetch()
  });

  it('Renders with basic props', () => {
    const { container, getByText } = render(UserNotificationsList, { props: { heading: HEADING_TITLE } })

    expect(container).toBeDefined()
    expect(getByText(HEADING_TITLE)).toBeTruthy()
  })

  it('Renders notifications as expected', async () => {
    await waitFor(() => {
      expect(get(notificationsList).length).toBeGreaterThan(0)
    }, { timeout: 1000 })

    const { getByText } = render(UserNotificationsList, {
      props: {
        heading: HEADING_TITLE,
        notifications: get(notificationsList)
      }
    })

    expect(getByText('Notification A Purchase Order Was Sent')).toBeInTheDocument()
    expect(getByText('Notification A Sales Order Was Created')).toBeInTheDocument()
  })
});