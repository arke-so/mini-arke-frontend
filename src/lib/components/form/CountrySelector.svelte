<script lang="ts">
  import SelectField from '$components/form/SelectField.svelte'
  import { DEFAULT_COUNTRY } from '$fixtures/constants'
  import { countries } from '$fixtures/countries'
  import type { BasicOption } from '$utils/generics'
  import type { Selected } from 'bits-ui'
  import { _ } from 'svelte-i18n'
  import type { FormUtilAPI } from './FormUtil.svelte'

  export let formAPI: FormUtilAPI | undefined = undefined
  export let name: string = 'country'
  export let value: string = DEFAULT_COUNTRY
  export let label: string = $_('Country')
  export let error: string | undefined = undefined
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let onChange: (value: BasicOption) => void = () => {}

  function onSelectedChange(selected: Selected<unknown> | undefined) {
    const nextValue = selected?.value

    value = nextValue as string
    formAPI?.updateField(name, nextValue)
    onChange(selected as unknown as BasicOption)
  }

  $: selectedValue = formAPI?.form?.[name] || value
</script>

<SelectField
  {name}
  {label}
  {error}
  {showLabel}
  {showErrorMessage}
  class="min-w-44 {$$restProps.class || ''}"
  items={countries}
  value={selectedValue}
  small
  {onSelectedChange} />
