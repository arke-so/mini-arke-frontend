<script lang="ts">
  import type { PhoneAttr } from '$api/supply'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Table } from '$ds/components/ui/_table'
  import { Label } from '$ds/components/ui/label'
  import type { EntityWithError } from '$utils/generics'
  import { _ } from 'svelte-i18n'
  import { FormFieldClass } from './form'
  import type { FormUtilAPI } from './FormUtil.svelte'
  import IconButton from './IconButton.svelte'
  import TextFieldRaw from './TextFieldRaw.svelte'

  export let formAPI: FormUtilAPI | null = null
  export let name: string = 'phones'
  export let items: Array<PhoneAttr> = []
  export let error: string | undefined = undefined
  export let showLabel: boolean = true
  export let onChange: (items: Array<PhoneAttr>) => void = () => {}
  export function validate() {
    return getInvalidItems(internalItems).length === 0
  }

  const TIME_THRESHOLD = 700
  const EMPTY_ITEM: PhoneAttr = {
    phone: '',
    name: '',
  }
  const EMPTY_ERROR = {
    phone: undefined,
    name: undefined,
  }

  let internalItems: Array<EntityWithError<PhoneAttr>> = items.length ? items : [{ ...EMPTY_ITEM }]
  let internalErrors: Array<{ phone: string | undefined; name: string | undefined }> = []
  let timer: NodeJS.Timeout

  function getValidItems(items: Array<EntityWithError<PhoneAttr>>) {
    return items.filter(item => item.phone && item.name)
  }

  function getEmptyItems() {
    return internalItems.filter(item => isItemEmpty(item))
  }

  function getInvalidItems(items: Array<EntityWithError<PhoneAttr>>) {
    return items.filter(item => !item.phone || !item.name).filter(item => !isItemEmpty(item))
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

  function onRemoveItem(index: number) {
    internalItems = internalItems.filter((_, i) => i !== index)

    if (internalItems.length === 0) internalItems = [{ ...EMPTY_ITEM }]
    internalErrors[index] = EMPTY_ERROR
  }

  function onItemsChange(items: Array<PhoneAttr>) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      const validItems = getValidItems(items)

      onChange(validItems)

      if (!formAPI) return

      formAPI.updateField(name, validItems)
      if ((error && !Array.isArray(error)) || getInvalidItems(items).length > 0) formAPI.validateField(name)
    }, TIME_THRESHOLD)
  }

  function isItemEmpty(item: EntityWithError<PhoneAttr>) {
    return !item.phone && !item.name
  }

  function onPhoneChange(item: EntityWithError<PhoneAttr>, index: number) {
    if (!internalErrors[index]) internalErrors[index] = { ...EMPTY_ERROR }
    if (!item.phone) internalErrors[index].phone = $_('Invalid Email Format')
    else internalErrors[index].phone = undefined
    internalErrors = internalErrors
  }

  function onLabelChange(item: EntityWithError<PhoneAttr>, index: number) {
    if (isItemEmpty(item)) return

    if (!internalErrors[index]) internalErrors[index] = { ...EMPTY_ERROR }
    if (!item.name) internalErrors[index].name = $_('Field Required Text', { values: { field: $_('Label') } })
    else internalErrors[index].name = undefined
    internalErrors = internalErrors
    addOrRemoveEmptyItem()
  }

  $: onItemsChange(internalItems)

  addOrRemoveEmptyItem()
</script>

<div>
  <Label for={name} class={showLabel ? '' : 'sr-only'}>{$_('Phones')}</Label>
  <Table.Root>
    <svelte:fragment slot="thead">
      <Table.Head main>{$_('Phone')}</Table.Head>
      <Table.Head class="min-w-48">{$_('Label')}</Table.Head>
      <Table.Head flush class="w-9 text-stone-300 dark:text-stone-500">
        <span class="sr-only">{$_('Remove')}</span>
        <IcoNoir.Trash class="mx-auto {IconSize.Small}" />
      </Table.Head>
    </svelte:fragment>

    <svelte:fragment slot="tbody">
      {#each internalItems as item, index}
        <Table.Row>
          <Table.Cell flush main>
            <TextFieldRaw
              type="tel"
              name="phone-{index}"
              label={$_('Phone')}
              placeholder={$_('Phone')}
              autoWidth
              showLabel={false}
              class={FormFieldClass.TableCell}
              errorPosition="floating-bottom"
              error={internalErrors[index]?.phone}
              bind:value={item.phone}
              on:input={() => onPhoneChange(item, index)}
              on:focus={onFocus}
              on:blur={onBlur} />
          </Table.Cell>
          <Table.Cell flush>
            <TextFieldRaw
              name="name-label-{index}"
              label={$_('Phone Label')}
              placeholder={$_('Phone Label')}
              autoWidth
              showLabel={false}
              class={FormFieldClass.TableCell}
              errorPosition="floating-bottom"
              error={internalErrors[index]?.name}
              bind:value={item.name}
              on:input={() => onLabelChange(item, index)}
              on:blur={() => onLabelChange(item, index)}
              on:focus={onFocus}
              on:blur={onBlur} />
          </Table.Cell>
          <Table.Cell flush>
            <IconButton
              class="rounded-none"
              tooltip={$_('Delete Element')}
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
