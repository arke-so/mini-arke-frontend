<script lang="ts">
  import NavLinkUtil from '$components/utils/NavLinkUtil.svelte'

  export let href: string
  export let routeId: string
  export let disabled: boolean = false
  export let usePathname: boolean = false
  export let label: string = ''
  export let exact: boolean = false
  export let routeParams: Record<string, string> | undefined = undefined
  export let icon: ConstructorOfATypedSvelteComponent | undefined = undefined
</script>

<NavLinkUtil {href} {routeId} {usePathname} {exact} {routeParams} let:active>
  <a
    href={disabled ? '' : href}
    class="flex flex-none items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors {disabled
      ? ''
      : 'hover:bg-muted hover:text-foreground'} {$$restProps.class || ''}"
    class:bg-muted={active}
    class:opacity-40={disabled}
    class:cursor-default={disabled}>
    <slot>
      <svelte:component this={icon} class="w-3.5 text-foreground/50" />
      {label}
    </slot>
  </a>
</NavLinkUtil>
