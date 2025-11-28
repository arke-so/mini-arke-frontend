<script lang="ts">
  import KeyValueEditor from '$components/form/KeyValueEditor.svelte'
  import type { BasicOption, KeyValueObject } from '$utils/generics'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let name: string = 'headers'
  export let value: { [key: string]: string } = {}
  export let error: string | undefined = undefined

  function onChange({ detail }: CustomEvent<Array<BasicOption>>) {
    if (!formAPI) return

    const value = detail.reduce<KeyValueObject<string>>((acc, { label, value }) => {
      acc[label] = value
      return acc
    }, {})

    formAPI.updateField(name, value)
  }

  function loadValues(valuesMap: { [key: string]: string }): Array<BasicOption> {
    return Object.entries(valuesMap || {}).map(([label, value]) => ({ label, value }))
  }

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error
  $: items = loadValues(formAPI?.form[name] || value)
</script>

<KeyValueEditor
  {items}
  error={errorMessage}
  showLabel={false}
  blockLabel={$_('Headers')}
  keyLabel={$_('Header Name')}
  valueLabel={$_('Header Value')}
  addItemLabel={$_('Add Header')}
  on:change={onChange}
  on:change />
