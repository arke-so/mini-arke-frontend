<script lang="ts">
  import IconButton from '$components/form/IconButton.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { spotlightActive } from '$stores/app'
  import { isMac } from '$utils/platform'
  import { _ } from 'svelte-i18n'

  export let disabled: boolean = false

  const command = isMac() ? 'cmd+K' : 'ctrl+K'
</script>

<IconButton
  {disabled}
  variant="ghost"
  tooltip={$_('Spotlight Search Tooltip', { values: { command } })}
  on:click={() => spotlightActive.set(true)}
  on:click>
  <IcoNoir.Search class={IconSize.Medium} />
</IconButton>
