<script lang="ts">
  import IconButton from '$components/form/IconButton.svelte'
  import NotificationMetadata from '$components/user-notifications/NotificationMetadata.svelte'
  import NotificationText from '$components/user-notifications/NotificationText.svelte'
  import UserNotification from '$components/user-notifications/UserNotification.svelte'
  import { IconSize } from '$ds/components/icons/iconoir'
  import { type InternalUserNotification, type UserNotificationActionPayload } from '$fixtures/user-notifications'
  import { upsertSalesOrderRoute } from '$utils/routes'
  import { ArrowRight } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'

  export let notification: InternalUserNotification
  export let onActionClick: (options: UserNotificationActionPayload) => void = () => {}

  const message: string = notification.message as string
  const orderMnemonicId: string = notification.metadata?.external_id || notification.metadata?.internal_id
</script>

<UserNotification {notification}>
  <svelte:fragment slot="content">
    <NotificationText {notification}>
      {$_(message)}

      {#if orderMnemonicId}
        <div>{$_('Unique ID')}: {orderMnemonicId}</div>
      {/if}
    </NotificationText>
    <NotificationMetadata {notification} />
  </svelte:fragment>

  <svelte:fragment slot="actions">
    {#if notification.type === 'QUOTE_ACCEPTED' && notification.metadata.order_id}
      <IconButton
        variant="ghost"
        tooltip={$_('Show Order')}
        href={upsertSalesOrderRoute({ orderId: notification.metadata.order_id })}
        on:click={() => onActionClick({ notification })}>
        <ArrowRight class={IconSize.Small} />
      </IconButton>
    {/if}
  </svelte:fragment>
</UserNotification>
