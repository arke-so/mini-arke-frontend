<script lang="ts">
  import { TransportDocumentDetailsStatusEnum } from '$api/sales'
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { _ } from 'svelte-i18n'

  export let status: TransportDocumentDetailsStatusEnum = TransportDocumentDetailsStatusEnum.Draft
  export let minimal: boolean = false

  function getVariant(sts: TransportDocumentDetailsStatusEnum): StatusType {
    if (sts === TransportDocumentDetailsStatusEnum.Accepted) {
      return 'success'
    }

    return 'default'
  }

  function getLabel(sts: TransportDocumentDetailsStatusEnum): string {
    if (sts === TransportDocumentDetailsStatusEnum.Accepted) {
      return $_('Approved')
    }

    return $_('Draft')
  }

  $: label = getLabel(status)
  $: variant = getVariant(status)
</script>

<ColoredLabel {variant} {label} {minimal} {...$$restProps} />
