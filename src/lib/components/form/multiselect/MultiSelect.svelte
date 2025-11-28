<script lang="ts" context="module">
  export type MultiselectFetchFunction = (query: Partial<MinimalFilterQuery>) => Promise<Array<ExtendedOption>>
  export type MultiselectAlignContent = 'start' | 'end' | 'center'

  export type MultiselectDefaultValues = {
    align: MultiselectAlignContent
    width: string
    contentWidth: string
    allowNewRecord: boolean
    allowCreate: boolean
    allowClear: boolean
    disabled: boolean
    showLabel: boolean
    readonly: boolean
    showErrorMessage: boolean
    showSelectedOptionLabel: boolean
  }

  export const MultiSelectDefaultValues: MultiselectDefaultValues = Object.freeze({
    align: 'end',
    width: 'w-[200px]',
    contentWidth: 'w-[200px]',
    allowNewRecord: false,
    allowCreate: false,
    allowClear: false,
    disabled: false,
    readonly: false,
    showLabel: true,
    showErrorMessage: true,
    showSelectedOptionLabel: true,
  })
</script>

<script lang="ts">
  import { browser } from '$app/environment'
  import DefaultMultiRenderer from '$components/form/multiselect/DefaultMultiRenderer.svelte'
  import DefaultSingleRenderer from '$components/form/multiselect/DefaultSingleRenderer.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import * as Command from '$ds/components/ui/command'
  import * as Popover from '$ds/components/ui/popover/'
  import { cn } from '$ds/utils'
  import { joinClassnames } from '$utils/classnames'
  import { createQueryRequestObject, type MinimalFilterQuery } from '$utils/filters'
  import { getUserMessagingClasses } from '$utils/form'
  import type { ExtendedOption } from '$utils/generics'
  import Check from 'lucide-svelte/icons/check'
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down'
  import { createEventDispatcher, onMount, tick } from 'svelte'
  import { _ } from 'svelte-i18n'

  export let options: Array<ExtendedOption> = []
  export let placeholder: string = $_('Search Placeholder')
  export let multiselection: boolean = true
  export let multiselectionColored: boolean = true
  export let allowCreate: boolean = false
  export let allowClear: boolean = false
  export let allowNewRecord: boolean = false
  export let value: Array<ExtendedOption> = []
  export let triggerAutoWidth: boolean = false
  export let width: string = 'w-[200px]'
  export let contentWidth: string = width
  export let align: MultiselectAlignContent = 'end'
  export let addItemText: string = $_('Add Item')
  export let addItemInvalidText: string = $_('Cannot Add Item')
  export let emptyText: string = $_('No Results Found')
  export let newRecordText: string = $_('Create New Placeholder')
  export let shouldFilter: boolean = true
  export let disabled: boolean = false
  export let error: string | undefined = undefined
  export let warning: string | undefined = undefined
  export let itemRendererComponent: any | undefined = undefined
  export let selectedItemRendererComponent: any | undefined = undefined
  export let showSelectedOptionLabel: boolean = true
  export let onCreateNew: () => void = () => {}
  export let fetchFunction: MultiselectFetchFunction | undefined = undefined
  export let validateAddItem: (value: string) => boolean = () => true

  let open: boolean = false
  let internalValue: Array<ExtendedOption> = [...value]
  let inputValue: string = ''
  let timer: NodeJS.Timeout
  let mounted: boolean = false
  let fetching: boolean = false

  const dispatch = createEventDispatcher()
  const TIME_THRESHOLD = 300

  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }

  function onCreateNewRecord(triggerId: string) {
    onCreateNew()
    closeAndFocusTrigger(triggerId)
  }

  function addItem(nextValue: ExtendedOption) {
    if (internalValue.find(option => option.value === nextValue.value)) return

    internalValue.push(nextValue)
    internalValue = internalValue

    value = internalValue
    dispatch('change', value)
  }

  function setItem(nextValue: ExtendedOption) {
    internalValue = [nextValue]
    value = internalValue
    dispatch('change', value)
  }

  function removeItem(nextValue: ExtendedOption, event: MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    internalValue = internalValue.filter(item => item.value !== nextValue.value)

    value = internalValue
    dispatch('change', value)
  }

  function onClear(triggerId: string) {
    internalValue = []
    value = internalValue
    dispatch('change', value)
    closeAndFocusTrigger(triggerId)
  }

  async function onItemSelect(nextValue: string, triggerId: string, isCreateAction: boolean = false) {
    const option = isCreateAction
      ? { label: nextValue, value: nextValue }
      : options.find(option => option.value === nextValue)
    if (!validateAddItem(nextValue)) return
    if (!option) return

    if (multiselection) addItem(option)
    else setItem(option)

    await tick()
    inputValue = ''

    if (!multiselection) closeAndFocusTrigger(triggerId)
  }

  async function fetchOptions(search?: string) {
    if (!fetchFunction) return

    fetching = true
    options = await fetchFunction(
      createQueryRequestObject({
        limit: 100,
        search,
      }),
    )
    fetching = false
  }

  function onSearchChange(search: string) {
    if (!mounted) return
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => fetchOptions(search), TIME_THRESHOLD)
  }

  function loadValue(v: Array<ExtendedOption>) {
    internalValue = [...v]
  }

  onMount(() => {
    mounted = true
    // fetchOptions()
  })

  $: selectedValues = internalValue.map(item => item.value)
  $: availableOptions = shouldFilter ? options.filter(option => !selectedValues.includes(option.value)) : options
  $: filteredResults = shouldFilter
    ? availableOptions.filter(option => option.label.toLowerCase().includes(inputValue.toLowerCase()))
    : availableOptions
  $: hasPerfectMatch = !!filteredResults.find(option => option.label?.toLowerCase() === inputValue?.toLowerCase())
  $: validInput = inputValue?.length && validateAddItem(inputValue)
  $: loadValue(value)
  $: classes = joinClassnames(
    $$restProps.class || '',
    width,
    getUserMessagingClasses(error, warning),
    triggerAutoWidth ? '!w-full' : '',
  )

  $: if (open) fetchOptions()
  $: if (!shouldFilter) onSearchChange(inputValue)
