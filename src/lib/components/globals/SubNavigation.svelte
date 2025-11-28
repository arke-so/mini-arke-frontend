<script lang="ts">
  import { Heading } from '$components/heading'
  import { Navbar } from '$components/navbar'
  import NavbarLink from '$components/navbar/NavbarLink.svelte'
  import type { NavLink } from '$components/utils/NavLinkUtil.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'

  export let heading: string = ''
  export let menu: Array<NavLink> = []

  let navigationHidden: boolean = true
</script>

<Navbar.SubNav class="max-md:justify-between">
  {#if heading}
    <Heading.H2 class="mr-6">
      {heading}
    </Heading.H2>
  {/if}

  <div>
    <slot>
      {#if menu.length > 0}
        <Button variant="ghost" size="icon" class="md:hidden" on:click={() => (navigationHidden = !navigationHidden)}>
          <IcoNoir.ChevronUpDown class="w-4 {IconSize.Button}" />
        </Button>
      {/if}

      <div class="relative md:static">
        <ul
          class="absolute right-0 top-1 z-20 hidden items-center gap-4 rounded text-lg max-md:min-w-48 max-md:flex-col max-md:bg-popover max-md:p-1 max-md:shadow md:static md:flex"
          class:hidden={navigationHidden}>
          {#each menu as { label, href, routeId, disabled, exact, usePathname, routeParams, icon } (routeId)}
            <li>
              <NavbarLink {href} {routeId} {exact} {label} {usePathname} {disabled} {routeParams} {icon} />
            </li>
          {/each}
        </ul>
      </div>
    </slot>
  </div>
</Navbar.SubNav>
