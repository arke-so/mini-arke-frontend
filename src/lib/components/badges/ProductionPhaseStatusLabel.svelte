<script lang="ts">
  import { ProductionItemPhaseSummaryStatusEnum, type ProductionItemPhaseSummary } from '$api/product'
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { _ } from 'svelte-i18n'

  export let item: ProductionItemPhaseSummary
  export let minimal: boolean = false

  function getVariant(productionItem: ProductionItemPhaseSummary): StatusType {
    if (productionItem.status === ProductionItemPhaseSummaryStatusEnum.Completed) {
      return 'success'
    }

    if (productionItem.status === ProductionItemPhaseSummaryStatusEnum.Ready) {
      return 'warning'
    }

    if (productionItem.status === ProductionItemPhaseSummaryStatusEnum.Started) {
      return 'info'
    }

    return 'default'
  }

  function getLabel(productionItem: ProductionItemPhaseSummary): string {
    if (productionItem.status === ProductionItemPhaseSummaryStatusEnum.Completed) {
      return $_('Completed')
    }

    if (productionItem.status === ProductionItemPhaseSummaryStatusEnum.Ready) {
      return $_('To Start')
    }

    if (productionItem.status === ProductionItemPhaseSummaryStatusEnum.Started) {
      return $_('In Progress')
    }

    return $_('Not Ready')
  }

  $: label = getLabel(item)
  $: variant = getVariant(item)
</script>

<ColoredLabel {variant} {label} {minimal} {...$$restProps} />
