<script lang="ts">
  import UserNotification from '$components/user-notifications/UserNotification.svelte'
  import { Button } from '$ds/components/ui/button'
  import {
    TriggerNotificationTypeEnum,
    UserNotificationAction,
    type InternalUserNotification,
    type UserNotificationActionPayload,
  } from '$fixtures/user-notifications'
  import { purchaseNeedsRoute } from '$utils/routes'
  import { getNotificationEventPayload } from '$utils/user-notifications'
  import { _ } from 'svelte-i18n'

  export let notification: InternalUserNotification
  export let onActionClick: (options: UserNotificationActionPayload) => void = () => {}

  const message: string = notification.message as string
</script>

<UserNotification {notification}>
  <svelte:fragment slot="content">
    {#if notification.type === TriggerNotificationTypeEnum.TriggerSupplyNeedsNotification}
      {$_(message, { values: { count: notification.metadata.ordersCount } })}
    {:else}
      {$_(message)}
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="actions">
    {#if notification.type === TriggerNotificationTypeEnum.TriggerSupplyNeedsNotification}
      <Button
        variant="secondary"
        href={purchaseNeedsRoute({
          useReferrer: true,
          notificationEvent: getNotificationEventPayload(notification, UserNotificationAction.CalculateSupplyNeeds),
        })}
        on:click={() => onActionClick({ notification })}>
        {$_('Calculate Supply Needs')}
      </Button>
    {/if}
  </svelte:fragment>
</UserNotification>
