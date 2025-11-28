<script lang="ts">
  import IconButton from '$components/form/IconButton.svelte'
  import NotificationMetadata from '$components/user-notifications/NotificationMetadata.svelte'
  import NotificationText from '$components/user-notifications/NotificationText.svelte'
  import UserNotification from '$components/user-notifications/UserNotification.svelte'
  import { IconSize } from '$ds/components/icons/iconoir'
  import {
    UserNotificationAction,
    type InternalUserNotification,
    type UserNotificationActionPayload,
  } from '$fixtures/user-notifications'
  import { purchaseNeedsRoute } from '$utils/routes'
  import { getNotificationEventPayload } from '$utils/user-notifications'
  import { ArrowRight } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'

  export let notification: InternalUserNotification<{ count: number }>
  export let onActionClick: (options: UserNotificationActionPayload) => void = () => {}

  const count: number = notification.metadata?.count || 0
</script>

<UserNotification {notification}>
  <svelte:fragment slot="content">
    <NotificationText {notification}>
      {$_('Notification A Number Of Productions Were Planned', { values: { count } })}
    </NotificationText>
    <NotificationMetadata {notification} />
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <IconButton
      variant="ghost"
      tooltip={$_('Production Status')}
      href={purchaseNeedsRoute({
        useReferrer: true,
        notificationEvent: getNotificationEventPayload(notification, UserNotificationAction.CalculateSupplyNeeds),
      })}
      on:click={() => onActionClick({ notification })}>
      <ArrowRight class={IconSize.Small} />
    </IconButton>
  </svelte:fragment>
</UserNotification>
