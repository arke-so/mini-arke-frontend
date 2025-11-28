<script lang="ts">
  import { getConfidenceInfo } from '$utils/document-extraction'
  import type { ExtendedOption } from '$utils/generics'

  export let option: ExtendedOption

  interface MatchingAttr {
    id: string
    name: string
    externalId?: string
    score?: number
  }

  $: attr = option.attr as MatchingAttr
  $: confidenceInfo = attr?.score !== undefined ? getConfidenceInfo([{ score: attr.score }]) : null
</script>

<div>
  <div class="font-medium">{option?.label}</div>
  <div class="text-muted-foreground/80 text-xs">{attr?.externalId}</div>
  {#if attr?.score !== undefined && confidenceInfo}
    <div class="flex gap-2">
      <div class="text-xs font-medium {confidenceInfo.confidenceClass}">
        {confidenceInfo.percentage}%
      </div>
    </div>
  {/if}
</div>
