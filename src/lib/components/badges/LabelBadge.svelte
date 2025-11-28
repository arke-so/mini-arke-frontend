<script lang="ts">
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import Button from '$ds/components/ui/button/button.svelte'
  import { _ } from 'svelte-i18n'

  export let colored: boolean = false
  export let index: number | undefined = undefined
  export let removable: boolean = false

  const colors = [
    'bg-teal-100 border-teal-200 dark:bg-teal-800 dark:border-teal-600',
    'bg-blue-100 border-blue-200 dark:bg-blue-800 dark:border-blue-600',
    'bg-amber-100 border-amber-200 dark:bg-amber-800 dark:border-amber-600',
    'bg-sky-100 border-sky-200 dark:bg-sky-800 dark:border-sky-600',
    'bg-orange-100 border-orange-200 dark:bg-orange-800 dark:border-orange-600',
    'bg-emerald-100 border-emerald-200 dark:bg-emerald-800 dark:border-emerald-600',
    'bg-pink-100 border-pink-200 dark:bg-pink-800 dark:border-pink-600',
    'bg-red-100 border-red-200 dark:bg-red-800 dark:border-red-600',
    'bg-purple-100 border-purple-200 dark:bg-purple-800 dark:border-purple-600',
    'bg-violet-100 border-violet-200 dark:bg-violet-800 dark:border-violet-600',
    'bg-indigo-100 border-indigo-200 dark:bg-indigo-800 dark:border-indigo-600',
    'bg-cyan-100 border-cyan-200 dark:bg-cyan-800 dark:border-cyan-600',
    'bg-lime-100 border-lime-200 dark:bg-lime-800 dark:border-lime-600',
    'bg-yellow-100 border-yellow-200 dark:bg-yellow-800 dark:border-yellow-600',
    'bg-rose-100 border-rose-200 dark:bg-rose-800 dark:border-rose-600',
  ]

  $: color = index !== undefined ? colors[index % colors.length] : colors[Math.floor(Math.random() * colors.length)]
</script>

<div
  class="{$$restProps.class || ''} flex flex-wrap items-center gap-1 rounded border px-1 {colored
    ? color
    : 'bg-secondary/30 '}">
  <slot />

  {#if removable}
    <Button variant="ghostDestructive" class="ml-2 h-4 w-4 rounded p-0 text-foreground" on:click>
      <div class="sr-only">{$_('Remove')}</div>
      <IcoNoir.X class={IconSize.Button} />
    </Button>
  {/if}
</div>
