<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/iam-client-side'
  import { UsersApi, type UserAttr, type UserSummary } from '$api/iam'
  import { browser } from '$app/environment'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import ReadOnlyMultiselect from '$components/form/multiselect/ReadOnlyMultiselect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import {
    onPageMessage,
    type SetObserverFunction,
    type UnregisterFunction,
  } from '$components/utils/PageMessageQueue.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import { PageMessage, type PageMessageInterface } from '$fixtures/page-messages'
  import { UserType } from '$fixtures/user'
  import { type MinimalFilterQuery } from '$utils/filters'
  import type { ExtendedOption } from '$utils/generics'
  import { upsertUserRoute } from '$utils/routes'
  import { wait } from '$utils/wait'
  import { onDestroy, onMount } from 'svelte'
  import { _ } from 'svelte-i18n'
  import { FormFieldClass } from './form'
  import FormFieldMessages from './FormFieldMessages.svelte'

  export let formAPI: any = null
  export let attr: UserAttr | undefined = undefined
  export let label: string = $_('Agent')
  export let placeholder: string | undefined = $_('Select Agent Placeholder')
  export let name: string = 'agent'
  export let id: string = name
  export let error: string | undefined = ''
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let width: string = FormFieldClass.SelectorDefaultWidth
  export let contentWidth: string = width
  export let readonly: boolean = false
  export let allowNewRecord: boolean = false
  export let allowClear: boolean = false
  export let fetchFunction: ((query: MinimalFilterQuery) => Promise<Array<UserSummary>>) | undefined = undefined
  export let onChoose: (item: UserSummary) => void = () => {}
  export let onChange: (item: ExtendedOption | undefined) => void = () => {}
  export let onClear: () => void = () => {}

  let list: Array<UserSummary> = []
  let attentionSeeker = false

  let setPageMessageObserver: SetObserverFunction | undefined = undefined
  let unregisterPageMessage: UnregisterFunction | undefined = undefined

  const usersApi = new UsersApi(createClientApiConfig())

  function onCreateNewRecord() {
    if (!browser) return

    const proxy = window.open(upsertUserRoute(), '_blank')
    setPageMessageObserver?.(proxy)
  }

  async function afterCreateNewRecord(event: MessageEvent<PageMessageInterface>) {
    if (!browser) return

    const nextRecord: UserSummary = event.data.payload as UserSummary

    if (nextRecord?.id) {
      selectedValue = { label: nextRecord.fullName, value: nextRecord.id }

      onChoose(nextRecord)
      updateFormValue(nextRecord)
      attentionSeeker = true
      await wait(3000)
      attentionSeeker = false
    }
  }

  function updateFormValue(user: UserSummary | undefined) {
    if (!formAPI) return

    if (!user) {
      formAPI.updateField(name, undefined)
      return
    }

    const userAttr: UserAttr = {
      id: user.id as string,
      username: user.username,
      fullName: user.fullName,
    }
    formAPI.updateField(name, userAttr)

    if (errorMessage) formAPI.validateField(name)
  }

  function onItemChange({ detail }: CustomEvent<Array<ExtendedOption>>) {
    const [item] = detail

    onChange(item)

    if (!item) {
      onClear()
      updateFormValue(undefined)
      return
    }

    const hit = list.find(s => s.id === item.value)
    onChoose(hit as UserSummary)
    updateFormValue(hit as UserSummary)
  }

  async function fetchData(query: MinimalFilterQuery) {
    if (fetchFunction) return fetchFunction(query)

    return usersApi.listUsers({
      role: UserType.Agent,
    })
  }

  async function defaultFetchFunction(query: MinimalFilterQuery) {
    list = await fetchData(query)

    return list.map((user: UserSummary) => ({
      label: user.fullName,
      value: user.id as string,
    }))
  }

  onMount(() => {
    const { unregister, setObserver } = onPageMessage(PageMessage.SupplierCreated, afterCreateNewRecord)

    setPageMessageObserver = setObserver
    unregisterPageMessage = unregister
  })

  onDestroy(() => unregisterPageMessage?.())

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error
  $: selectedValue = attr ? { label: attr.fullName, value: attr.id as string } : undefined
</script>

{#if readonly}
  <ReadOnlyMultiselect {attr} width={FormFieldClass.MinWidth} {label} {placeholder} {name} {id} {showLabel} />
{:else if browser}
  <div>
    <Label for={name} id="label-{id}" class={showLabel ? '' : 'sr-only'}>{label}</Label>
    <FormFieldMessages {id} error={errorMessage} {showErrorMessage}>
      <MultiSelect
        {placeholder}
        {width}
        {contentWidth}
        {allowNewRecord}
        {allowClear}
        fetchFunction={defaultFetchFunction}
        value={selectedValue ? [selectedValue] : []}
        error={errorMessage}
        options={[]}
        emptyText={$_('No Agents Found')}
        newRecordText={$_('Add New Agent')}
        class="w-full {attentionSeeker ? 'attention-seeker shadow-border' : ''}"
        multiselection={false}
        shouldFilter={false}
        onCreateNew={onCreateNewRecord}
        on:change={onItemChange}
        on:change />
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} />
{/if}
