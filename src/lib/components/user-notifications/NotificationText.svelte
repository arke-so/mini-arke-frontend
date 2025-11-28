<script lang="ts">
  import type { InternalUserNotification } from '$fixtures/user-notifications'

  export let notification: InternalUserNotification
</script>

<div class="text-sm font-medium">
  <slot />
</div>
