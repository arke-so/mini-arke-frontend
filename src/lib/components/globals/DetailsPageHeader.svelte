<script lang="ts">
  import { Heading } from '$components/heading'
  import type { NavLink } from '$components/utils/NavLinkUtil.svelte'
  import PageTabs from './PageTabs.svelte'

  export let heading: string = ''
  export let target: any = null
  export let optionalTabs: Array<NavLink> = []
  export let showTabs: boolean = true
  export let spacing: boolean = true
</script>

<div class="bg-background pb-2 md:border-b" class:mb-6={spacing} class:max-md:hidden={!showTabs}>
  <Heading.H2 class="hidden md:block">
    {heading}
  </Heading.H2>

  {#if showTabs}
    <div class="mt-2">
      <PageTabs {target} {optionalTabs} />
    </div>
  {/if}
</div>
