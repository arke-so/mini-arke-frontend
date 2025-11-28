<script lang="ts">
  import { browser } from '$app/environment'
  import IconButton from '$components/form/IconButton.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { notificationsPanelActive } from '$stores/app'
  import { notificationsStore } from '$stores/user-notifications'
  import { _ } from 'svelte-i18n'

  export let disabled: boolean = false

  function onButtonClick() {
    notificationsPanelActive.set(true)
    notificationsStore.resetUnread()
  }

  $: unreadCount = (browser && $notificationsStore.unreadCount) || 0
</script>

<IconButton
  variant="ghost"
  tooltip={$_('Open Notifications Panel')}
  class="relative"
  {disabled}
  on:click={onButtonClick}>
  {#key unreadCount}
    <IcoNoir.Bell
      class="{IconSize.Medium} rounded-full {unreadCount > 0 && !disabled
        ? 'attention-seeker text-primary'
        : ''} shadow-primary/20 dark:shadow-primary/40" />

    {#if !disabled && unreadCount > 0}
      <div
        class="absolute -right-1 top-0 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
        {unreadCount > 99 ? '99+' : unreadCount}
      </div>
    {/if}
  {/key}
</IconButton>
