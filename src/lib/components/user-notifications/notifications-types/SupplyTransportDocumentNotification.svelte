<script lang="ts">
  import IconButton from '$components/form/IconButton.svelte'
  import UserNotification from '$components/user-notifications/UserNotification.svelte'
  import { IconSize } from '$ds/components/icons/iconoir'
  import type { InternalUserNotification, UserNotificationActionPayload } from '$fixtures/user-notifications'
  import { upsertTransportDocumentRoute } from '$utils/routes'
  import { ArrowRight } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'

  export let notification: InternalUserNotification
  export let onActionClick: (options: UserNotificationActionPayload) => void = () => {}

  const orderId: string = notification?.metadata?.order_id as string
  const documentId: string = notification?.metadata?.id as string
</script>

<UserNotification {notification}>
  <svelte:fragment slot="actions">
    {#if orderId && documentId}
      <IconButton
        variant="ghost"
        tooltip={$_('View Document')}
        href={upsertTransportDocumentRoute({ orderId, documentId, useReferrer: true })}
        on:click={() => onActionClick({ notification })}>
        <ArrowRight class={IconSize.Small} />
      </IconButton>
    {/if}
  </svelte:fragment>
</UserNotification>
