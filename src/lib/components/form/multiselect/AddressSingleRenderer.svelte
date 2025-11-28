<script lang="ts">
  import type { ExtendedOption } from '$utils/generics'

  export let option: ExtendedOption & {
    attr?: {
      internalId?: string
    }
  }
</script>

<div>
  <div class="text-xs">{option.label}</div>
  <!-- <div class="text-xs text-muted-foreground">{option.attr?.internalId}</div> -->
</div>
