<script lang="ts">
  import { IcoNoir } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import Calendar from '$ds/components/ui/calendar/calendar.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import * as Popover from '$ds/components/ui/popover'
  import { joinClassnames } from '$utils/classnames'
  import { DEFAULT_LOCALE } from '$utils/dates'
  import { getUserMessagingClasses } from '$utils/form'
  import { CalendarDate, DateFormatter, getLocalTimeZone, today, type DateValue } from '@internationalized/date'
  import { createEventDispatcher } from 'svelte'
  import { _, locale } from 'svelte-i18n'
  import { FormFieldClass } from './form'
  import FormFieldMessages from './FormFieldMessages.svelte'

  export let formAPI: any = null
  export let label: string
  export let placeholder: string | undefined = $_('Select Date Placeholder')
  export let name: string
  export let id: string = name
  export let value: Date | undefined = undefined
  export let showLabel: boolean = true
  export let autoWidth: boolean = false
  export let showErrorMessage: boolean = true
  export let minDaysFromNow: number = 0
  export let disabled: boolean = false
  export let allowClear: boolean = false
  export let onChange: (date: Date, dateValue: DateValue) => void = () => {}

  const dispatch = createEventDispatcher()
  const df = new DateFormatter($locale || DEFAULT_LOCALE, { year: 'numeric', month: 'short', day: 'numeric' })
  const calendarMin = today(getLocalTimeZone()).add({ days: minDaysFromNow })

  let internalValue: DateValue | undefined = undefined
  let open = false

  function onValueChange(dateValue: DateValue | undefined) {
    if (!dateValue) return

    open = false
    const date = dateValue.toDate(getLocalTimeZone())
    internalValue = dateValue
    dispatch('change', { date, dateValue })
    onChange(date, dateValue)

    if (!formAPI) return
    formAPI.updateField(name, date)
    if (error) formAPI.validateField(name)
  }

  function clearValue() {
    internalValue = undefined
    dispatch('change', { date: undefined, dateValue: undefined })
    open = false

    if (!formAPI) return
    formAPI.updateField(name, null)
    if (error) formAPI.validateField(name)
  }

  function loadValue(v: string | undefined) {
    if (!v) {
      internalValue = undefined
      return
    }

    const date = new Date(v)
    internalValue = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
  }

  $: loadValue(formAPI?.form[name] || value)
  $: error = formAPI?.errors[name] && typeof formAPI?.errors[name] === 'string' ? formAPI?.errors[name] : undefined
  $: classes = joinClassnames(
    FormFieldClass.MinWidth,
    'justify-start text-left font-normal',
    getUserMessagingClasses(error),
    $$restProps.class || '',
  )
</script>

<div class:flex-1={autoWidth}>
  <Label for={name} id="label-{id}" class="mb-2 block {showLabel ? '' : 'sr-only'}">{label}</Label>
  <FormFieldMessages {id} {error} {showErrorMessage}>
    <Popover.Root bind:open>
      <Popover.Trigger asChild let:builder>
        <Button variant="outline" class={classes} builders={[builder]} {disabled}>
          <IcoNoir.Calendar class="mr-2 h-4 w-4" />
          {internalValue ? df.format(internalValue.toDate(getLocalTimeZone())) : placeholder}
        </Button>
      </Popover.Trigger>
      <Popover.Content align="end" class="w-auto p-0">
        <Calendar
          locale={$locale || DEFAULT_LOCALE}
          minValue={calendarMin}
          {onValueChange}
          value={internalValue}
          initialFocus />
        {#if allowClear && internalValue}
          <Button
            variant="outline"
            size="sm"
            class="m-3 flex h-8 items-center text-xs"
            on:click={clearValue}
            {disabled}>
            <IcoNoir.X class="mr-1 h-3 w-3" />
            {$_('Clear Date')}
          </Button>
        {/if}
      </Popover.Content>
    </Popover.Root>
  </FormFieldMessages>
</div>
