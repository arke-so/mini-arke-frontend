<script lang="ts">
  import { page } from '$app/stores'
  import { PageTab } from '$fixtures/tabs'

  export let paramName: string = 'tab'

  $: activeTab = $page.url.searchParams.get(paramName) || PageTab.Details
</script>

{#if activeTab !== PageTab.Attachments}
  <slot {activeTab} />
{/if}
