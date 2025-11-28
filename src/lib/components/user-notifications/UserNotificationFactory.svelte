<script lang="ts">
  import UserNotification from '$components/user-notifications/UserNotification.svelte'
  import type { InternalUserNotification, UserNotificationActionPayload } from '$fixtures/user-notifications'

  export let notification: InternalUserNotification
  export let onActionClick: (options: UserNotificationActionPayload) => void = () => {}
</script>

{#if notification.component}
  <svelte:component this={notification.component} {notification} {onActionClick} />
{:else}
  <UserNotification {notification} />
{/if}
