<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/sales-client-side'
  import type { GenericAttr, SalesChannelSummary } from '$api/sales'
  import { DefaultApi, SalesChannelSummaryStatusEnum } from '$api/sales'
  import { browser } from '$app/environment'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import ReadOnlyMultiselect from '$components/form/multiselect/ReadOnlyMultiselect.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import { DefaultSalesChannel } from '$fixtures/channels'
  import { type MinimalFilterQuery } from '$utils/filters'
  import type { ExtendedOption } from '$utils/generics'
  import { onMount } from 'svelte'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let attr: GenericAttr | undefined = undefined
  export let salesChannelId: string | undefined = undefined
  export let label: string = $_('Sales Channel')
  export let placeholder: string | undefined = $_('Select Sales Channel Placeholder')
  export let name: string = 'salesChannelId'
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
  export let fetchFunction: ((query: MinimalFilterQuery) => Promise<SalesChannelSummary[]>) | undefined = undefined
  export let onChoose: (item: SalesChannelSummary) => void = () => {}
  export let onChange: (item: ExtendedOption | undefined) => void = () => {}

  let itemsList: Array<SalesChannelSummary> = []
  let fetching: boolean = false
  let shouldDisplay: boolean = false

  const salesApi = new DefaultApi(createClientApiConfig())

  function onSelectionChange({ detail }: CustomEvent<Array<ExtendedOption>>) {
    const [item] = detail

    onChange(item)

    if (!item) {
      if (!formAPI) return

      return formAPI.updateField(name, undefined)
    }

    const hit = itemsList.find(m => m.id === item.value)
    onChoose(hit as SalesChannelSummary)

    if (!formAPI) return

    formAPI.updateField(name, item.value)
    if (errorMessage) formAPI.validateField(name)
  }

  async function fetchItems(query: MinimalFilterQuery): Promise<SalesChannelSummary[]> {
    if (fetchFunction) return fetchFunction(query)
    if (itemsList.length > 0 && !query.search) return itemsList

    const salesChannels = await salesApi.listSalesChannels(query)

    return [
      DefaultSalesChannel,
      ...salesChannels.filter(channel => channel.status === SalesChannelSummaryStatusEnum.Active),
    ].filter(option =>
      query.search?.trim() !== '' ? option.name?.toLowerCase().includes(query.search?.toLowerCase() || '') : true,
    )
  }

  async function defaultFetchFunction(query: MinimalFilterQuery): Promise<ExtendedOption[]> {
    itemsList = await fetchItems(query)

    return itemsList.map((channel: SalesChannelSummary) => ({
      label: getOptionLabel(channel.name as string),
      value: channel.id as string,
      attr: channel as any,
    }))
  }

  function getOptionLabel(label: string): string {
    return showLabel ? label : `${$_('Sales Channel')}: ${label}`
  }

  onMount(async () => {
    if (readonly) return

    fetching = true
    await defaultFetchFunction({ limit: 50 })
    const channelId = formAPI?.form?.[name] || salesChannelId

    if (!attr && channelId) {
      const internalChannelId = channelId === '' ? DefaultSalesChannel.id : channelId
      const selectedChannel = itemsList.find(channel => channel.id === internalChannelId)

      if (selectedChannel) {
        selectedValue = {
          label: getOptionLabel(selectedChannel.name as string),
          value: selectedChannel.id as string,
        }
      }
    }
    fetching = false
    shouldDisplay = itemsList.length > 1
  })

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error
  $: selectedValue = {
    label: getOptionLabel(DefaultSalesChannel.name as string),
    value: DefaultSalesChannel.id as string,
  }
</script>

{#if readonly}
  <ReadOnlyMultiselect class="{$$restProps.class || ''} {width}" {attr} {label} {placeholder} {name} {id} {showLabel} />
{:else if browser && shouldDisplay && !fetching}
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
          fetchFunction={defaultFetchFunction}
          value={selectedValue ? [selectedValue] : []}
          error={errorMessage}
          options={[]}
          emptyText={$_('No Sales Channels Found')}
          class="w-full {$$restProps.class || ''}"
          multiselection={false}
          shouldFilter={false}
          allowClear={false}
          triggerAutoWidth
          on:change={onSelectionChange}
          on:change />
      </div>
    </FormFieldMessages>
  </div>
{/if}
