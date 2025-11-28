<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/sales-client-side'
  import { DefaultApi, type CustomerDetails } from '$api/sales'
  import { browser } from '$app/environment'
  import { FormFieldClass, type FormFieldMessagePosition } from '$components/form/form'
  import FormAddressSelector from '$components/form/FormAddressSelector.svelte'
  import type { FormUtilAPI } from '$components/form/FormUtil.svelte'
  import { addressAttrToBasicOption } from '$utils/address'
  import { type MinimalFilterQuery } from '$utils/filters'
  import type { BasicOption, ExtendedOption } from '$utils/generics'
  import { _ } from 'svelte-i18n'

  export let formAPI: FormUtilAPI | null = null
  export let customerId: string | undefined = undefined
  export let customerDetails: CustomerDetails | null = null
  export let label: string = $_('Address')
  export let placeholder: string | undefined = $_('Select Address Placeholder')
  export let name: string = 'address'
  export let id: string = name
  export let key: string
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

  const salesApi = new DefaultApi(createClientApiConfig())

  function customerDetailsToAddresses(customerDetails: CustomerDetails): BasicOption[] {
    return (customerDetails.addresses || []).map(addressAttrToBasicOption)
  }

  async function fetchFunction(query: MinimalFilterQuery): Promise<BasicOption[]> {
    if (customerDetails) return customerDetailsToAddresses(customerDetails)
    if (!customerId || !browser) return []

    const customer = await salesApi.showCustomer({ customerId })
    return customerDetailsToAddresses(customer)
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
  {key}
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
