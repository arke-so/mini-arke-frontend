<script lang="ts">
  import type { AddressAttr } from '$api/supply'
  import TextFieldRaw from '$components/form/TextFieldRaw.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Table } from '$ds/components/ui/_table'
  import { Label } from '$ds/components/ui/label'
  import { Textarea } from '$ds/components/ui/textarea'
  import { DEFAULT_COUNTRY } from '$fixtures/constants'
  import { isMobileDevice } from '$utils/device'
  import type { EntityWithError } from '$utils/generics'
  import { _ } from 'svelte-i18n'
  import CountrySelector from './CountrySelector.svelte'
  import { FormFieldClass } from './form'
  import type { FormUtilAPI } from './FormUtil.svelte'
  import IconButton from './IconButton.svelte'

  export let formAPI: FormUtilAPI | null = null
  export let name: string = 'addresses'
  export let items: Array<AddressAttr> = []
  export let error: string | undefined = undefined
  export let showLabel: boolean = true
  export let onChange: (items: Array<AddressAttr>) => void = () => {}
  export function validate() {
    return getInvalidItems(internalItems).length === 0
  }

  const TIME_THRESHOLD = 700
  const MAX_TEXTAREA_HEIGHT = 100
  const EMPTY_ITEM: AddressAttr = {
    address: '',
    country: DEFAULT_COUNTRY,
    name: '',
  }
  const EMPTY_ERROR = {
    address: undefined,
    name: undefined,
  }

  let internalItems: Array<EntityWithError<AddressAttr>> = items.length ? items : [{ ...EMPTY_ITEM }]
  let internalErrors: Array<{ address: string | undefined; name: string | undefined }> = []
  let timer: NodeJS.Timeout

  function getValidItems(items: Array<EntityWithError<AddressAttr>>) {
    return items.filter(address => address.address && address.country && address.name)
  }

  function getEmptyItems() {
    return internalItems.filter(item => item.address === '' || item.name === '')
  }

  function getInvalidItems(items: Array<EntityWithError<AddressAttr>>) {
    return items.filter(item => !item.address || !item.name).filter(item => !isItemEmpty(item))
  }

  function onFocus() {
    addOrRemoveEmptyItem()
  }

  function onBlur() {
    addOrRemoveEmptyItem()
  }

  function addOrRemoveEmptyItem() {
    const emptyItems = getEmptyItems()

    if (emptyItems.length > 1) {
      internalItems.splice(internalItems.length - 1, 1)
      internalItems = internalItems
    } else if (emptyItems.length < 1) {
      internalItems = [...internalItems, { ...EMPTY_ITEM }]
    }
  }

  function isItemEmpty(item: EntityWithError<AddressAttr>) {
    return !item.address && !item.name
  }

  function onLabelChange(item: EntityWithError<AddressAttr>, index: number) {
    if (isItemEmpty(item)) return

    if (!internalErrors[index]) internalErrors[index] = { ...EMPTY_ERROR }
    if (!item.name) internalErrors[index].name = $_('Field Required Text', { values: { field: $_('Label') } })
    else internalErrors[index].name = undefined
    internalErrors = internalErrors
    addOrRemoveEmptyItem()
  }

  function onAddressChange(item: EntityWithError<AddressAttr>, index: number) {
    if (isItemEmpty(item)) return

    item.address = item.address.replace(/\n/, ' ')

    if (!internalErrors[index]) internalErrors[index] = { ...EMPTY_ERROR }
    if (!item.address) internalErrors[index].address = $_('Field Required Text', { values: { field: $_('Address') } })
    else internalErrors[index].address = undefined
    internalErrors = internalErrors
    addOrRemoveEmptyItem()
  }

  function onRemoveItem(index: number) {
    internalItems = internalItems.filter((_, i) => i !== index)

    if (internalItems.length === 0) internalItems = [{ ...EMPTY_ITEM }]
  }

  function onItemsChange(addresses: Array<AddressAttr>) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      const validItems = getValidItems(addresses)

      onChange(getValidItems(addresses))

      if (!formAPI) return

      formAPI.updateField(name, validItems)
      if ((error && !Array.isArray(error)) || getInvalidItems(items).length > 0) formAPI.validateField(name)
    }, TIME_THRESHOLD)
  }

  function updateTextareaHeight(event: Event, reset: boolean = false) {
    const target = event.target as HTMLTextAreaElement

    if (!target) return

    target.style.height = 'auto'

    if (reset) return

    target.style.height = `${target.scrollHeight}px`
  }

  $: onItemsChange(internalItems)

  addOrRemoveEmptyItem()
</script>

<div>
  <Label for="addresses" id="addresses" class={showLabel ? '' : 'sr-only'}>{$_('Addresses')}</Label>

  <Table.Root linear={isMobileDevice()}>
    <svelte:fragment slot="thead">
      <Table.Head main>{$_('Address')}</Table.Head>
      <Table.Head class="">{$_('Country')}</Table.Head>
      <Table.Head class="min-w-48">{$_('Label')}</Table.Head>
      <Table.Head flush class="w-9 text-stone-300 dark:text-stone-500">
        <span class="sr-only">{$_('Remove')}</span>
        <IcoNoir.Trash class="mx-auto {IconSize.Small}" />
      </Table.Head>
    </svelte:fragment>

    <svelte:fragment slot="tbody" let:linear>
      {#each internalItems as item, index}
        <Table.Row {linear}>
          <Table.Cell {linear} flush main>
            <Textarea
              name="address-{index}"
              placeholder={$_('Address')}
              class="{FormFieldClass.TableCell} min-h-10 resize-none"
              rows={1}
              on:focus={onFocus}
              on:focus={updateTextareaHeight}
              on:blur={event => updateTextareaHeight(event, true)}
              on:input={updateTextareaHeight}
              on:input={() => onAddressChange(item, index)}
              on:blur={() => onAddressChange(item, index)}
              bind:value={item.address} />
          </Table.Cell>
          <Table.Cell {linear} flush>
            <CountrySelector
              label={$_('Country')}
              name="country-{index}"
              showLabel={false}
              class={FormFieldClass.TableCell}
              showErrorMessage={false}
              bind:value={item.country} />
          </Table.Cell>
          <Table.Cell {linear} flush>
            <TextFieldRaw
              name="name-{index}"
              label={$_('Address Label')}
              placeholder={$_('Address Label')}
              class={FormFieldClass.TableCell}
              showLabel={false}
              errorPosition="floating-bottom"
              error={internalErrors[index]?.name}
              bind:value={item.name}
              on:input={() => onLabelChange(item, index)}
              on:blur={() => onLabelChange(item, index)}
              on:focus={onFocus}
              on:blur={onBlur} />
          </Table.Cell>
          <Table.Cell {linear} flush>
            <IconButton
              tooltip={$_('Delete Element')}
              class="rounded-none"
              variant="ghostDestructive"
              on:click={() => onRemoveItem(index)}>
              <IcoNoir.Trash class="w-4 {IconSize.Button}" />
            </IconButton>
          </Table.Cell>
        </Table.Row>
      {/each}
    </svelte:fragment>
  </Table.Root>

  {#if !Array.isArray(error) && error && error?.length !== 0}
    <div class="mb-2 mt-1 flex items-center gap-1 text-xs font-semibold text-destructive">
      <IcoNoir.LongArrowLeftUp class={IconSize.Small} />
      {error}
    </div>
  {/if}
</div>
