<script lang="ts">
  import { browser } from '$app/environment'
  import ProseContent from '$components/utils/ProseContent.svelte'
  import DOMPurify from 'dompurify'
  import { marked } from 'marked'
  import { _ } from 'svelte-i18n'

  export let content: string = ''
  export let fallbackText: string = $_('No Content')
  let className: string = ''
  export { className as class }

  $: renderedHtml =
    !content || !browser
      ? `<span class="text-muted-foreground text-sm m-0">${fallbackText}</span>`
      : DOMPurify.sanitize(marked.parse(content) as string)
</script>

<ProseContent class={className}>
  {#if browser}
    {@html renderedHtml}
  {:else}
    <span class="text-muted-foreground m-0 text-sm">{$_('Loading...')}</span>
  {/if}
</ProseContent>
