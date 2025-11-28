<script lang="ts">
  import { browser } from '$app/environment'
  import BusyButton from '$components/form/BusyButton.svelte'
  import type { FormUtilAPI } from '$components/form/FormUtil.svelte'
  import { Button, type ButtonProps, type Variant } from '$ds/components/ui/button'
  import * as Command from '$ds/components/ui/command'
  import * as Popover from '$ds/components/ui/popover'
  import * as Tooltip from '$ds/components/ui/tooltip'
  import type { DomainType } from '$fixtures/domains'
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down'
  import { SvelteComponent } from 'svelte'

  type ButtonSwitcherOption = {
    label: string
    value: string
    isDestructive?: boolean
    icon?: typeof SvelteComponent<any>
    disabled?: boolean
    tooltip?: string
    tooltipOpenDelay?: number
  }

  export let formAPI: FormUtilAPI | undefined = undefined
  export let options: ButtonSwitcherOption[]
  export let busy: boolean = false
  export let context: DomainType | string | undefined = undefined
  export let triggerActionOnChange: boolean = true
  export let variant: Variant = 'default'
  export let size: ButtonProps['size'] = 'default'
  export let rounded: boolean = true
  export let onSelect: (value: string) => void = () => {}

  let open = false
  let selectedOption: ButtonSwitcherOption | undefined = undefined
  const localStorageKey = 'action-selection:'

  $: bootstrap(options)
  $: if (selectedOption === undefined && options?.length > 0) selectedOption = options[0]

  function bootstrap(options: ButtonSwitcherOption[]) {
    if (!browser) return

    let newSelectedOption = null

    if (context) {
      const storedValue = localStorage.getItem(`${localStorageKey}${context}`)
      if (storedValue) {
        newSelectedOption = options.find(option => option.value === storedValue)
      }
    }

    if (!newSelectedOption && options.length > 0) newSelectedOption = options[0]
    if (newSelectedOption && newSelectedOption !== selectedOption) selectedOption = newSelectedOption
    if (selectedOption) formAPI?.setPostSubmitOption(selectedOption.value)
  }

  function handleSelect(option: ButtonSwitcherOption, triggerOnSelect: boolean = true) {
    if (option.disabled) return
    selectedOption = option
    formAPI?.setPostSubmitOption(option.value)

    if (triggerOnSelect) onSelect(option.value)
    if (browser && context) localStorage.setItem(`${localStorageKey}${context}`, option.value)
    open = false
  }
</script>

<div class="flex items-center">
  {#if selectedOption?.tooltip}
    <Tooltip.Root openDelay={selectedOption?.tooltipOpenDelay || 200} disableHoverableContent>
      <Tooltip.Trigger asChild let:builder>
        <span use:builder.action {...builder} class="inline-flex">
          <BusyButton
            on:click={() => handleSelect(selectedOption ?? options[0], true)}
            {busy}
            {size}
            {variant}
            disabled={selectedOption?.disabled}
            role="combobox"
            aria-label={selectedOption.tooltip}
            class="{rounded ? '' : 'rounded-l-none'} {options.length > 1
              ? 'rounded-r-none'
              : ''} h-auto min-h-9 justify-between py-1.5">
            {#if selectedOption}
              <div class="flex items-center gap-2">
                {#if selectedOption.icon}
                  <svelte:component this={selectedOption.icon} class="h-4 w-4" />
                {/if}
                {selectedOption.label}
              </div>
            {/if}
          </BusyButton>
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>{selectedOption.tooltip}</p>
      </Tooltip.Content>
    </Tooltip.Root>
  {:else}
    <BusyButton
      on:click={() => handleSelect(selectedOption ?? options[0], true)}
      {busy}
      {size}
      {variant}
      disabled={selectedOption?.disabled}
      role="combobox"
      class="{rounded ? '' : 'rounded-l-none'} {options.length > 1
        ? 'rounded-r-none'
        : ''} h-auto min-h-9 justify-between py-1.5">
      {#if selectedOption}
        <div class="flex items-center gap-2">
          {#if selectedOption.icon}
            <svelte:component this={selectedOption.icon} class="h-4 w-4" />
          {/if}
          {selectedOption.label}
        </div>
      {/if}
    </BusyButton>
  {/if}

  {#if browser && options.length > 1}
    <Popover.Root bind:open>
      <Popover.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          {variant}
          disabled={busy}
          size="icon"
          role="combobox"
          aria-expanded={open}
          aria-label="Toggle menu"
          tabindex={-1}
          class="{rounded ? '' : 'rounded-r-none'} h-auto min-h-9 rounded-l-none border-l-0">
          <ChevronsUpDown class="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </Popover.Trigger>

      <Popover.Content class="p-0" align="end">
        <Command.Root shouldFilter={false}>
          <Command.Group>
            {#each options.filter(option => option !== selectedOption) as option (option.value)}
              <Command.Item
                class="{option?.isDestructive
                  ? 'aria-selected:bg-error/20 data-[highlighted]:bg-destructive/40'
                  : ''} {option.disabled ? 'opacity-50' : ''}"
                onSelect={() => handleSelect(option, triggerActionOnChange)}>
                <div class="flex items-center gap-2">
                  {#if option.icon}
                    <svelte:component this={option.icon} class="h-4 w-4" />
                  {/if}
                  {option.label}
                </div>
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
  {/if}
</div>
