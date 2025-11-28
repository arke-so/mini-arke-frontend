<script lang="ts">
  import { Heading } from '$components/heading'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import Separator from '$ds/components/ui/separator/separator.svelte'
  import { _ } from 'svelte-i18n'

  export let heading: string = $_('Info Tip')
</script>

<Heading.H4 class="flex items-center gap-2 rounded-t px-4 pt-3">
  <IcoNoir.ArkeLogoOnly class={IconSize.Medium} />
  {heading}
</Heading.H4>

<div class="my-3 px-4">
  <Separator />
</div>

<div class="px-4 pb-3 text-xs text-stone-500">
  <slot>The content goes here</slot>
</div>
