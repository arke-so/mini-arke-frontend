<script lang="ts">
  import { Main } from '$components/main'
  import { notificationsStore } from '$stores/user-notifications'
  import { onMount } from 'svelte'
  import { _ } from 'svelte-i18n'

  onMount(() => notificationsStore.resetUnread())
</script>

<Main.Basic class="bg-muted/50" topnav>
  <h1 class="flex h-20 cursor-default items-center gap-6 text-2xl">
    {$_('Hello User', { values: { user: 'John Doe' } })}
  </h1>

  <div class="md:h-[calc(100%-theme(spacing.navigation))]">
    <!-- <UserNotificationsProvider let:activity let:initialized>
      <div
        class="flex flex-col max-md:mt-6 {activity.length > 5
          ? 'md:h-full'
          : 'md:h-fit'} md:w-1/2 md:rounded-lg md:border md:bg-card md:px-4 md:py-1 lg:w-2/6">
        {#if initialized}
          <UserNotificationsList heading={$_('Latest Activity')} notifications={activity} itemsSeparator />
        {:else}
          <div class="flex h-full w-full items-center justify-center">
            <div>{$_('Please Wait')}</div>
          </div>
        {/if}
      </div>
    </UserNotificationsProvider> -->
  </div>
</Main.Basic>
