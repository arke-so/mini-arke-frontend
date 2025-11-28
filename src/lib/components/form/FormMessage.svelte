<script lang="ts">
  export let type: 'info' | 'warning' | 'error' | 'success' | 'default' = 'default'
  export let active: boolean = true

  const colors = {
    info: 'text-info-foreground bg-info',
    success: 'text-success-foreground bg-success',
    warning: 'text-warning-foreground bg-warning',
    error: 'text-alert-foregronud bg-alert',
    default: 'text-primary-foreground bg-primary-background',
  }
  $: themeClass = colors[type] || colors.default
</script>

{#if active}
  <div class="{themeClass} p-2 text-sm">
    <slot />
  </div>
{/if}
