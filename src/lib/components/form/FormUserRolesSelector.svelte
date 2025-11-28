<script lang="ts">
  import { browser } from '$app/environment'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import MultiSelect, { type MultiselectFetchFunction } from '$components/form/multiselect/MultiSelect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import type { MinimalFilterQuery } from '$utils/filters'
  import type { BasicOption, ExtendedOption } from '$utils/generics'
  import { getRoleLabel } from '$utils/i18n'
  import { Role } from '$utils/permissions'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let fetchFunction: MultiselectFetchFunction | undefined = undefined
  export let label: string = $_('Roles')
  export let placeholder: string | undefined = $_('Select Roles Placeholder')
  export let name: string = 'roles'
  export let id: string = name
  export let value: Array<string> = []
  export let error: string | undefined = ''
  export let warning: string | undefined = ''
  export let warningPosition: FormFieldMessagePosition | undefined = undefined
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let width: string = FormFieldClass.MinWidth
  export let contentWidth: string = width

  async function defaultFetchFunction(query: Partial<MinimalFilterQuery>): Promise<Array<ExtendedOption>> {
    return [roleToRoleOption('admin'), ...toBasicOptionFormat(Object.keys(Role))]
  }

  function onRolesChange({ detail }: CustomEvent<Array<BasicOption>>) {
    if (!formAPI) return

    formAPI.updateField(
      name,
      detail.map(option => option.value),
    )
  }

  function toBasicOptionFormat(rolesArray: Array<string>): Array<BasicOption> {
    if (!rolesArray) return []

    return rolesArray.map(role => roleToRoleOption(role)) || []
  }

  function roleToRoleOption(role: string): BasicOption {
    return { label: $_(getRoleLabel(role)), value: role }
  }

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error
  $: selectedValues = toBasicOptionFormat(formAPI?.form[name] || value)
  $: actualFetchFunction = fetchFunction || defaultFetchFunction
</script>

{#if browser}
  <div>
    <Label for={name} id="label-{id}" class={showLabel ? '' : 'sr-only'}>{label}</Label>
    <FormFieldMessages {id} {warning} {showErrorMessage} {warningPosition} error={errorMessage} let:aria>
      <MultiSelect
        {placeholder}
        {width}
        {contentWidth}
        fetchFunction={actualFetchFunction}
        value={selectedValues}
        options={[]}
        multiselection
        emptyText={$_('Empty Roles Prompt')}
        on:change={onRolesChange}
        on:change />
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} />
{/if}
