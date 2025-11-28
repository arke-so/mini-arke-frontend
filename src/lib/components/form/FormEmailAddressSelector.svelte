<script lang="ts">
  import { browser } from '$app/environment'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import ReadOnlyMultiselect from '$components/form/multiselect/ReadOnlyMultiselect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import type { FilterQuery, MinimalFilterQuery } from '$utils/filters'
  import type { ExtendedOption } from '$utils/generics'
  import { isValidEmail } from '$utils/validation'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let attr: any | undefined = undefined
  export let label: string = $_('Email Address')
  export let placeholder: string | undefined = $_('Select Email Address')
  export let name: string = 'email'
  export let id: string = name
  export let error: string | undefined = ''
  export let warning: string | undefined = ''
  export let warningPosition: FormFieldMessagePosition | undefined = undefined
  export let align: 'start' | 'end' | 'center' = 'end'
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let width: string = FormFieldClass.SelectorDefaultWidth
  export let contentWidth: string = width
  export let fetchFunction: ((query: Partial<FilterQuery>) => Promise<ExtendedOption[]>) | undefined = undefined
  export let onChange: (items: ExtendedOption[]) => void = () => {}
  export let onClear: () => void = () => {}

  function onItemChange({ detail }: CustomEvent<Array<ExtendedOption>>) {
    onChange(detail)
    if (detail?.length === 0) onClear()

    if (!formAPI) return

    const value = detail.map(option => option.value)
    formAPI.updateField(name, value)
    if (errorMessage) formAPI.validateField(name)
  }

  function validateAddItem(value: string): boolean {
    return !!value && isValidEmail(value)
  }

  async function fetchItems(query: MinimalFilterQuery): Promise<ExtendedOption[]> {
    if (fetchFunction) return fetchFunction(query)

    return []
  }

  async function defaultFetchFunction(query: MinimalFilterQuery): Promise<ExtendedOption[]> {
    return await fetchItems(query)
  }

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error
  $: selectedValue = attr ? { label: attr.name, value: attr.id as string } : undefined
</script>

{#if readonly}
  <ReadOnlyMultiselect class={$$restProps.class || ''} {attr} {label} {placeholder} {name} {id} {showLabel} />
{:else if browser}
  <div>
    <Label for={name} id="label-{id}" class={showLabel ? '' : 'sr-only'}>{label}</Label>
    <FormFieldMessages {id} error={errorMessage} {warning} {showErrorMessage} {warningPosition}>
      <div>
        <MultiSelect
          {align}
          {placeholder}
          {width}
          {contentWidth}
          {disabled}
          {warning}
          {validateAddItem}
          fetchFunction={defaultFetchFunction}
          value={selectedValue ? [selectedValue] : []}
          error={errorMessage}
          options={[]}
          emptyText={$_('No Emails Found')}
          class="w-full {$$restProps.class || ''}"
          multiselection={true}
          shouldFilter={true}
          allowCreate
          on:change={onItemChange}
          on:change />
      </div>
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} />
{/if}
