<script lang="ts">
  import { browser } from '$app/environment'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import MultiSelect, { type MultiselectFetchFunction } from '$components/form/multiselect/MultiSelect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import type { BasicOption } from '$utils/generics'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let fetchFunction: MultiselectFetchFunction | undefined = undefined
  export let label: string = ''
  export let placeholder: string | undefined = undefined
  export let name: string = ''
  export let id: string = name
  export let value: string = ''
  export let error: string | undefined = ''
  export let warning: string | undefined = ''
  export let warningPosition: FormFieldMessagePosition | undefined = undefined
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let width: string = FormFieldClass.MinWidth
  export let addItemText: string = $_('Add Item')
  export let addItemInvalidText: string = $_('Cannot Add Item')
  export let emptyText: string = $_('No items found')
  export let itemRendererComponent: any | undefined = undefined
  export let selectedItemRendererComponent: any | undefined = undefined

  function onChange({ detail }: CustomEvent<Array<BasicOption>>) {
    const [nextValue] = detail
    if (!formAPI) return

    formAPI.updateField(name, nextValue.value)
  }

  function validateAddItem(value: string) {
    return !!value && value.trim() !== ''
  }

  function toBasicOptionFormat(nextValue: string): Array<BasicOption> {
    return nextValue !== ''
      ? [
          {
            label: nextValue,
            value: nextValue,
          },
        ]
      : []
  }

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error
  $: selectedValues = toBasicOptionFormat(formAPI?.form[name] || value)
</script>

{#if browser}
  <div>
    <Label for={name} id="label-{id}" class={showLabel ? '' : 'sr-only'}>{label}</Label>
    <FormFieldMessages {id} {warning} {showErrorMessage} {warningPosition} error={errorMessage} let:aria>
      <MultiSelect
        {placeholder}
        {width}
        {validateAddItem}
        {fetchFunction}
        {warning}
        value={selectedValues}
        options={[]}
        allowCreate
        error={errorMessage}
        multiselection={false}
        {addItemText}
        {addItemInvalidText}
        {emptyText}
        {itemRendererComponent}
        {selectedItemRendererComponent}
        on:change={onChange}
        on:change />
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} />
{/if}
