<script lang="ts">
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import type { MissingRawMaterial } from '$api/supply'
  import { areAllMaterialsAvailable, areAllMaterialsUnavailable } from '$utils/inventory'
  import { _ } from 'svelte-i18n'

  export let missingMaterials: MissingRawMaterial[] = []
  export let minimal: boolean = false
  export let hasError: boolean = false

  function getVariant(materials: MissingRawMaterial[], error: boolean): StatusType {
    if (error) return 'error'

    const inventories = materials.map(m => m.inventory)

    if (areAllMaterialsAvailable(inventories)) return 'success'
    if (areAllMaterialsUnavailable(inventories)) return 'error'
    else return 'warning'
  }

  function getLabel(materials: MissingRawMaterial[], error: boolean): string {
    if (error) return $_('Failed To Load Availability')

    const inventories = materials.map(m => m.inventory)

    if (areAllMaterialsAvailable(inventories)) return $_('Materials Available')
    if (areAllMaterialsUnavailable(inventories)) return $_('Not Available')
    else return $_('Partially Available')
  }

  $: label = getLabel(missingMaterials, hasError)
  $: variant = getVariant(missingMaterials, hasError)
</script>

<ColoredLabel {variant} {label} {minimal} {...$$restProps} />
