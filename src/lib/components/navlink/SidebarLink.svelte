<script lang="ts">
  import NavLinkUtil from '$components/utils/NavLinkUtil.svelte'

  export let href: string
  export let label: string | undefined = undefined
  export let keepFocus: boolean = false
  export let exact: boolean = true
  export let disabled: boolean = false
</script>

<NavLinkUtil {href} {exact} routeId={href} usePathname let:active>
  <a
    href={disabled ? '' : href}
    data-sveltekit-keepfocus={keepFocus}
    class="flex h-8 items-center justify-between rounded px-1.5 pr-2 text-sm {$$restProps.class || ''} {active
      ? 'bg-stone-200/50 dark:bg-stone-600'
      : disabled
        ? 'cursor-not-allowed'
        : 'hover:bg-stone-200/30 hover:dark:bg-stone-600/60'} {disabled ? 'opacity-50' : ''}">
    <slot>
      <div class="truncate">
        {label}
      </div>
    </slot>
    <slot name="status">
      <div />
    </slot>
  </a>
</NavLinkUtil>
