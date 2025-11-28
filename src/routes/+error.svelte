<script lang="ts">
  import { page } from '$app/stores'
  import { Main } from '$components/main'
</script>

<Main.Basic class="flex items-center justify-center">
  <h1 class="cursor-default text-3xl font-light">
    {$page?.error?.status || 'Error'}
  </h1>
</Main.Basic>
