<script lang="ts" context="module">
  export type RadioBlockOption = {
    id: string
    value: any
    label?: string
    description?: string
    icon?: ConstructorOfATypedSvelteComponent
    iconClass?: string
  }
</script>

<script lang="ts">
  import Check from '$ds/components/icons/iconoir/check.svelte'

  import { Label } from '$ds/components/ui/label'
  import * as RadioGroup from '$ds/components/ui/radio-group'
  import { onMount } from 'svelte'
  import { scale } from 'svelte/transition'
  import type { FormUtilAPI } from './FormUtil.svelte'

  export let formAPI: FormUtilAPI | undefined = undefined
  export let name: string = 'options'
  export let label: string | undefined = undefined
  export let showLabel: boolean = false
  export let options: Array<RadioBlockOption> = []
  export let value: any | undefined = options[0]?.value
  export let onChange: (value: any) => void = () => {}
  export let disabled: boolean = false

  let internalValue: any = formAPI?.form[name] || value || options[0]?.value

  async function onValueChange(value: any) {
    onChange(value)

    if (!formAPI) return

    formAPI.updateField(name, value)
  }

  onMount(() => {
    internalValue = formAPI?.form[name] || value || options[0]?.value
    onValueChange(internalValue)
  })
</script>

<div>
  {#if showLabel && label}
    <Label for={name} class="mb-2 block">
      {label}
    </Label>
  {/if}

  <RadioGroup.Root
    bind:value={internalValue}
    {onValueChange}
    {disabled}
    class={$$restProps.class || 'grid grid-cols-1 gap-2'}>
    {#each options as option}
      <slot {option}>
        <Label
          for={option.id}
          class="relative flex items-center gap-2 rounded-md border-2 border-muted bg-popover/80 p-4 transition-all duration-200 {disabled
            ? ''
            : 'hover:border-stone-200 hover:bg-popover'}  [&:has([data-state=checked])]:border-primary {option.icon
            ? 'pl-2'
            : ''}">
          <RadioGroup.Item value={option.value} id={option.id} class="sr-only" aria-label={option.label} />

          {#if option.icon}
            <div class="flex w-12 shrink-0 justify-center {option.iconClass || 'text-stone-400'}">
              <svelte:component this={option.icon} class="w-8" />
            </div>
          {/if}

          {#if option.label || option.description}
            <div class="flex flex-col gap-1">
              {#if option.label}
                <div class="font-semibold">{option.label}</div>
              {/if}

              {#if option.description}
                <div class="text-xs text-muted-foreground/70">{option.description}</div>
              {/if}
            </div>
          {/if}

          {#if option.value === internalValue}
            <div
              class="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-primary"
              in:scale={{ duration: 200, start: 0.7, delay: 100 }}>
              <Check class="w-3.5 text-primary-foreground" />
            </div>
          {/if}
        </Label>
      </slot>
    {/each}
  </RadioGroup.Root>
</div>
