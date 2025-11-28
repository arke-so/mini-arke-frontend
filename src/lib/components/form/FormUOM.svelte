<script lang="ts">
  import type { FormFieldMessagePosition } from '$components/form/form'
  import SelectField from '$components/form/SelectField.svelte'
  import AlertMessage from '$components/utils/AlertMessage.svelte'
  import { UnitOfMeasures } from '$fixtures/uom'
  import type { BasicOption } from '$utils/generics'
  import { getAggregateUnitOfMeasureOptions, getUnitOfMeasureOptions } from '$utils/uom'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let label: string = $_('UOM')
  export let showLabel: boolean = true
  export let name: string = 'uom'
  export let value: string = UnitOfMeasures.Unset
  export let isAggregateUOM: boolean = false
  export let disabled: boolean = false
  export let errorPosition: FormFieldMessagePosition | undefined = undefined
  export let warningPosition: FormFieldMessagePosition | undefined = undefined
  export let onChange: ((detail: { value: string; selected: BasicOption }) => void) | undefined = undefined
  export let showUomWarning: boolean = false

  const UNSET_OPTION = {
    label: $_('Unset UOM'),
    value: UnitOfMeasures.Unset,
  }
  const uomOptions = isAggregateUOM ? getAggregateUnitOfMeasureOptions() : getUnitOfMeasureOptions()
  const items = [UNSET_OPTION, ...uomOptions]

  function handleChange({ detail }: CustomEvent<{ value: string; selected: BasicOption }>) {
    value = detail.value

    if (onChange) onChange(detail)

    if (!formAPI) return
    formAPI.updateField(name, value)
  }

  $: selectedValue = formAPI?.form[name] || value
  $: errorMessage = formAPI?.errors[name]
</script>

<SelectField
  {name}
  {label}
  {showLabel}
  {items}
  {disabled}
  {errorPosition}
  {warningPosition}
  error={errorMessage}
  value={selectedValue}
  class="min-w-32 {$$restProps.class || ''}"
  small
  on:change={handleChange} />

{#if !disabled && showUomWarning}
  <AlertMessage title={$_('UOM Read Only After Save Warning Title')} variant="info" class="mt-2">
    {$_('UOM Read Only After Save Warning')}
  </AlertMessage>
{/if}
