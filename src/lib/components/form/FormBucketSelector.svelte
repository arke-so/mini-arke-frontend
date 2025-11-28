<script lang="ts">
  import SelectField from '$components/form/SelectField.svelte'
  import type { BasicOption } from '$utils/generics'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let label: string = $_('Bucket')
  export let showLabel: boolean = true
  export let name: string = 'bucket'
  export let value: string = 'in_stock'
  export let disabled: boolean = false
  export let items: Array<BasicOption> = []
  export let onChange: (value: string) => void = () => {}

  function onChangeHandler({ detail }: CustomEvent<{ value: string; selected: BasicOption }>) {
    value = detail.value

    onChange(value)
    if (!formAPI) return
    formAPI.updateField(name, value)

    if (errorMessage) formAPI.validateField(name)
  }

  function onLoad(val: string) {
    if (val) onChange(val)
  }

  $: errorMessage = formAPI?.errors[name]
  $: initialValue = formAPI?.form[name] || value
  $: onLoad(initialValue)
</script>

<SelectField
  {name}
  {label}
  {showLabel}
  {items}
  {disabled}
  value={initialValue}
  error={errorMessage}
  class="min-w-32 {$$restProps.class || ''}"
  small
  on:change={onChangeHandler} />
