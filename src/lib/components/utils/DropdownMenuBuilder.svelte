<script context="module" lang="ts">
  import type { SvelteComponent } from 'svelte'

  type ComponentConstructor = new (args: any) => SvelteComponent

  export type DropdownMenuItem = {
    label: string
    disabled?: boolean
    isClickable?: boolean
    isDestructive?: boolean
    eventName?: string
    icon?: ComponentConstructor
  }
</script>

<script lang="ts">
  import { Button, type Variant } from '$ds/components/ui/button'
  import * as DropdownMenu from '$ds/components/ui/dropdown-menu'
  import { cn } from '$ds/utils'
  import type { CustomEventHandler } from 'bits-ui'
  import Ellipsis from 'lucide-svelte/icons/ellipsis'
  import { createEventDispatcher } from 'svelte'

  export let variant: Variant = 'ghost'
  export let items: Array<DropdownMenuItem> = []
  export let align: 'start' | 'center' | 'end' | undefined = 'start'
  export let showTriggerOnHover: boolean = false
  export let triggerClass: string = 'h-8 w-8'
  export let onChoose: (
    eventId: string,
    originalEvent: CustomEventHandler<MouseEvent, HTMLDivElement>,
  ) => void = () => {}

  const dispatch = createEventDispatcher()

  function onClick(eventName: string, originalEvent: CustomEventHandler<MouseEvent, HTMLDivElement>) {
    onChoose(eventName, originalEvent)
    dispatch('choose', {
      eventName,
      originalEvent,
    })
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      aria-haspopup="true"
      size="icon"
      class={cn(showTriggerOnHover ? 'opacity-0 group-hover:opacity-100' : '', triggerClass)}
      {variant}
      builders={[builder]}>
      <Ellipsis class="h-4 w-4" />
      <span class="sr-only">Toggle menu</span>
    </Button>
  </DropdownMenu.Trigger>

  <DropdownMenu.Content {align}>
    {#each items as { label, icon, eventName, disabled, isDestructive, isClickable }}
      {#if isClickable && eventName}
        <DropdownMenu.Item
          class={isDestructive ? 'data-[highlighted]:bg-destructive/40' : ''}
          on:click={event => onClick(eventName, event)}
          {disabled}>
          {#if icon}
            <div class="mr-2 w-4">
              <svelte:component this={icon} class="h-4 w-4" />
            </div>
          {/if}
          {label}
        </DropdownMenu.Item>
      {:else}
        <DropdownMenu.Label>
          {label}
        </DropdownMenu.Label>
      {/if}
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
