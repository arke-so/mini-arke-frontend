<script lang="ts">
  import * as Alert from '$ds/components/ui/alert'

  export let title: string | undefined = undefined
  export let variant: AlertVariant = 'default'

  type AlertVariant = 'default' | 'error' | 'info' | 'warning' | 'success'

  function variantToClasses(variant: AlertVariant) {
    switch (variant) {
      case 'error':
        return 'bg-error/10 border-none text-destructive'
      case 'info':
        return 'bg-info/10 border-none text-info'
      case 'warning':
        return 'bg-warning/10 border-none text-warning'
      case 'success':
        return 'bg-success/10 border-none text-success'
      case 'default':
      default:
        return 'bg-muted border-none text-muted-foreground'
    }
  }

  $: alertClass = variantToClasses(variant)
</script>

<Alert.Root class="{alertClass} {$$restProps.class || ''}">
  <div class="flex items-center gap-3">
    <div class="flex-1">
      {#if title}
        <Alert.Title class="font-semibold">{title}</Alert.Title>
      {/if}

      <Alert.Description class="text-xs">
        <slot />
      </Alert.Description>
    </div>

    {#if $$slots.action}
      <div class="ml-auto">
        <slot name="action" />
      </div>
    {/if}
  </div>
</Alert.Root>
