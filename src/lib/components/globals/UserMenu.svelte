<script lang="ts">
  import { browser, version } from '$app/environment'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import * as DropdownMenu from '$ds/components/ui/dropdown-menu'
  import { logout } from '$flows/login'
  import type { JWTUser } from '$utils/auth'
  import { adminRoute, loginRoute } from '$utils/routes'
  import { getNameInitials, tinyString } from '$utils/string'
  import { _ } from 'svelte-i18n'

  export let user: JWTUser

  let scheme = $page.data.scheme

  async function logoutUser() {
    await logout()
    goto(loginRoute())
  }

  async function onDarkModeToggle() {
    if (!browser) return

    const darkMode = scheme === 'dark'
    const currentURL = new URL($page.url.href)
    scheme = darkMode ? 'light' : 'dark'

    currentURL.searchParams.set('scheme', scheme)
    await goto(currentURL.toString())

    if (darkMode) document.documentElement.classList.remove('dark')
    else document.documentElement.classList.add('dark')
  }

  $: initials = getNameInitials(user?.full_name)
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="default" size="icon" class="h-8 w-8 rounded-lg">
      {initials}
      <span class="sr-only">{$_('Toggle User Menu Text')}</span>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end" class="min-w-56">
    <DropdownMenu.Label>
      {tinyString(user?.full_name, 25)}
      {#if user?.super_admin}
        <div class="text-xs font-normal text-muted-foreground">
          {$_('Running Arke Version Text', { values: { version } })}
        </div>
      {/if}
    </DropdownMenu.Label>
    <DropdownMenu.Separator />
    <!-- {#if dev} -->
    <DropdownMenu.Item on:click={onDarkModeToggle}>
      {#if scheme === 'dark'}
        <IcoNoir.SwitchOn class="mr-2 {IconSize.Small}" />
      {:else}
        <IcoNoir.SwitchOff class="mr-2 {IconSize.Small}" />
      {/if}

      {#if scheme === 'dark'}
        {$_('Disable Dark Mode')} (Beta)
      {:else}
        {$_('Enable Dark Mode')} (Beta)
      {/if}
    </DropdownMenu.Item>
    <!-- {/if} -->

    {#if user?.super_admin}
      <DropdownMenu.Separator />
      <DropdownMenu.Item href={adminRoute()}>
        <IcoNoir.Potion class="mr-2 {IconSize.Small}" />
        {$_('Admin (page)')}
      </DropdownMenu.Item>
    {/if}

    <DropdownMenu.Separator />
    <DropdownMenu.Item on:click={logoutUser}>
      <IcoNoir.Logout class="mr-2 {IconSize.Small}" />
      {$_('Sign Out')}
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
