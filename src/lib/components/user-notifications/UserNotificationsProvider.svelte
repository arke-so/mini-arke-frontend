<script lang="ts">
  import { notificationsList, notificationsStore } from '$stores/user-notifications'
</script>

<slot initialized={$notificationsStore.initialized} activity={$notificationsList} />
