<script lang="ts">
  import IconButton from '$components/form/IconButton.svelte'
  import SquareIcon from '$components/icons/SquareIcon.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Card } from '$ds/components/ui/card'
  import { ArrowRight } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'

  const iconColorClasses = {
    green: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-600',
    },
    violet: {
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

  export let icon: ConstructorOfATypedSvelteComponent
  export let iconColor: keyof typeof iconColorClasses = 'green'
  export let loading: boolean = false
  export let error: string | null = null

  $: colorClasses = iconColorClasses[iconColor]
  $: iconContainerClasses = error
    ? 'border-destructive/20 bg-destructive/10'
    : `${colorClasses.bg} ${colorClasses.border}`
  $: showFooter = !loading && !error
</script>

<Card class="grid min-h-64 grid-rows-2 items-start gap-4 bg-background p-4 md:p-6">
  <div class="flex gap-4">
    {#if loading}
      <div class="h-12 w-12 animate-pulse rounded-lg bg-muted" />
    {:else}
      <SquareIcon
        icon={error ? IcoNoir.X : icon}
        class="size-12 {iconContainerClasses}"
        iconClass={`${colorClasses.text} h-6 w-6 ${error ? 'text-destructive' : ''}`} />
    {/if}

    {#if loading}
      <div class="flex flex-col gap-4">
        <div class="h-6 w-32 animate-pulse rounded bg-muted" />
        <div class="h-4 w-28 animate-pulse rounded bg-muted" />
      </div>
    {:else if error}
      <div>
        <h3 class="text-2xl font-bold text-destructive">{$_('Error')}</h3>
        <div class="text-sm text-destructive">{error}</div>
      </div>
    {:else}
      <div class="flex min-w-0 flex-col gap-1">
        <slot name="metric" />
        <slot name="description" />
      </div>
    {/if}
  </div>

  <div class="flex h-full items-end justify-between gap-2">
    {#if loading}
      <div class="h-6 w-32 animate-pulse rounded bg-muted" />
      <div class="flex h-8 w-8 animate-pulse items-center justify-center self-end rounded-lg bg-muted" />
    {:else if showFooter}
      <slot name="details" />
      <IconButton class="bg-muted" variant="outline" tooltip={$_('View details')}>
        <ArrowRight class={IconSize.Small} />
      </IconButton>
    {/if}
  </div>
</Card>