</script>

{#if browser}
  <Popover.Root bind:open let:ids>
    <Popover.Trigger asChild let:builder>
      <Button
        {disabled}
        builders={[builder]}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-label={placeholder}
        class="h-auto  min-h-9 justify-between py-1.5 {classes}">
        {#if selectedItemRendererComponent}
          <svelte:component this={selectedItemRendererComponent} items={internalValue} {placeholder} />
        {:else if multiselection}
          <DefaultMultiRenderer items={internalValue} colored={multiselectionColored} {removeItem} {placeholder} />
        {:else}
          <DefaultSingleRenderer items={internalValue} {removeItem} {placeholder} />
        {/if}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </Popover.Trigger>

    <Popover.Content class="{contentWidth} relative p-0" {align}>
      <Command.Root shouldFilter={false}>
        <Command.Input {placeholder} bind:value={inputValue} />

        {#if allowClear && internalValue.length && inputValue?.trim().length === 0}
          <Command.Group>
            <Command.Item
              class="flex-col items-start aria-selected:bg-error/20"
              value="remove-{internalValue?.[0]?.value || 'dummy-id'}"
              onSelect={() => onClear(ids.trigger)}>
              <div class="flex items-center justify-start">
                <IcoNoir.X class="{IconSize.Small} mr-2" />
                {$_('Remove Selection')}
              </div>

              {#if showSelectedOptionLabel}
                <div
                  class="text-sm text-muted-foreground"
                  class:text-xs={(internalValue?.[0]?.label || '').length > 30}>
                  {internalValue?.[0]?.label || ''}
                </div>
              {/if}
            </Command.Item>
          </Command.Group>
        {/if}

        {#if allowNewRecord && inputValue?.trim().length === 0}
          <Command.Group>
            <Command.Item
              class="flex-col items-start aria-selected:bg-info/30"
              onSelect={() => onCreateNewRecord(ids.trigger)}>
              <div class="flex items-center justify-start">
                <IcoNoir.Plus class="{IconSize.Small} mr-2" />
                {newRecordText}
              </div>
            </Command.Item>
          </Command.Group>
          <Command.Separator />
        {/if}

        {#if filteredResults.length === 0 && fetching}
          <Command.Group class="max-h-64 overflow-y-auto">
            <div class="flex animate-pulse flex-col gap-1">
              <div class="h-8 rounded-md bg-muted"></div>
              <div class="h-8 w-3/4 rounded-md bg-muted"></div>
              <div class="h-8 w-2/4 rounded-md bg-muted"></div>
              <div class="h-8 rounded-md bg-muted"></div>
              <div class="h-8 w-3/4 rounded-md bg-muted"></div>
              <div class="h-8 rounded-md bg-muted"></div>
              <div class="h-8 w-3/4 rounded-md bg-muted"></div>
              <div class="h-8 w-2/4 rounded-md bg-muted"></div>
            </div>
          </Command.Group>
        {:else}
          <Command.Empty>
            <div class="px-2">{emptyText}</div>
          </Command.Empty>
        {/if}

        <Command.Group class="max-h-64 overflow-y-auto">
          {#each filteredResults as option}
            <Command.Item value={option.value} onSelect={v => onItemSelect(v, ids.trigger)}>
              {#if itemRendererComponent}
                <svelte:component this={itemRendererComponent} {option} />
              {:else}
                <Check class={cn('mr-2 h-4 w-4', option.value !== internalValue[0]?.value && 'text-transparent')} />
                {option.label}
              {/if}
            </Command.Item>
          {/each}
        </Command.Group>

        {#if allowCreate && !hasPerfectMatch && inputValue?.trim().length > 0}
          <Command.Group
            heading={validInput ? addItemText : addItemInvalidText}
            class={validInput ? '' : '[&_[data-cmdk-group-heading]]:text-destructive'}>
            <Command.Item
              value={inputValue}
              aria-invalid={!validInput}
              class={validInput ? '' : 'bg-destructive/20 text-destructive'}
              onSelect={v => onItemSelect(v, ids.trigger, true)}>
              {#if validInput}
                <IcoNoir.Plus class="{IconSize.Small} mr-2" />
              {:else}
                <IcoNoir.X class="{IconSize.Small} mr-2" />
              {/if}
              {inputValue}
            </Command.Item>
          </Command.Group>
        {/if}
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
{:else}
  <div class="flex">
    <div class="mt-1 h-9 {width} flex-wrap rounded-md bg-secondary" />
  </div>
{/if}
