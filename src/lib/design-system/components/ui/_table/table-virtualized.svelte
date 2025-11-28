<script lang="ts">
  // @ts-nocheck
  import * as Table from '$ds/components/ui/table'
  import type { FilterQuery } from '$utils/filters'
  import { createEventDispatcher, onMount, tick } from 'svelte'
  import { _ } from 'svelte-i18n'
  import { flip } from 'svelte/animate'

  // The below is a workaround to allow the component to be generic
  // and accept any type of items, while still providing some kind of type safety.
  type T = $$Generic
  interface $$Slots {
    thead: {}
    row: { item: T }
    rowDetail: { item: T }
    loading: {}
    empty: {}
  }

  const dispatch = createEventDispatcher()

  let scrollElement

  function onLoadMore() {
    // console.log('onLoadMore')
    dispatch('load-more')
  }

  // props
  export let items: Array<T> = []
  export let height: string = '100%'
  export let itemHeight: number | undefined = undefined
  export let headsCount: number = 1
  export let loading: boolean = false
  export let sticky: boolean = false
  export let disableVirtualization: boolean = false
  export let hasNext: boolean = true
  export let currentQuery: FilterQuery = null
  export let emptyMessage: string = $_('No Results Found')
  export let iteratorKey: string = 'id'
  export let animateSorting: boolean = false
  export let highlightRows: boolean = true
  export let onNextPage = () => {}
  export let hasRowDetail: (item: any) => boolean = () => false

  // read-only, but visible to consumers via bind:start
  export let start = 0
  export let end = 0

  // local state
  let height_map = []
  let rows
  let viewport
  let contents
  let viewport_height = 0
  let visible
  let mounted

  let top = 0
  let bottom = 0
  let average_height
  let observer
  let ready = false

  $: keyField = disableVirtualization ? iteratorKey : 'index'
  $: visible = items.slice(start, end).map((data, i) => ({ index: i + start, data }))
  $: rendered = disableVirtualization ? items : visible

  // whenever `items` changes, invalidate the current heightmap
  $: if (!disableVirtualization && mounted) refresh(items, viewport_height, itemHeight)

  async function refresh(items, viewport_height, itemHeight) {
    if (disableVirtualization) return

    const { scrollTop } = viewport

    await tick() // wait until the DOM is up to date

    let content_height = top - scrollTop
    let i = start

    while (content_height < viewport_height && i < items.length) {
      let row = rows[i - start]

      if (!row) {
        end = i + 1
        await tick() // render the newly visible row
        row = rows[i - start]
      }

      const row_height = (height_map[i] = itemHeight || row.offsetHeight)
      content_height += row_height
      i += 1
    }

    end = i + 10

    const remaining = items.length - end
    average_height = (top + content_height) / end

    bottom = remaining * average_height
    height_map.length = items.length
  }

  async function handle_scroll() {
    if (typeof window === 'undefined') return
    if (scrollElement && scrollElement.getBoundingClientRect().top <= window?.innerHeight + 100) triggerNextPage()

    if (disableVirtualization) return

    const { scrollTop } = viewport

    const old_start = start

    for (let v = 0; v < rows.length; v += 1) {
      height_map[start + v] = itemHeight || rows[v].offsetHeight
    }

    let i = 0
    let y = 0

    while (i < items.length) {
      const row_height = height_map[i] || average_height
      if (y + row_height > scrollTop) {
        start = i
        top = y

        break
      }

      y += row_height
      i += 1
    }

    while (i < items.length) {
      y += height_map[i] || average_height
      i += 1

      if (y > scrollTop + viewport_height) break
    }

    end = i + 10

    const remaining = items.length - end
    average_height = y / end

    while (i < items.length) height_map[i++] = average_height
    bottom = remaining * average_height

    // prevent jumping if we scrolled up into unknown territory
    if (start < old_start) {
      await tick()

      let expected_height = 0
      let actual_height = 0

      for (let i = start; i < old_start; i += 1) {
        if (rows[i - start]) {
          expected_height += height_map[i]
          actual_height += itemHeight || rows[i - start].offsetHeight
        }
      }

      const d = actual_height - expected_height
      viewport.scrollTo(0, scrollTop + d)
    }

    // TODO if we overestimated the space these
    // rows would occupy we may need to add some
    // more. maybe we can just call handle_scroll again?
  }

  function triggerNextPage() {
    onNextPage()
    dispatch('next-page')
  }

  // trigger initial refresh
  onMount(() => {
    rows = contents.getElementsByTagName('infinite-table-row')
    mounted = true
    ready = true
  })
