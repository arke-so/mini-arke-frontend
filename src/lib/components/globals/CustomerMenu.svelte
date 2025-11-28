<script lang="ts">
  import type { TenantDetails } from '$api/iam'
  import { version } from '$app/environment'
  import { goto } from '$app/navigation'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import * as DropdownMenu from '$ds/components/ui/dropdown-menu'
  import { logout } from '$flows/login'
  import type { JWTUser } from '$utils/auth'
  import { adminRoute, loginRoute, preferencesSettingsRoute, settingsRoute } from '$utils/routes'
  import { getNameInitials, tinyString } from '$utils/string'
  import { CircleUserRound, LockKeyhole, Power, Settings, Settings2 } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'

  export let tenant: TenantDetails
  export let user: JWTUser
  export let maintenance: boolean

  async function logoutUser() {
    await logout()
    goto(loginRoute())
  }

  $: isArke = tenant.vanity === 'arke'
  $: initials = getNameInitials(tenant.name)
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="ghost"
      class="group flex max-w-44 items-center gap-2 rounded p-2 pl-0 ring-secondary/50 hover:bg-secondary/50 hover:ring-4 focus-visible:ring-2 dark:hover:ring-2">
      <div
        class="infinite flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-semibold text-white shadow-warning"
        class:bg-blue-600={!isArke}
        class:bg-primary={isArke}
        class:bg-warning={maintenance}
        class:attention-seeker={maintenance}>
        {#if isArke}
          <IcoNoir.ArkeLogoOnly class="w-6 text-primary-foreground" />
        {:else}
          {initials}
        {/if}
      </div>
      <div class="max-w-24 text-left">
        <div class="sr-only">{$_('Toggle User Menu Text')}</div>
        <div class="hidden truncate text-ellipsis font-semibold md:block">{tenant.name}</div>
        <div class="hidden truncate text-xs text-muted-foreground md:block">{user.full_name}</div>
      </div>
      <IcoNoir.ChevronUpDown class="invisible ml-auto w-4 text-muted-foreground group-hover:visible" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="start" class="min-w-56">
    <DropdownMenu.Label class="cursor-default">
      <div>{tinyString(tenant.name, 25)}</div>
      <div class="text-xs font-normal text-muted-foreground">
        {$_('Running Arke Version Text', { values: { version } })}
      </div>
    </DropdownMenu.Label>
    <DropdownMenu.Separator />

    <DropdownMenu.Item href={settingsRoute({ useReferrer: true })}>
      <Settings class="mr-2 text-muted-foreground {IconSize.Small}" />
      {$_('Settings (page)')}
    </DropdownMenu.Item>

    <DropdownMenu.Item href={preferencesSettingsRoute({ useReferrer: true })}>
      <Settings2 class="mr-2 text-muted-foreground {IconSize.Small}" />
      {$_('User Preferences')}
    </DropdownMenu.Item>

    {#if user?.super_admin}
      <DropdownMenu.Item href={adminRoute()}>
        <LockKeyhole class="mr-2 text-muted-foreground {IconSize.Small}" />
        {$_('Admin (page)')}
      </DropdownMenu.Item>
    {/if}

    <DropdownMenu.Separator />
    <DropdownMenu.Label class="flex cursor-default items-center">
      <CircleUserRound class="mr-2 text-muted-foreground {IconSize.Small}" />
      {tinyString(user?.full_name, 25)}
    </DropdownMenu.Label>
    <DropdownMenu.Item on:click={logoutUser}>
      <Power class="mr-2 text-muted-foreground {IconSize.Small}" />
      {$_('Sign Out')}
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
