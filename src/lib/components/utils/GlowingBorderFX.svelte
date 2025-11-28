<script lang="ts">
  import { IcoNoir } from '$ds/components/icons/iconoir'

  export let active: boolean = true
</script>

{#if active}
  <div class="card-wrapper relative overflow-hidden rounded-lg bg-border {$$restProps.class || ''}">
    <div
      class="logo absolute left-[1px] top-[1px] flex h-[calc(100%-2px)] w-[calc(100%-2px)] items-center justify-center rounded-lg bg-background">
      <slot>
        <IcoNoir.ArkeLogoOnly class="w-10" />
      </slot>
    </div>
  </div>
{:else}
  <slot />
{/if}

<style lang="postcss">
  .card-wrapper::before {
    background: conic-gradient(
      transparent 0deg,
      rgba(236, 104, 168, 1) 30deg,
      rgba(236, 104, 168, 1) 65deg,
      rgb(52, 85, 232, 1) 85deg,
      transparent 120deg
    );

    @apply absolute left-[-25%] top-[-25%] h-[150%] w-[150%] animate-border-spin content-[''];
  }

  .logo {
    animation: animate-color 4s ease infinite;
  }

  @keyframes animate-color {
    0% {
      @apply text-pink-500;
    }
    50% {
      @apply text-blue-500;
    }
    100% {
      @apply text-pink-500;
    }
  }
</style>