</script>

<div
  class="infinite-scroll-table relative overflow-y-auto {$$restProps.class || ''}"
  class:virtualization-disabled={disableVirtualization}
  bind:this={viewport}
  bind:offsetHeight={viewport_height}
  on:scroll={handle_scroll}
  style="height: {height}">
  <div
    class="table w-full align-middle text-sm"
    bind:this={contents}
    style="padding-top: {top}px; padding-bottom: {bottom}px;">
    <div class="thead top-0 z-10 table-header-group bg-background" class:sticky>
      <slot name="thead" />
    </div>

    {#if animateSorting}
      {#each rendered as row (row[keyField])}
        <infinite-table-row
          class="group table-row {highlightRows ? 'hover:bg-muted/70 dark:hover:bg-muted/50' : ''}"
          animate:flip={{ duration: 300 }}>
          <slot name="row" item={disableVirtualization ? row : row.data}>Missing template</slot>
        </infinite-table-row>
      {/each}
    {:else}
      {#each rendered as row (row[keyField])}
        <infinite-table-row class="group table-row {highlightRows ? 'hover:bg-muted/70 dark:hover:bg-muted/50' : ''}">
          <slot name="row" item={disableVirtualization ? row : row.data}>Missing template</slot>
        </infinite-table-row>

        {#if hasRowDetail(disableVirtualization ? row : row.data)}
          <Table.Row class="hover:bg-transparent">
            <Table.Cell class="p-0" colspan={headsCount} aria-live="polite">
              <slot name="rowDetail" item={disableVirtualization ? row : row.data} />
            </Table.Cell>
          </Table.Row>
        {/if}
      {/each}
    {/if}

    {#if ready && rendered.length === 0}
      <slot name="empty">
        <Table.Row class="hover:bg-transparent">
          <Table.Cell colspan={headsCount} class="py-8 text-center" aria-live="polite">
            {#if currentQuery?.search}
              {$_('No Results Found With Search', { values: { search: currentQuery.search } })}
            {:else}
              {emptyMessage}
            {/if}
          </Table.Cell>
        </Table.Row>
      </slot>
    {:else if ready && !loading && hasNext}
      <infinite-table-row class="table-row">
        <div class="h-0 w-full" bind:this={scrollElement} />
      </infinite-table-row>
    {:else if loading}
      <slot name="loading">
        {#each ['w-1/3', 'w-1/5', 'w-4/5', 'w-1/5', 'w-3/5', 'w-1/3', 'w-1/5', 'w-4/5', 'w-1/5', 'w-3/5'] as placeholderWidth}
          <infinite-table-row class="table-row">
            {#each { length: headsCount } as _}
              <div
                class="table-cell h-10 border border-b-0 border-r-0 border-stone-200 p-2 align-middle first:border-l-0 group-last:border-b dark:border-stone-700">
                <div class="h-4 {placeholderWidth} animate-pulse rounded bg-stone-200 dark:bg-stone-700" />
              </div>
            {/each}
          </infinite-table-row>
        {/each}
      </slot>
    {/if}
  </div>
</div>

<style>
  .infinite-scroll-table {
    -webkit-overflow-scrolling: touch;
    display: block;
  }
</style>
