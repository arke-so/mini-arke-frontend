<script lang="ts">
  import { IcoNoir } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import Label from '$ds/components/ui/label/label.svelte'
  import * as Popover from '$ds/components/ui/popover'
  import { RangeCalendar } from '$ds/components/ui/range-calendar'
  import { joinClassnames } from '$utils/classnames'
  import { DEFAULT_LOCALE } from '$utils/dates'
  import { getUserMessagingClasses } from '$utils/form'
  import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
  import type { DateRange } from 'bits-ui'
  import { _, locale } from 'svelte-i18n'
  import { FormFieldClass } from './form'
  import FormFieldMessages from './FormFieldMessages.svelte'

  export let formAPI: any = null
  export let label: string
  export let placeholder: string | undefined = $_('Select Date Range Placeholder')
  export let name: string
  export let id: string = name
  export let value: { start: Date; end: Date } | undefined = undefined
  export let showLabel: boolean = true
  export let autoWidth: boolean = false
  export let showErrorMessage: boolean = true
  export let minDaysFromNow: number = 0
  export let disabled: boolean = false
  export let numberOfMonths: number = 2
  export let allowPastDates: boolean = false
  export let onChange: (dateRange: { start: Date; end: Date }, dateValueRange: DateRange) => void = () => {}

  const df = new DateFormatter($locale || DEFAULT_LOCALE, { year: 'numeric', month: 'short', day: 'numeric' })
  const calendarMin = allowPastDates ? undefined : today(getLocalTimeZone()).add({ days: minDaysFromNow })

  let internalValue: DateRange | undefined = undefined
  let open = false

  function onValueChange(dateRange: DateRange | undefined) {
    if (!dateRange || !dateRange.start || !dateRange.end) return

    open = false
    const startDate = dateRange.start.toDate(getLocalTimeZone())
    const endDate = dateRange.end.toDate(getLocalTimeZone())
    const rangeDates = { start: startDate, end: endDate }

    internalValue = dateRange
    onChange(rangeDates, dateRange)

    if (!formAPI) return
    formAPI.updateField(name, rangeDates)
    if (error) formAPI.validateField(name)
  }

  function loadValue(v: { start: Date; end: Date } | undefined) {
    if (!v || !v.start || !v.end) {
      internalValue = undefined
      return
    }

    const startDate = new Date(v.start)
    const endDate = new Date(v.end)
    internalValue = {
      start: new CalendarDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()),
      end: new CalendarDate(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()),
    }
  }

  function formatDateRange(dateRange: DateRange | undefined): string {
    if (!dateRange || !dateRange.start || !dateRange.end) return placeholder || ''

    const startFormatted = df.format(dateRange.start.toDate(getLocalTimeZone()))
    const endFormatted = df.format(dateRange.end.toDate(getLocalTimeZone()))
    return `${startFormatted} - ${endFormatted}`
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
          {formatDateRange(internalValue)}
        </Button>
      </Popover.Trigger>
      <Popover.Content align="end" class="w-auto p-0">
        <RangeCalendar
          locale={$locale || DEFAULT_LOCALE}
          minValue={calendarMin}
          {onValueChange}
          value={internalValue}
          initialFocus
          {numberOfMonths} />
      </Popover.Content>
    </Popover.Root>
  </FormFieldMessages>
</div>
