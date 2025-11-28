<script lang="ts">
  import type { NavLink } from '$components/utils/NavLinkUtil.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import * as Collapsible from '$ds/components/ui/collapsible'
  import SidebarLink from './SidebarLink.svelte'

  export let title: string = ''
  export let items: Array<NavLink> = []
  export let open: boolean = false
</script>

<Collapsible.Root class="" bind:open>
  <Collapsible.Trigger asChild let:builder>
    <Button builders={[builder]} variant="ghost" size="default" class="mb-1 w-full justify-start rounded px-1 py-1.5">
      <div
        class="flex w-6 items-center justify-center text-muted-foreground transition-transform duration-100 {open
          ? 'rotate-90'
          : ''}">
        <IcoNoir.ChevronRight class={IconSize.Button} />
      </div>
      <div class="font-normal">{title}</div>
      <IcoNoir.ChevronUpDown class="{IconSize.Button} ml-auto text-muted-foreground" />
    </Button>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <nav class="flex flex-col gap-1">
      {#each items as { label, href, routeId, visible } (href)}
        {#if visible}
          <SidebarLink {href} {label} class="pl-7" />
        {/if}
      {/each}
    </nav>
  </Collapsible.Content>
</Collapsible.Root>
