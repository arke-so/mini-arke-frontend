<script lang="ts">
  import type { WebhookDetailsStatusEnum } from '$api/integrations'
  import type { StatusType } from '$components/badges/ColoredLabel.svelte'
  import ColoredLabel from '$components/badges/ColoredLabel.svelte'
  import { _ } from 'svelte-i18n'

  export let status: WebhookDetailsStatusEnum = 'active'
  export let minimal: boolean = false

  function statusToVariant(status: WebhookDetailsStatusEnum): StatusType {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'default'
      default:
        return 'default'
    }
  }

  function getStatusLabel(status: WebhookDetailsStatusEnum): string {
    switch (status) {
      case 'active':
        return $_('Active')
      case 'inactive':
        return $_('Inactive')
      default:
        return $_('Unknown')
    }
  }

  $: label = getStatusLabel(status)
  $: variant = statusToVariant(status)
</script>

<ColoredLabel {variant} {label} {minimal} {...$$restProps} />
