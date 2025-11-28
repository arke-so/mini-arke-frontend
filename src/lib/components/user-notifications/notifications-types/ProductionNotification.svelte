<script lang="ts">
  import NotificationMetadata from '$components/user-notifications/NotificationMetadata.svelte'
  import NotificationText from '$components/user-notifications/NotificationText.svelte'
  import UserNotification from '$components/user-notifications/UserNotification.svelte'
  import { type InternalUserNotification, type UserNotificationActionPayload } from '$fixtures/user-notifications'
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
        <div>{$_('Order ID')}: {orderMnemonicId}</div>
      {/if}
    </NotificationText>
    <NotificationMetadata {notification} />
  </svelte:fragment>
</UserNotification>
