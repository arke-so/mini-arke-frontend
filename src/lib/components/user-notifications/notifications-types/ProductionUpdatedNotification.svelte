<script lang="ts">
  import IconButton from '$components/form/IconButton.svelte'
  import NotificationMetadata from '$components/user-notifications/NotificationMetadata.svelte'
  import NotificationText from '$components/user-notifications/NotificationText.svelte'
  import UserNotification from '$components/user-notifications/UserNotification.svelte'
  import { IconSize } from '$ds/components/icons/iconoir'
  import { UnitOfMeasures } from '$fixtures/uom'
  import {
    type InternalUserNotification,
    type ProductionUpdatedNotificationPayload,
    type UserNotificationActionPayload,
  } from '$fixtures/user-notifications'
  import { productionXMissingMaterialsRoute } from '$utils/routes'
  import { getUOMDisplayedSymbol } from '$utils/uom'
  import { ArrowRight } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'

  export let notification: InternalUserNotification<ProductionUpdatedNotificationPayload>
  export let onActionClick: (options: UserNotificationActionPayload) => void = () => {}

  const count: number = notification.metadata?.produced_quantity || 0
  const total: number = notification.metadata?.quantity || 0
  const product: string = notification.metadata?.product_name || ''
</script>

<UserNotification
  {notification}
  href={productionXMissingMaterialsRoute({
    useReferrer: true,
    productionItemId: notification.metadata?.id,
  })}>
  <svelte:fragment slot="content">
    <NotificationText {notification}>
      {#if count && product}
        {$_('Notification A Production Status Was Updated By Number', {
          values: {
            count,
            total,
            product,
            uom: $_(getUOMDisplayedSymbol(notification.metadata?.uom || UnitOfMeasures.Default)).toLocaleLowerCase(),
          },
        })}
      {:else}
        -
      {/if}
    </NotificationText>
    <NotificationMetadata {notification} />
  </svelte:fragment>

  <svelte:fragment slot="actions" let:aknowledge>
    {#if count && product}
      <IconButton
        variant="ghost"
        tooltip={$_('Production Status')}
        on:click={event => {
          onActionClick({ notification })
          aknowledge()
        }}>
        <ArrowRight class={IconSize.Small} />
      </IconButton>
    {/if}
  </svelte:fragment>
</UserNotification>
