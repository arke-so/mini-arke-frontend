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
  export let label: string = $_('Categories')
  export let placeholder: string | undefined = $_('Select Categories Placeholder')
  export let name: string = 'categories'
  export let id: string = name
  export let value: Array<string> = []
  export let error: string | undefined = ''
  export let warning: string | undefined = ''
  export let warningPosition: FormFieldMessagePosition | undefined = undefined
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let width: string = FormFieldClass.MinWidth
  export let contentWidth: string = width

  function onCategoriesChange({ detail }: CustomEvent<Array<BasicOption>>) {
    if (!formAPI) return

    formAPI.updateField(
      name,
      detail.map(option => option.value),
    )
  }

  function validateAddItem(value: string) {
    return /^[a-zA-Z0-9]+$/.test(value)
  }

  function toBasicOptionFormat(categoriesArray: Array<string>): Array<BasicOption> {
    if (!categoriesArray) return []

    return categoriesArray.map(cat => ({ label: cat, value: cat })) || []
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
        {contentWidth}
        {validateAddItem}
        {fetchFunction}
        value={selectedValues}
        options={[]}
        allowCreate
        multiselection
        addItemText={$_('Add Category Label')}
        addItemInvalidText={$_('Cannot Add Category Label')}
        emptyText={$_('Empty Categories Prompt')}
        on:change={onCategoriesChange}
        on:change />
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} />
{/if}
