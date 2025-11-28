<script lang="ts">
  import { browser } from '$app/environment'
  import { FormComponent } from '$components/custom-forms'
  import { FormFieldClass } from '$components/form/form'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import type { FilterQuery } from '$utils/filters'
  import type { BasicOption, ExtendedOption } from '$utils/generics'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let label: string = $_('Field Type')
  export let placeholder: string | undefined = $_('Select Field Type Placeholder')
  export let name: string = 'type'
  export let id: string = name
  export let error: string | undefined = ''
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let width: string = FormFieldClass.SelectorDefaultWidth
  export let contentWidth: string = width

  let fieldTypeItems: Array<BasicOption> = Object.values(FormComponent).map(({ id, label }) => ({
    label: $_(label),
    value: id,
  }))

  const dispatch = createEventDispatcher()

  function onFieldChange({ detail }: CustomEvent<Array<ExtendedOption>>) {
    const [field] = detail

    if (!field) return
    if (!formAPI) return

    dispatch('choose', field)
    formAPI.updateField(name, field.value)
    if (errorMessage) formAPI.validateField(name)
  }

  async function fetchFunction({ search }: Partial<FilterQuery>) {
    return search
      ? fieldTypeItems.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
      : fieldTypeItems
  }

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error
  $: selectedValue = formAPI?.form[name] ? fieldTypeItems.find(it => it.value === formAPI?.form[name]) : undefined
</script>

{#if browser}
  <div>
    <Label for={name} id="label-{id}" class={showLabel ? '' : 'sr-only'}>{label}</Label>
    <FormFieldMessages {id} error={errorMessage} {showErrorMessage}>
      <MultiSelect
        {placeholder}
        {width}
        {contentWidth}
        {fetchFunction}
        value={selectedValue ? [selectedValue] : []}
        error={errorMessage}
        options={[]}
        emptyText={$_('No Fields Found')}
        class="w-full"
        multiselection={false}
        shouldFilter={false}
        on:change={onFieldChange}
        on:change />
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} />
{/if}
