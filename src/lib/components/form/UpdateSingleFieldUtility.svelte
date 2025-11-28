<script lang="ts">
  import BusyButton from '$components/form/BusyButton.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { isMobile } from '$stores/app'
  import { wait } from '$utils/wait'
  import { _ } from 'svelte-i18n'

  export let onUpdate: ((nextValue: unknown) => Promise<void>) | undefined = undefined

  let busy: boolean = false
  let changed: boolean = false
  let updated: boolean = false
  let nextValue: unknown = null

  function onChange(v: unknown) {
    nextValue = v
    changed = true
  }

  async function handleUpdate() {
    try {
      if (!onUpdate || nextValue === undefined) return

      busy = true
      await onUpdate(nextValue)
    } catch {
    } finally {
      busy = false
      changed = false
      updated = true
      await wait(2000)
      updated = false
    }
  }
</script>

<div class="flex {$$restProps.class || ''}">
  <div class="flex items-end gap-2 rounded transition-all {changed ? 'bg-muted/60 ring-8 ring-muted/60' : ''}">
    <slot classes={updated ? 'attention-seeker shadow-border' : ''} {onChange} />

    {#if changed}
      <BusyButton
        variant="secondary"
        class="flex items-center gap-1"
        size={$isMobile ? 'icon' : 'default'}
        {busy}
        on:click={handleUpdate}>
        <IcoNoir.Check class={IconSize.Small} />
        <span class="hidden md:inline-block">{$_('Update')}</span>
      </BusyButton>
    {/if}
  </div>
</div>
