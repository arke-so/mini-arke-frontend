<script lang="ts">
  let className: string = ''
  export { className as class }
</script>

<div class="prose-content {className}">
  <slot />
</div>

<style lang="postcss">
  .prose-content :global(> *) {
    @apply my-1;
  }

  .prose-content :global(h1),
  .prose-content :global(h2),
  .prose-content :global(h3),
  .prose-content :global(h4),
  .prose-content :global(h5),
  .prose-content :global(h6) {
    @apply text-base font-semibold;
  }

  .prose-content :global(ul) {
    @apply list-disc pl-4;
  }
  .prose-content :global(ol) {
    @apply list-decimal pl-4;
  }

  .prose-content :global(table) {
    @apply w-full table-auto border-collapse;
  }
  .prose-content :global(table th) {
    @apply border-b-2 p-2 text-left dark:border-stone-500;
  }
  .prose-content :global(table td) {
    @apply border-b p-2 dark:border-stone-500;
  }
  .prose-content :global(a) {
    @apply underline;
  }
</style>
