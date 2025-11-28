<script lang="ts">
  import type { EmailAttr } from '$api/supply'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Table } from '$ds/components/ui/_table'
  import { Label } from '$ds/components/ui/label'
  import type { EntityWithError } from '$utils/generics'
  import { isValidEmail } from '$utils/validation'
  import { _ } from 'svelte-i18n'
  import { FormFieldClass } from './form'
  import FormEmailField from './FormEmailField.svelte'
  import type { FormUtilAPI } from './FormUtil.svelte'
  import IconButton from './IconButton.svelte'
  import TextFieldRaw from './TextFieldRaw.svelte'

  export let formAPI: FormUtilAPI | null = null
  export let name: string = 'emails'
  export let items: Array<EmailAttr> = []
  export let error: string | undefined = undefined
  export let showLabel: boolean = true
  export let onChange: (items: Array<EmailAttr>) => void = () => {}
  export function validate() {
    return getInvalidItems(internalItems).length === 0
  }

  const TIME_THRESHOLD = 700
  const EMPTY_ITEM: EmailAttr = {
    email: '',
    name: '',
  }
  const EMPTY_ERROR = {
    email: undefined,
    name: undefined,
  }

  let internalItems: Array<EntityWithError<EmailAttr>> = items.length ? items : [{ ...EMPTY_ITEM }]
  let internalErrors: Array<{ email: string | undefined; name: string | undefined }> = []
  let timer: NodeJS.Timeout

  function getValidItems(items: Array<EntityWithError<EmailAttr>>) {
    return items.filter(item => item.email && item.name)
  }

  function getEmptyItems() {
    return internalItems.filter(item => isItemEmpty(item))
  }

  function getInvalidItems(items: Array<EntityWithError<EmailAttr>>) {
    return items.filter(item => !item.email || !item.name).filter(item => !isItemEmpty(item))
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

  function onItemsChange(items: Array<EmailAttr>) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      const validItems = getValidItems(items)

      onChange(validItems)

      if (!formAPI) return

      formAPI.updateField(name, validItems)
      if ((error && !Array.isArray(error)) || getInvalidItems(items).length > 0) formAPI.validateField(name)
    }, TIME_THRESHOLD)
  }

  function isItemEmpty(item: EntityWithError<EmailAttr>) {
    return !item.email && !item.name
  }

  function onEmailChange(item: EntityWithError<EmailAttr>, index: number) {
    if (!internalErrors[index]) internalErrors[index] = { ...EMPTY_ERROR }
    if (!item.email || !isValidEmail(item.email)) internalErrors[index].email = $_('Invalid Email Format')
    else internalErrors[index].email = undefined
    internalErrors = internalErrors
  }

  function onLabelChange(item: EntityWithError<EmailAttr>, index: number) {
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
  <Label for="emails" class={showLabel ? '' : 'sr-only'}>{$_('Email')}</Label>
  <Table.Root>
    <svelte:fragment slot="thead">
      <Table.Head main>{$_('Email')}</Table.Head>
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
            <FormEmailField
              name="email-{index}"
              label={$_('Email')}
              placeholder={$_('Email')}
              autoWidth
              showLabel={false}
              class={FormFieldClass.TableCell}
              errorPosition="floating-bottom"
              error={internalErrors[index]?.email}
              onChange={() => onEmailChange(item, index)}
              bind:value={item.email} />
          </Table.Cell>
          <Table.Cell flush>
            <TextFieldRaw
              name="name-label-{index}"
              label={$_('Email')}
              placeholder={$_('Email Label')}
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
