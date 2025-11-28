<script lang="ts">
  import IconButton from '$components/form/IconButton.svelte'
  import UserNotificationsList from '$components/user-notifications/UserNotificationsList.svelte'
  import UserNotificationsProvider from '$components/user-notifications/UserNotificationsProvider.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import * as Sheet from '$ds/components/ui/sheet'
  import SheetLayout from '$ds/components/ui/sheet/_/SheetLayout.svelte'
  import type { UserNotificationActionPayload } from '$fixtures/user-notifications'
  import { notificationsStore } from '$stores/user-notifications'
  import { _ } from 'svelte-i18n'

  export let onClose: () => void = () => {}
  export let drawerActive: boolean = false

  // let drawerActive: boolean = false

  function onNotificationActionClick(options: UserNotificationActionPayload) {
    drawerActive = false
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      onClose()
      notificationsStore.resetUnread()
    }
  }
</script>

<Sheet.Root bind:open={drawerActive} {onOpenChange} openFocus={null}>
  <Sheet.Content class="w-11/12 p-0 sm:max-w-md md:max-w-[500px]" side="right" defaultCloseButton={false}>
    <SheetLayout heading={$_('Notifications')}>
      <UserNotificationsProvider let:activity let:onLoadMore>
        <div class="flex h-full flex-col">
          <UserNotificationsList
            heading={$_('Latest Activity')}
            notifications={activity}
            onActionClick={onNotificationActionClick}
            {onLoadMore}
            itemsSeparator />
        </div>
      </UserNotificationsProvider>
    </SheetLayout>

    <Sheet.Close asChild let:builder>
      <IconButton class="fixed right-4 top-1" builders={[builder]} tooltip={$_('Close Drawer')} variant="ghost">
        <IcoNoir.FastArrowRight class="w-4 {IconSize.Button}" />
      </IconButton>
    </Sheet.Close>
  </Sheet.Content>
</Sheet.Root>
