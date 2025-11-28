<script lang="ts">
  import type { ExtendedOption } from '$utils/generics'
  import { _, date } from 'svelte-i18n'

  export let option: ExtendedOption

  $: datestring = (option.attr as any)?.created?.at ? $date((option.attr as any)?.created?.at) : '-'
</script>

<div>
  <div>{option.label}</div>
  <div class="text-xs text-muted-foreground">
    {$_('Lot Date')}: {datestring}
  </div>
</div>
