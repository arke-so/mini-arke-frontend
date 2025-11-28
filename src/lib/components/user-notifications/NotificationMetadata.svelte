<script lang="ts">
  import type { InternalUserNotification } from '$fixtures/user-notifications'
  import { renderDateTime } from '$utils/dates'
  import { _ } from 'svelte-i18n'

  export let notification: InternalUserNotification
</script>

<div class="mt-1 text-xs text-muted-foreground/80">
  {$_('At Datetime')}
  <span class="">{notification.createdTs ? renderDateTime(new Date(notification.createdTs)) : '-'}</span>
</div>
