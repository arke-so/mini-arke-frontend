<script lang="ts">
  import SpotlightTrigger from '$components/globals/SpotlightTrigger.svelte'
  import SquareIcon from '$components/icons/SquareIcon.svelte'
  import NavbarLink from '$components/navbar/NavbarLink.svelte'
  import NavLinkUtil, { type NavLink } from '$components/utils/NavLinkUtil.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import * as Sheet from '$ds/components/ui/sheet'
  import { notificationsStore } from '$stores/user-notifications'
  import {
    appRootRoute,
    appRootRouteId,
    contactsRoute,
    contactsRouteId,
    goodsRoute,
    goodsRouteId,
    productionRoute,
    productionRouteId,
    purchaseRoute,
    purchaseRouteId,
    salesRoute,
    salesRouteId,
    stockRoute,
    stockRouteId,
  } from '$utils/routes'
  import { onMount } from 'svelte'
  import { _ } from 'svelte-i18n'
  import type { LayoutData } from './$types'

  export let data: LayoutData

  let mobileMenuActive: boolean = false
  let MENU_ITEMS: Array<NavLink>

  function closeMobileMenu() {
    mobileMenuActive = false
  }

  $: ({ notifications } = data)
  $: MENU_ITEMS = [
    {
      label: $_('Dashboard (page)'),
      href: appRootRoute(),
      routeId: appRootRouteId(),
      visible: true,
      exact: true,
    },
    {
      label: $_('Sell (page)'),
      href: salesRoute(),
      routeId: salesRouteId(),
      disabled: true,
      exact: false,
    },
    {
      label: $_('Buy (page)'),
      href: purchaseRoute(),
      routeId: purchaseRouteId(),
      disabled: true,
      exact: false,
    },
    {
      label: $_('Production (page)'),
      href: productionRoute(),
      routeId: productionRouteId(),
      disabled: true,
      exact: false,
    },
    {
      label: $_('Goods (page)'),
      href: goodsRoute(),
      routeId: goodsRouteId(),
      disabled: true,
      exact: false,
    },
    {
      label: $_('Stock (page)'),
      href: stockRoute(),
      routeId: stockRouteId(),
      disabled: true,
      exact: false,
    },
    {
      label: $_('Contacts (page)'),
      href: contactsRoute(),
      routeId: contactsRouteId(),
      disabled: true,
      exact: false,
    },
  ]

  onMount(() => notificationsStore.init(notifications || []))
</script>

<header class="sticky top-0 z-30 flex h-navigation justify-between gap-4 border-b bg-background px-4">
  <div class="flex items-center">
    <SquareIcon
      class="size-8 border-none bg-primary"
      icon={IcoNoir.ArkeLogoOnly}
      iconClass="size-6 text-primary-foreground" />
  </div>

  <nav class="hidden md:flex">
    <ul class="hidden flex-col gap-6 text-lg lg:flex lg:flex-row lg:items-center lg:gap-3 lg:text-sm">
      {#each MENU_ITEMS as { label, href, routeId, visible, exact, disabled } (href)}
        {#if visible || visible === undefined}
          <li>
            <NavbarLink {href} {routeId} {exact} {label} {disabled} />
          </li>
        {/if}
      {/each}
    </ul>
  </nav>

  <div class="flex items-center gap-4 md:gap-2 lg:gap-4">
    <div class="flex min-w-32 items-center justify-end gap-2">
      <SpotlightTrigger disabled />

      <Sheet.Root bind:open={mobileMenuActive}>
        <Sheet.Trigger asChild let:builder>
          <Button variant="ghost" size="icon" class="shrink-0 lg:hidden" builders={[builder]}>
            <IcoNoir.Menu class={IconSize.Medium} />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        </Sheet.Trigger>

        <Sheet.Content side="right">
          <div class="flex h-full flex-col justify-between">
            <nav class="grid gap-6 text-lg font-medium">
              <a href={appRootRoute()} class="flex items-center gap-2 text-lg font-semibold">
                <IcoNoir.Arke class="w-24" />
                <span class="sr-only">Arke</span>
              </a>

              {#each MENU_ITEMS as { label, href, routeId, visible, disabled } (href)}
                {#if visible || visible === undefined}
                  <NavLinkUtil {href} {routeId} let:active>
                    <a
                      href={disabled ? undefined : href}
                      class="flex items-center gap-2 hover:text-foreground {active
                        ? 'text-primary'
                        : 'text-muted-foreground'}"
                      on:click={closeMobileMenu}>
                      {label}
                    </a>
                  </NavLinkUtil>
                {/if}
              {/each}
            </nav>
          </div>
        </Sheet.Content>
      </Sheet.Root>
    </div>
  </div>
</header>

<slot />
