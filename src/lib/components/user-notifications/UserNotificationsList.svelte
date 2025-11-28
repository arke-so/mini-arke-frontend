<script lang="ts">
  import { IconSize } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import type { InternalUserNotification, UserNotificationActionPayload } from '$fixtures/user-notifications'
  import { _ } from 'svelte-i18n'
  import { ArrowUp } from 'svelte-radix'
  import { flip } from 'svelte/animate'
  import { fly } from 'svelte/transition'
  import UserNotificationFactory from './UserNotificationFactory.svelte'

  export let heading: string = $_('Activity')
  export let notifications: Array<InternalUserNotification> = []
  export let itemsSeparator: boolean = false
  export let emptyMessage: string = $_('No Recent Activity')
  export let onActionClick: (options: UserNotificationActionPayload) => void = () => {}

  let reachedTop: boolean = true
  let reachedBottom: boolean = false
  let scrollContainer: HTMLDivElement

  let countBeforeScroll: number = 0

  function handleScroll() {
    if (scrollContainer) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      reachedTop = scrollTop === 0
      reachedBottom = scrollTop + clientHeight >= scrollHeight
    }
  }

  function afterScrolledDown(_: boolean) {
    countBeforeScroll = notifications.length
  }

  function scrollToTop() {
    if (!scrollContainer) return

    scrollContainer.scrollTo(0, 0)
  }

  $: if (!reachedTop) afterScrolledDown(reachedTop)
  $: unreadNotifications = notifications.length - countBeforeScroll
</script>

<div class="relative">
  {#if !reachedTop}
    <div class="absolute z-50 mt-[1px] flex w-full justify-center py-4" transition:fly={{ y: -20, duration: 300 }}>
      <Button variant="outline" class="flex items-center gap-1" on:click={scrollToTop}>
        {$_('Go To Top')}
        <ArrowUp class={IconSize.Button} />

        {#if unreadNotifications > 0}
          <div class="min-w-5 rounded-full bg-stone-200 px-1 text-xs dark:bg-stone-700">{unreadNotifications}</div>
        {/if}
      </Button>
    </div>
  {/if}
</div>

<div class="flex h-9 items-center font-semibold">{heading}</div>
<div
  class="scrollbar-on-hover h-full flex-1 overflow-y-auto scroll-smooth"
  class:border-b={!reachedBottom && notifications.length > 0}
  class:border-t={!reachedTop}
  bind:this={scrollContainer}
  on:scroll={handleScroll}>
  {#each notifications as notification (notification.id)}
    <div animate:flip={{ duration: 200 }} class={itemsSeparator ? ' py-2' : ''}>
      <UserNotificationFactory {notification} {onActionClick} />
    </div>
  {:else}
    <slot name="empty">
      <div class="h-full min-h-40 flex items-center justify-center text-muted-foreground/70">
        <div>{emptyMessage}</div>
      </div>
    </slot>
  {/each}
</div>
