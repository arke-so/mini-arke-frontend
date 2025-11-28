<script lang="ts">
  import UserNotification from '$components/user-notifications/UserNotification.svelte'
  import type { InternalUserNotification } from '$fixtures/user-notifications'

  export let notification: InternalUserNotification
</script>

<UserNotification {notification}>
  <svelte:fragment slot="actions">
    <!-- <Button variant="secondary" on:click={() => onActionClick({ notification })}>
      {$_('Details')}
    </Button> -->
  </svelte:fragment>
</UserNotification>
