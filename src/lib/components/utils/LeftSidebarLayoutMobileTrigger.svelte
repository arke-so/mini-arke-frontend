<script lang="ts">
  import { leftLayoutSidebarShown } from '$components/layouts/LeftSidebarLayout.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import { _ } from 'svelte-i18n'

  function handleClick(_: MouseEvent) {
    leftLayoutSidebarShown.update(shown => !shown)
  }
</script>

<Button variant="secondary" size="icon" on:click={handleClick}>
  <IcoNoir.Menu class={IconSize.Small} />
  <span class="sr-only">{$_('Open Sidebar')}</span>
</Button>
