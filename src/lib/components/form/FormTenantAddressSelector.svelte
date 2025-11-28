<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/iam-client-side'
  import { TenantApi } from '$api/iam'
  import { browser } from '$app/environment'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import FormAddressSelector from '$components/form/FormAddressSelector.svelte'
  import type { FormUtilAPI } from '$components/form/FormUtil.svelte'
  import { addressAttrToBasicOption } from '$utils/address'
  import { type MinimalFilterQuery } from '$utils/filters'
  import type { BasicOption, ExtendedOption } from '$utils/generics'
  import { _ } from 'svelte-i18n'

  export let formAPI: FormUtilAPI | null = null
  export let label: string = $_('Shipping Address')
  export let placeholder: string | undefined = $_('Select Address Placeholder')
  export let name: string = 'address'
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
  export let onChoose: (item: BasicOption) => void = () => {}
  export let onChange: (item: ExtendedOption | undefined) => void = () => {}

  const tenantApi = new TenantApi(createClientApiConfig())

  async function fetchFunction(query: MinimalFilterQuery): Promise<BasicOption[]> {
    if (!browser) return []

    const { settings } = await tenantApi.showTenant()
    const { addresses } = settings || {}

    return (addresses || []).map(addressAttrToBasicOption)
  }

  $: locked = formAPI?.locked || false
  $: value = formAPI?.form[name] || undefined
  $: readonly = readonly || locked
</script>

<FormAddressSelector
  {formAPI}
  {label}
  {placeholder}
  {id}
  {name}
  {value}
  {error}
  {warning}
  {warningPosition}
  {align}
  {showLabel}
  {showErrorMessage}
  {disabled}
  {readonly}
  {width}
  {contentWidth}
  {fetchFunction}
  {onChoose}
  {onChange} />
