<script lang="ts">
  import type { ExtendedOption } from '$utils/generics'

  export let option: ExtendedOption
</script>

<div>
  <div>{option?.attr?.externalId || option.label}</div>
  <div class="text-xs text-muted-foreground">{`${option?.label} — ${option?.attr?.customerAttr?.name}`}</div>
</div>
