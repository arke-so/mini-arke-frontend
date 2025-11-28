<script lang="ts">
  import { ProductionItemStatusEnum, type ProductionItem } from '$api/product'
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { _ } from 'svelte-i18n'

  export let item: ProductionItem
  export let minimal: boolean = false

  function getVariant(productionItem: ProductionItem): StatusType {
    if (productionItem.status === ProductionItemStatusEnum.Completed) {
      return 'success'
    }

    if (productionItem.status === ProductionItemStatusEnum.InProgress) {
      return 'info'
    }

    return 'default'
  }

  function getLabel(productionItem: ProductionItem): string {
    if (productionItem.status === ProductionItemStatusEnum.Completed) {
      return $_('Completed')
    }

    if (productionItem.status === ProductionItemStatusEnum.InProgress) {
      return $_('In Production')
    }

    return $_('Planned')
  }

  $: label = getLabel(item)
  $: variant = getVariant(item)
</script>

<ColoredLabel {variant} {label} {minimal} {...$$restProps} />
