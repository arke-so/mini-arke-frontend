<script lang="ts">
  import SelectField from '$components/form/SelectField.svelte'
  import { currencies as items } from '$fixtures/currencies'
  import type { BasicOption } from '$utils/generics'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let label: string = $_('Currency')
  export let showLabel: boolean = true
  export let name: string = 'currency'
  export let value: string = 'EUR'
  export let disabled: boolean = false

  function onChange({ detail }: CustomEvent<{ value: string; selected: BasicOption }>) {
    value = detail.value

    if (!formAPI) return
    formAPI.updateField(name, value)
  }
</script>

<SelectField
  {name}
  {label}
  {value}
  {showLabel}
  {items}
  {disabled}
  class="min-w-32 {$$restProps.class || ''}"
  small
  on:change={onChange} />
