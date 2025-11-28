<script lang="ts">
  import type { ProductionItem, ProductionPlanMonthlyAvailability } from '$api/product'
  import { FormFieldClass } from '$components/form/form'
  import FormNumericField from '$components/form/FormNumericField.svelte'
  import { renderMonthYear } from '$utils/dates'
  import dayjs from 'dayjs'
  import { _ } from 'svelte-i18n'
  import type { FormUtilAPI } from './FormUtil.svelte'

  export let formAPI: FormUtilAPI | null = null
  export let name: string = 'monthlyAvailabilities'
  export let productionItems: Array<ProductionItem> = []
  export let defaultMonthlyAvailability: number = 1000
  export let key: string = ''
  export let onChange: (segments: Array<ProductionPlanMonthlyAvailability>) => void = () => {}

  type InternalProductionPlanMonthlyAvailability = ProductionPlanMonthlyAvailability & {
    date: Date
  }

  let internalMonthsSegments: Array<InternalProductionPlanMonthlyAvailability> = []

  function getCoveredMonthsNumber(start: Date, end: Date): number {
    let months = (end.getFullYear() - start.getFullYear()) * 12
    months += end.getMonth() - start.getMonth()
    return months + 1
  }

  function calculateAvailabilitySegments(
    items: Array<ProductionItem>,
    monthlyAvailabilityDefault: number,
  ): Array<InternalProductionPlanMonthlyAvailability> {
    if (!items || items.length === 0) return []

    const earliestStart = new Date(Math.min(...items.map(item => item.startsAt.getTime())))
    const latestEnd = new Date(Math.max(...items.map(item => item.endsAt.getTime())))
    const segments: Array<InternalProductionPlanMonthlyAvailability> = []
    const monthsCount = getCoveredMonthsNumber(earliestStart, latestEnd)

    for (let j: number = 0; j < monthsCount; j++) {
      const date = dayjs(earliestStart).add(j, 'month')
      segments.push({
        date: date.toDate(),
        month: date.month() + 1,
        year: date.year(),
        availability: monthlyAvailabilityDefault,
      })
    }

    return segments
  }

  function onHoursChange(segment: InternalProductionPlanMonthlyAvailability, value: number) {
    segment.availability = value

    triggerChange()
  }

  function triggerChange() {
    const nextValue = internalMonthsSegments.map(({ availability, month, year }) => ({ availability, month, year }))
    onChange(nextValue)

    if (!formAPI) return

    formAPI?.updateField(name, nextValue)
  }

  function onFieldInput(value: number, target: HTMLInputElement) {
    if (!target) return

    target.value = value.toString()
  }

  function loadValues(key: string) {
    const calculatedSegments = calculateAvailabilitySegments(productionItems || [], defaultMonthlyAvailability)
    const savedSegments = (formAPI?.form[name] as Array<ProductionPlanMonthlyAvailability>) || []

    if (savedSegments.length > 0) {
      calculatedSegments.forEach(segment => {
        const existingSegment = savedSegments.find(s => s.month === segment.month && s.year === segment.year)
        if (existingSegment) segment.availability = existingSegment.availability
      })
    }

    internalMonthsSegments = calculatedSegments
    triggerChange()
  }

  $: loadValues(key)
</script>

<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-1">
  {#each internalMonthsSegments as segment, index}
    <div class="capitalize">
      <div class={FormFieldClass.MaxWidth}>
        <FormNumericField
          name="monthlyAvailability-{index}"
          value={segment.availability.toString()}
          label={renderMonthYear(segment.date)}
          rightLabel={$_('Hours')}
          onChange={value => onHoursChange(segment, value)}
          onInput={onFieldInput} />
      </div>
    </div>
  {/each}
</div>
