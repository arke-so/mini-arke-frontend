<script lang="ts">
  import { Card } from '$ds/components/ui/card'
  import { IcoNoir } from '$ds/components/icons/iconoir'
  import type { SvelteComponent } from 'svelte'
  import { _ } from 'svelte-i18n'

  const iconColorClasses = {
    green: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-600',
    },
    purple: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      text: 'text-violet-600',
    },
    pink: {
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
      text: 'text-pink-600',
    },
  }

  export let icon: typeof SvelteComponent
  export let iconColor: keyof typeof iconColorClasses = 'green'
  export let showArrow: boolean = true
  export let loading: boolean = false
  export let error: string | null = null

  $: colorClasses = iconColorClasses[iconColor]
</script>

<Card class="bg-background p-4 md:p-6">
  <div class="flex items-start justify-between gap-4">
    <div class="flex min-w-0 flex-1 items-start gap-4">
      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border {error
          ? 'border-destructive/20 bg-destructive/10'
          : colorClasses.bg + ' ' + colorClasses.border}">
        {#if error}
          <IcoNoir.X class="h-6 w-6 text-destructive" />
        {:else}
          <svelte:component this={icon} class="h-6 w-6 {loading ? 'opacity-30' : colorClasses.text}" />
        {/if}
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-1">
        {#if loading}
          <div class="h-8 w-24 animate-pulse rounded bg-muted" />
          <div class="h-4 w-32 animate-pulse rounded bg-muted" />
          <div class="mt-2 flex flex-col gap-0.5">
            <div class="h-4 w-28 animate-pulse rounded bg-muted" />
          </div>
        {:else if error}
          <h3 class="text-2xl font-bold text-destructive">{$_('Error')}</h3>
          <div class="text-sm text-destructive">{error}</div>
        {:else}
          <slot name="metric" />
          <slot name="description" />
          <div class="mt-2 flex flex-col gap-0.5">
            <slot name="details" />
          </div>
        {/if}
      </div>
    </div>

    {#if showArrow}
      {#if loading}
        <div class="flex h-8 w-8 shrink-0 animate-pulse items-center justify-center rounded-lg border bg-muted" />
      {:else}
        <button
          type="button"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-muted transition-colors hover:bg-muted/80"
          aria-label="View details">
          <IcoNoir.ChevronRight class="h-4 w-4 text-muted-foreground" />
        </button>
      {/if}
    {/if}
  </div>
</Card>
