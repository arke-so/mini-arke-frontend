<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import * as Popover from '$ds/components/ui/popover'
  import type { UserNotificationActionType } from '$fixtures/user-notifications'
  import { RouteQueryParam } from '$utils/routes'
  import { aknowledgeNotification } from '$utils/user-notifications'
  import { wait } from '$utils/wait'

  export let action: UserNotificationActionType
  export let align: 'start' | 'end' | 'center' = 'end'
  export let delay: number = 500

  let open: boolean = false
  let aknowledged: boolean = false

  function getNotificationEventPayloadFromQuery(query: URLSearchParams) {
    const notificationAction = query.get(RouteQueryParam.NotificationEventAction)
    const notificationId = query.get(RouteQueryParam.NotificationEventId)

    return {
      notificationAction,
      notificationId,
    }
  }

  async function onOpenChange(value: boolean) {
    if (value === false) onDiscard()

    if (aknowledged && value) {
      await wait(1)
      open = false
    }
  }

  async function acknowledge() {
    try {
      if (!browser) return

      const nextUrl = new URL($page.url)
      nextUrl.searchParams.delete(RouteQueryParam.NotificationEventAction)
      nextUrl.searchParams.delete(RouteQueryParam.NotificationEventId)
      aknowledged = true

      if (notificationId) await aknowledgeNotification(notificationId as string)
      await goto(nextUrl.toString(), { replaceState: true })
    } catch (error) {}
  }

  async function bootstrap(notificationAction: string | null, notificationId: string | null) {
    if (!browser) return
    if (!notificationAction) return

    if (notificationAction === action) {
      await wait(delay)
      open = true
    }
  }

  async function onDiscard() {
    if (!notificationId) {
      await acknowledge()
    }
  }

  $: ({ notificationAction, notificationId } = getNotificationEventPayloadFromQuery($page.url.searchParams))
  $: bootstrap(notificationAction, notificationId)
</script>

<Popover.Root bind:open {onOpenChange}>
  <Popover.Trigger>
    <slot {acknowledge} />
  </Popover.Trigger>

  <Popover.Content class="attention-seeker border-primary p-0 shadow-primary/20" {align}>
    <slot name="content">As soon as you're ready, click this button!</slot>
  </Popover.Content>
</Popover.Root>
