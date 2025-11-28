<script lang="ts" context="module">
  export function createPageTabLink(options: {
    label: string
    routeId: string
    tabValue: string
    disabled?: boolean
    visible?: boolean
    attentionNeeded?: boolean
  }): NavLink {
    const { label, routeId, tabValue, disabled = false, visible = true, attentionNeeded = false } = options
    return {
      label,
      href: '?' + (tabValue ? `tab=${tabValue}` : ''),
      routeId,
      disabled,
      exact: true,
      attentionNeeded,
      useQueryParam: 'tab',
      visible,
    }
  }
</script>

<script lang="ts">
  import { page } from '$app/stores'
  import PageFiltersLink from '$components/filters/PageFiltersLink.svelte'
  import type { NavLink } from '$components/utils/NavLinkUtil.svelte'
  import { PageTab } from '$fixtures/tabs'
  import { _ } from 'svelte-i18n'

  export let target: any = null
  export let optionalTabs: Array<NavLink> = []

  function buildHref(href: string): string {
    const currentQueryParams = $page.url.searchParams
    const searchParams = new URLSearchParams(href)
    currentQueryParams.forEach((value, key) => {
      if (key !== 'tab') searchParams.set(key, value)
    })

    return `?${searchParams.toString()}`
  }

  $: tabs = [
    createPageTabLink({
      label: $_('Details'),
      routeId: PageTab.Details,
      tabValue: '',
    }),
    ...optionalTabs,
    createPageTabLink({
      label: $_('Notes'),
      routeId: PageTab.Notes,
      tabValue: PageTab.Notes,
    }),
    createPageTabLink({
      label: $_('Attachments'),
      routeId: PageTab.Attachments,
      tabValue: PageTab.Attachments,
      disabled: !target,
    }),
  ].map(tab => ({
    ...tab,
    href: buildHref(tab.href),
  }))
</script>

<div class="flex">
  {#if tabs.length > 0}
    <ul class="flex items-center gap-0.5 rounded bg-stone-100 p-0.5 text-lg dark:bg-stone-700">
      {#each tabs as { label, href, routeId, disabled, exact, useQueryParam, visible, attentionNeeded } (routeId)}
        {#if visible === undefined || visible}
          <li>
            <PageFiltersLink {href} {routeId} {exact} {label} {useQueryParam} {disabled} {attentionNeeded} />
          </li>
        {/if}
      {/each}
    </ul>
  {/if}
</div>
