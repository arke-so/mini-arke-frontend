<script lang="ts">
  import { goto } from '$app/navigation'
  import { Icons } from '$ds/components/icons'
  import { Button, type Variant } from '$ds/components/ui/button'
  import { logout } from '$flows/login'
  import { loginRoute } from '$utils/routes'
  import { _ } from 'svelte-i18n'
  import { scale } from 'svelte/transition'

  export let variant: Variant = 'default'

  let inflight: boolean = false

  async function logoutUser() {
    inflight = true
    await new Promise(r => setTimeout(r, 1000))
    await logout()
    goto(loginRoute())
    inflight = false
  }
</script>

<Button {variant} disabled={inflight} class={$$restProps.class} on:click={logoutUser}>
  {#if inflight}
    <div in:scale={{ duration: 200 }}>
      <Icons.Refresh class="h-4 w-4 animate-spin" />
    </div>
  {:else}
    {$_('Sign Out')}

    {#if variant !== 'link'}
      <Icons.Logout class="ml-2 h-4 w-4" />
    {/if}
  {/if}
</Button>
