<script lang="ts">
  import { Heading } from '$components/heading'
  import * as Sheet from '$ds/components/ui/sheet'

  export let heading: string = ''
  export let headingClass: string = 'overflow-y-auto px-4'
  export let contentHeight: string = 'h-[calc(100svh-theme(spacing.12))]'
  export let contentClass: string = 'px-4 pb-4 overflow-y-auto'
</script>

<div class="flex h-12 items-center justify-between {headingClass}">
  <Sheet.Title asChild>
    <slot name="heading">
      <Heading.H2>
        {heading}
      </Heading.H2>
    </slot>
  </Sheet.Title>
</div>

<div class="text-sm {contentHeight} {contentClass}">
  <slot />
</div>
