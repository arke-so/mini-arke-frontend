<script lang="ts">
  import type { RawMaterialSummary } from '$api/supply'
  import type { ExtendedOption } from '$utils/generics'

  export let option: ExtendedOption<RawMaterialSummary>
</script>

<div>
  <div>
    {option?.label}
  </div>
  <div class="text-xs text-muted-foreground">{option.attr?.externalId}</div>
</div>
