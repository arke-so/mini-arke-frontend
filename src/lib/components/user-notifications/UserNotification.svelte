<script lang="ts">
  import SquareIcon from '$components/icons/SquareIcon.svelte'
  import NotificationMetadata from '$components/user-notifications/NotificationMetadata.svelte'
  import type { InternalUserNotification } from '$fixtures/user-notifications'
  import { busyUntil } from '$stores/app'
  import { aknowledgeNotification } from '$utils/user-notifications'
  import { Bell } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'
  import NotificationText from './NotificationText.svelte'

  export let notification: InternalUserNotification
  export let href: string | undefined = undefined

  async function justAwknowledge(event?: MouseEvent) {
    event?.stopPropagation()
    event?.preventDefault()
    busyUntil(async () => await aknowledgeNotification(notification.id))
  }
</script>

<svelte:element
  this={href ? 'a' : 'div'}
  {href}
  class="flex gap-3 {notification.acknowledged ? 'items-center' : 'items-start'}">
  <div class="">
    <SquareIcon icon={notification.icon || Bell} class="mt-0.5 size-9 {notification.iconClass || 'bg-sky-500/30'}" />
  </div>

  <div class="flex-1 text-xs">
    <slot name="content">
      <NotificationText {notification}>{notification.message ? $_(notification.message) : ''}</NotificationText>
      <NotificationMetadata {notification} />
    </slot>
  </div>

  <div class="flex items-center gap-1">
    <slot name="actions" aknowledge={justAwknowledge} />
  </div>
</svelte:element>
