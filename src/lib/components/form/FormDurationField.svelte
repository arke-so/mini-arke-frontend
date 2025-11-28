<script lang="ts">
  import { browser } from '$app/environment'
  import { Button } from '$ds/components/ui/button'
  import * as Command from '$ds/components/ui/command'
  import { Input } from '$ds/components/ui/input'
  import { Label } from '$ds/components/ui/label'
  import * as Popover from '$ds/components/ui/popover'
  import { DurationMode, humanDuration, secondsToTimeUnits, timeUnitsToSeconds } from '$utils/duration'
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down'
  import { _ } from 'svelte-i18n'
  import TextFieldRaw from './TextFieldRaw.svelte'

  export let formAPI: any = null
  export let name: string
  export let label: string
  export let value: number | string = 0
  export let placeholder: string = ''
  export let id: string = name
  export let error: string | undefined = undefined
  export let disabled: boolean = false
  export let focus: boolean = false
  export let onChange: (value: number) => void = () => {}

  const durationModes: {
    i18n: string
    value: DurationMode
  }[] = [
    { i18n: 'Seconds', value: DurationMode.Seconds },
    { i18n: 'Minutes', value: DurationMode.Minutes },
    { i18n: 'Hours', value: DurationMode.Hours },
    { i18n: 'Extended', value: DurationMode.Extended },
  ]

  let days = 0
  let hours = 0
  let minutes = 0
  let seconds = 0
  let openPopover = false
  let openModeSelector = false

  let inputValue = ''

  let selectedMode = DurationMode.Seconds
  let selectedModeLabel = 'Seconds'
  const localStorageKey = 'duration-mode'

  function initializeSelectedMode() {
    if (!browser) return

    const storedMode = localStorage.getItem(`${localStorageKey}`) as DurationMode
    if (storedMode && durationModes.some(mode => mode.value === storedMode)) {
      selectedMode = storedMode
      const modeObj = durationModes.find(m => m.value === storedMode)
      if (modeObj) {
        selectedModeLabel = modeObj.i18n
      }
    }
  }

  // Save selected mode to localStorage
  function saveSelectedMode(mode: string) {
    if (!browser) return

    localStorage.setItem(`${localStorageKey}`, mode)
    selectedMode = mode as DurationMode

    const modeObj = durationModes.find(m => m.value === mode)
    if (modeObj) selectedModeLabel = modeObj.i18n

    openModeSelector = false
    updateDisplayFromValue()
  }

  function updateDisplayFromValue() {
    if (value === undefined || value === null || value === '') {
      value = '0'
    }

    const secondsValue = typeof value === 'string' ? parseInt(value, 10) || 0 : value || 0

    const timeUnits = secondsToTimeUnits(secondsValue)
    days = timeUnits.days
    hours = timeUnits.hours
    minutes = timeUnits.minutes
    seconds = timeUnits.seconds

    switch (selectedMode) {
      case DurationMode.Seconds:
        inputValue = secondsValue.toString()
        break
      case DurationMode.Minutes:
        inputValue = (secondsValue / 60).toString()
        break
      case DurationMode.Hours:
        inputValue = (secondsValue / 3600).toString()
        break
    }
  }

  function updateValueFromInput() {
    if (!inputValue) {
      value = '0'

      if (formAPI) {
        formAPI.updateField(name, 0)
        if (error) formAPI.validateField(name)
      } else {
        onChange(0)
      }
      return
    }

    const numValue = parseFloat(inputValue)
    if (isNaN(numValue)) return

    let secondsValue = 0

    switch (selectedMode) {
      case DurationMode.Seconds:
        secondsValue = Math.floor(numValue)
        break
      case DurationMode.Minutes:
        secondsValue = Math.floor(numValue * 60)
        break
      case DurationMode.Hours:
        secondsValue = Math.floor(numValue * 3600)
        break
    }

    value = secondsValue.toString()

    if (formAPI) {
      formAPI.updateField(name, secondsValue)
      if (error) formAPI.validateField(name)
    } else {
      onChange(secondsValue)
    }
  }

  function updateValueFromExtended() {
    const secondsValue = timeUnitsToSeconds(days, hours, minutes, seconds)
    value = secondsValue.toString()

    if (formAPI) {
      formAPI.updateField(name, secondsValue)
      if (error) formAPI.validateField(name)
    } else {
      onChange(secondsValue)
    }

    openPopover = false
  }

  function formatDuration(secondsValue: string | number): string {
    const secondsCount = typeof secondsValue === 'string' ? parseInt(secondsValue, 10) || 0 : secondsValue || 0

    return humanDuration(secondsCount, { useConjunction: true })
  }

  function handleFocus(e: FocusEvent) {
    if (inputValue === '0') (e.target as HTMLInputElement)?.select()
  }

  function loadFormValue() {
    if (!formAPI) return
    const formValue = formAPI.form[name]

    if (formValue !== undefined) {
      value = formValue
    }
  }

  $: if (selectedMode === DurationMode.Extended) {
    updateDisplayFromValue()
  }

  initializeSelectedMode()
  $: if (formAPI) loadFormValue()
  $: updateDisplayFromValue()
