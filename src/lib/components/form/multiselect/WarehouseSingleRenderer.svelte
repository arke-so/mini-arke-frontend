<script lang="ts">
  import type { WarehouseSummary } from '$api/iam'
  import ColoredAvatar from '$components/avatar/ColoredAvatar.svelte'
  import type { ExtendedOption } from '$utils/generics'
  import { getWarehouseIcon, getWarehouseIconClasses } from '$utils/warehouses'

  export let option: ExtendedOption<WarehouseSummary>
</script>

<div class="flex items-center gap-2">
  {#if option.attr}
    <ColoredAvatar icon={getWarehouseIcon(option.attr)} class={getWarehouseIconClasses(option.attr)} disableColoring />
  {/if}

  <div class="flex-1">
    <div>
      {option?.label}
    </div>
    <div class="line-clamp-1 text-xs text-muted-foreground">{option.attr?.address?.address}</div>
  </div>
</div>
