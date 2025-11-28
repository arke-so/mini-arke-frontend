<script lang="ts">
  import NavbarLink from './NavbarLink.svelte'

  export let route: string
  export let routeId: string
  export let disabled: boolean = false
  export let usePathname: boolean = false
</script>

<NavbarLink href={route} {routeId} {disabled} {usePathname}>
  <slot />
</NavbarLink>