</script>

<div class="flex items-center">
  {#if selectedMode !== DurationMode.Extended}
    <div class="w-full">
      <TextFieldRaw
        {id}
        {name}
        {label}
        showLabel={false}
        bind:value={inputValue}
        {disabled}
        {focus}
        type="number"
        min="0"
        rightLabel={$_(selectedModeLabel)}
        textAlign="right"
        on:input={() => updateValueFromInput()}
        on:focus={handleFocus}
        class="h-10 rounded-none border-none"
        placeholder={placeholder || $_('Duration Format', { values: { format: $_(selectedModeLabel) } })} />
    </div>
  {:else}
    <Popover.Root bind:open={openPopover}>
      <Popover.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          variant="outline"
          class="h-10 w-full justify-end rounded-none border-none px-3 pl-8 text-right font-normal"
          {disabled}>
          <span>{formatDuration(value) || 'Set duration'}</span>
        </Button>
      </Popover.Trigger>

      <Popover.Content class="w-80">
        <div class="grid gap-4">
          <div class="space-y-2">
            <h4 class="font-medium leading-none">{$_('Duration')}</h4>
            <p class="text-sm text-muted-foreground">{$_('Set the duration')}</p>
          </div>

          <div class="grid grid-cols-4 gap-2">
            <div class="flex flex-col space-y-1 text-center">
              <Label for={`${id}-days`}>{$_('Days')}</Label>
              <Input id={`${id}-days`} type="number" min="0" bind:value={days} class="h-8" />
            </div>

            <div class="flex flex-col space-y-1 text-center">
              <Label for={`${id}-hours`}>{$_('Hours')}</Label>
              <Input id={`${id}-hours`} type="number" min="0" max="23" bind:value={hours} class="h-8" />
            </div>

            <div class="flex flex-col space-y-1 text-center">
              <Label for={`${id}-minutes`}>{$_('Minutes')}</Label>
              <Input id={`${id}-minutes`} type="number" min="0" max="59" bind:value={minutes} class="h-8" />
            </div>

            <div class="flex flex-col space-y-1 text-center">
              <Label for={`${id}-seconds`}>{$_('Seconds')}</Label>
              <Input id={`${id}-seconds`} type="number" min="0" max="59" bind:value={seconds} class="h-8" />
            </div>
          </div>

          <Button on:click={() => updateValueFromExtended()}>{$_('Apply')}</Button>

          <div class="text-sm text-muted-foreground">
            <span class="text-muted-foreground/50">{$_('Total')}</span>
            {formatDuration(days * 86400 + hours * 3600 + minutes * 60 + seconds * 1)}
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>

    <input type="hidden" {name} {value} />
  {/if}

  <Popover.Root bind:open={openModeSelector}>
    <Popover.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="outline"
        {disabled}
        size="icon"
        aria-expanded={openModeSelector}
        aria-label={$_('Select Duration Mode')}
        class="h-10 min-h-9 divide-background rounded-none border-none">
        <ChevronsUpDown class="h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </Popover.Trigger>

    <Popover.Content class="p-0" align="end">
      <Command.Root shouldFilter={false}>
        <Command.Group>
          {#each durationModes as mode (mode.value)}
            <Command.Item
              class={mode.value === selectedMode ? 'bg-accent' : ''}
              onSelect={() => saveSelectedMode(mode.value)}>
              {$_(mode.i18n)}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</div>
