<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/supply-client-side'
  import { ListRawMaterialsModeEnum, RawMaterialsApi, SuppliersApi, type RawMaterialSummary } from '$api/supply'
  import type { ListRawMaterialsBySupplierModeEnum } from '$api/supply/apis/SuppliersApi'
  import { browser } from '$app/environment'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import FormFieldMessages from '$components/form/FormFieldMessages.svelte'
  import MaterialSingleRenderer from '$components/form/multiselect/MaterialSingleRenderer.svelte'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import FormFieldSkeleton from '$components/skeleton/FormFieldSkeleton.svelte'
  import {
    onPageMessage,
    type SetObserverFunction,
    type UnregisterFunction,
  } from '$components/utils/PageMessageQueue.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import { PageMessage, type PageMessageInterface } from '$fixtures/page-messages'
  import type { FilterQuery, MinimalFilterQuery } from '$utils/filters'
  import type { ExtendedOption } from '$utils/generics'
  import { getMaterialName } from '$utils/materials'
  import { upsertMaterialRoute } from '$utils/routes'
  import { wait } from '$utils/wait'
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import { _ } from 'svelte-i18n'

  export let formAPI: any = null
  export let supplierId: string | undefined = undefined
  export let attr: any | undefined = undefined
  export let label: string = $_('Raw Material')
  export let placeholder: string | undefined = $_('Select Material Placeholder')
  export let name: string = 'rawMaterialId'
  export let id: string = name
  export let error: string | undefined = ''
  export let warning: string | undefined = ''
  export let warningPosition: FormFieldMessagePosition | undefined = undefined
  export let align: 'start' | 'end' | 'center' = 'end'
  export let showLabel: boolean = true
  export let showErrorMessage: boolean = true
  export let disabled: boolean = false
  export let width: string = FormFieldClass.SelectorDefaultWidth
  export let itemRendererComponent: ConstructorOfATypedSvelteComponent | undefined = MaterialSingleRenderer
  export let selectedItemRendererComponent: ConstructorOfATypedSvelteComponent | undefined = undefined
  export let contentWidth: string = width
  export let mode: ListRawMaterialsModeEnum = ListRawMaterialsModeEnum.All
  export let allowNewRecord: boolean = false
  export let newRecordData: any | undefined = undefined
  export let allowClear: boolean = true
  export let fetchFunction: ((query: Partial<FilterQuery>) => Promise<RawMaterialSummary[]>) | undefined = undefined
  export let onChoose: (item: RawMaterialSummary) => void = () => {}
  export let onChange: (item: ExtendedOption | undefined) => void = () => {}

  let materialsList: Array<RawMaterialSummary> = []
  let attentionSeeker = false
  let selectedValue: ExtendedOption | undefined = undefined

  let setPageMessageObserver: SetObserverFunction | undefined = undefined
  let unregisterPageMessage: UnregisterFunction | undefined = undefined

  const materialsApi = new RawMaterialsApi(createClientApiConfig())
  const suppliersApi = new SuppliersApi(createClientApiConfig())
  const dispatch = createEventDispatcher()

  function onCreateNewRecord() {
    if (!browser) return

    const proxy = window.open(upsertMaterialRoute({ inputPayload: newRecordData }), '_blank')
    setPageMessageObserver?.(proxy)
  }

  async function afterCreateNewRecord(event: MessageEvent<PageMessageInterface>) {
    if (!browser) return

    const newMaterial = event.data.payload as RawMaterialSummary

    if (newMaterial?.id) {
      materialsList = [...materialsList, newMaterial]

      attr = newMaterial
      selectedValue = {
        label: getMaterialName(newMaterial.name),
        value: newMaterial.id as string,
        attr: newMaterial as any,
      }

      dispatch('choose', newMaterial)
      onChange(selectedValue)
      onChoose(newMaterial)
      updateFormValue(newMaterial)

      attentionSeeker = true
      await wait(3000)
      attentionSeeker = false
    }
  }

  function updateFormValue(material: RawMaterialSummary | undefined) {
    if (!formAPI) return

    if (!material) {
      formAPI.updateField(name, undefined)
      return
    }

    formAPI.updateField(name, material.id)
    if (errorMessage) formAPI.validateField(name)
  }

  function onRawMaterialChange({ detail }: CustomEvent<Array<ExtendedOption>>) {
    const [material] = detail
    selectedValue = material

    onChange(material)

    if (!material) {
      updateFormValue(undefined)
      return dispatch('clear')
    }

    const hit = materialsList.find(m => m.id === material.value)
    dispatch('choose', hit)
    onChoose(hit as RawMaterialSummary)
    updateFormValue(hit as RawMaterialSummary)
  }

  async function getMaterialsList(query: Partial<MinimalFilterQuery>) {
    if (fetchFunction) return fetchFunction(query)

    if (supplierId)
      return suppliersApi.listRawMaterialsBySupplier({
        ...query,
        mode: mode as ListRawMaterialsBySupplierModeEnum,
        supplierId,
      })

    return materialsApi.listRawMaterials({
      ...query,
      mode,
    })
  }

  async function defaultFetchFunction(query: Partial<MinimalFilterQuery>): Promise<ExtendedOption[]> {
    materialsList = await getMaterialsList(query)

    return materialsList.map((material: RawMaterialSummary) => ({
      label: getMaterialName(material.name),
      value: material.id as string,
      attr: material as any,
    }))
  }

  onMount(() => {
    const { unregister, setObserver } = onPageMessage(PageMessage.RawMaterialCreated, afterCreateNewRecord)

    setPageMessageObserver = setObserver
    unregisterPageMessage = unregister
  })

  onDestroy(() => unregisterPageMessage?.())

  $: errorMessage = (typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]) || error
  $: selectedValue = attr
    ? {
        label: getMaterialName(attr.name),
        value: attr.id as string,
        attr,
      }
    : undefined
</script>

{#if browser}
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
          {allowNewRecord}
          {allowClear}
          {itemRendererComponent}
          {selectedItemRendererComponent}
          fetchFunction={defaultFetchFunction}
          value={selectedValue ? [selectedValue] : []}
          error={errorMessage}
          options={[]}
          emptyText={$_('No Materials Found')}
          newRecordText={$_('Add New Raw Material')}
          class="w-full {attentionSeeker ? 'attention-seeker shadow-border' : ''} {$$restProps.class || ''}"
          multiselection={false}
          shouldFilter={false}
          onCreateNew={onCreateNewRecord}
          on:change={onRawMaterialChange}
          on:change />
      </div>
    </FormFieldMessages>
  </div>
{:else}
  <FormFieldSkeleton {showLabel} {width} />
{/if}
