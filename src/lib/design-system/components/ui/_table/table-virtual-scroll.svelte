<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import InfiniteLoading from 'svelte-infinite-loading'
  import type { UnknownWithID } from '.'
  import VirtualList from './virtual-list/VirtualList.svelte'

  export let items: Array<UnknownWithID> = []
  // export let height: number = 600
  export let itemHeight: number = 50
  export let loading: boolean = false
  export let headsCount: number = 1

  const dispatch = createEventDispatcher()

  let clientHeight = 0
</script>

<div class="virtualized-table {$$restProps.class || ''}" bind:clientHeight>
  <VirtualList height={clientHeight} width="100%" itemCount={items.length} itemSize={itemHeight}>
    <svelte:fragment slot="header">
      <slot name="thead" />
    </svelte:fragment>

    <svelte:fragment slot="item" let:index let:style>
      <infinite-table-row class="!relative table-row" {style}>
        <slot name="row" {style} {index} item={items[index]} />
      </infinite-table-row>
    </svelte:fragment>

    <svelte:fragment slot="footer">
      {#if loading}
        {#each ['w-1/3', 'w-1/5', 'w-4/5', 'w-1/5', 'w-3/5'] as placeholderWidth}
          <infinite-table-row class="table-row">
            {#each { length: headsCount } as _}
              <div
                class="table-cell h-10 border border-b-0 border-r-0 border-stone-200 p-2 align-middle last:border-r group-last:border-b dark:border-stone-700">
                <div class="h-4 {placeholderWidth} animate-pulse rounded bg-stone-200 dark:bg-stone-700" />
              </div>
            {/each}
          </infinite-table-row>
        {/each}
      {:else}
        <InfiniteLoading on:infinite={() => dispatch('load-mode')} />
      {/if}
    </svelte:fragment>
  </VirtualList>
</div>

<style>
  .virtualized-table {
    @apply w-full;
  }

  .virtualized-table :global(.virtual-list-wrapper) {
    @apply w-full;
  }

  .virtualized-table :global(.virtual-list-inner) {
    @apply table w-full align-middle text-sm;
  }
</style>
