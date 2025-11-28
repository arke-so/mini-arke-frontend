<script lang="ts">
  import { filterColumn, getColumnFilter } from '$components/filters/SmartSearch.svelte'
  import IconButton from '$components/form/IconButton.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import type { FilterQuery } from '$utils/filters'
  import { _ } from 'svelte-i18n'
  import Head from './head.svelte'

  export let main: boolean = false
  export let name: string = ''
  export let filterName: string = name
  export let currentQuery: FilterQuery

  $: filter = getColumnFilter(filterName)
  $: isActive = currentQuery && currentQuery.query && filter ? currentQuery.query[filter.id] !== undefined : false
</script>

<Head {main} {...$$restProps}>
  <div class="flex items-center justify-between">
    <div class="truncate">{name}</div>

    <IconButton
      variant="secondary"
      class="hidden h-6 w-6 rounded lg:inline-flex {isActive ? 'border-primary/20 bg-primary/10' : ''}"
      tooltip={$_('Filter Column Label', { values: { column: name } })}
      on:click={() => filterColumn(filterName)}>
      <IcoNoir.Filter class={IconSize.Micro} />
    </IconButton>
  </div>
</Head>
