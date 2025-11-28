<script lang="ts">
  import AlertMessage from '$components/utils/AlertMessage.svelte'
  import { _ } from 'svelte-i18n'

  export let errorMessage: string | null = null
</script>

{#if errorMessage}
  <AlertMessage title={$_('Error')} variant="error">
    {errorMessage}
  </AlertMessage>
{/if}
