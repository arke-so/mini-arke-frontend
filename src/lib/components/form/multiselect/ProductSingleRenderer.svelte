<script lang="ts">
  import type { ExtendedOption } from '$utils/generics'

  export let option: ExtendedOption
</script>

<div>
  <div>{option.label}</div>
  <div class="text-xs text-muted-foreground">{option.attr?.internalId}</div>
</div>
