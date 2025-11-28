<script lang="ts">
  import type { MissingRawMaterial } from '$api/supply'
  import { DEFAULT_CURRENCY_CODE } from '$fixtures/currencies'
  import type { ExtendedOption } from '$utils/generics'
  import { renderPrice } from '$utils/prices'
  import { _ } from 'svelte-i18n'

  export let option: ExtendedOption<MissingRawMaterial>
</script>

<div class="w-full">
  <div class="truncate">
    {option?.label}
  </div>
  <div class="flex w-full items-center justify-between text-xs text-muted-foreground">
    <div class="w-1/2 truncate">
      {option.attr?.supplierAttr?.name}
    </div>
    <div>
      {$_('Estimated Cost')}:
      {renderPrice(
        (option.attr?.estimatedCost?.unit || 0) +
          ((option.attr?.estimatedCost?.unit || 0) * (option.attr?.estimatedCost?.vat || 0)) / 100,
        option.attr?.estimatedCost?.currency || DEFAULT_CURRENCY_CODE,
      )}
    </div>
  </div>
</div>
