<script lang="ts">
  import IconButton from '$components/form/IconButton.svelte'
  import MultiSelect from '$components/form/multiselect/MultiSelect.svelte'
  import TextFieldRaw from '$components/form/TextFieldRaw.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Table } from '$ds/components/ui/_table'
  import Button from '$ds/components/ui/button/button.svelte'
  import Label from '$ds/components/ui/label/label.svelte'
  import {
    entityHasError,
    unwrapEntities,
    unwrapEntity,
    type BasicOption,
    type EntitiesListWithError,
    type EntityWithError,
  } from '$utils/generics'
  import type { SeenRecords } from '$utils/options'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'
  import { FormFieldClass } from './form'

  export let items: Array<BasicOption> = []
  export let error: string | undefined = undefined
  export let blockLabel: string = $_('Key/Value label')
  export let keyLabel: string = $_('Key Label')
  export let valueLabel: string = $_('Value Label')
  export let addItemLabel: string = $_('Add Key/Value')
  export let showLabel: boolean = true
  export let suggestions: SeenRecords | undefined = undefined

  const dispatch = createEventDispatcher()
  const inputClasses = 'h-10 w-full rounded-none border-transparent focus:border-primary'
  const TIME_THRESHOLD = 700
  const EMPTY_ITEM = {
    label: '',
    value: '',
  }

  let internalItems: EntitiesListWithError<BasicOption> = items.length ? [...items] : [{ ...EMPTY_ITEM }]
  let timer: NodeJS.Timeout

  function getValidItems(items: Array<EntityWithError<BasicOption>>) {
    return unwrapEntities(items.filter(item => item.label && item.value))
  }

  function validateItems() {
    internalItems = internalItems.map(item => {
      item = unwrapEntity(item)

      item._error = []
      Object.keys(EMPTY_ITEM).forEach((key: string) => {
        // @ts-ignore
        if (!item[key]?.trim()) item._error.push(key)
      })
      return item
    })

    return getValidItems(internalItems).length === internalItems.length
  }

  function onAddItem() {
    if (!validateItems()) return

    internalItems = [
      ...internalItems,
      {
        ...EMPTY_ITEM,
        _focus: true,
      },
    ]
  }

  function onRemoveItem(index: number) {
    internalItems = internalItems.filter((_, i) => i !== index)

    if (internalItems.length === 0) internalItems = [{ ...EMPTY_ITEM }]
  }

  function onChange(items: EntitiesListWithError<BasicOption>) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      dispatch('change', getValidItems(items))
    }, TIME_THRESHOLD)
  }

  function validateAddItem(value: string) {
    return /^[a-zA-Z0-9 ]+$/.test(value)
  }

  async function keyLookupFunction(search: string) {
    const options = Object.keys(suggestions || {}).map(key => ({ label: key, value: key }))

    if (search === '') return options

    return options.filter(option => option.label.toLowerCase().includes(search.toLowerCase()))
  }

  async function valueLookupFunction(search: string, item: EntityWithError<BasicOption>) {
    const options =
      item?.label && suggestions?.[item.label]
        ? suggestions[item.label].seen.map(entry => ({ label: entry, value: entry }))
        : []

    if (search === '') return options

    return options.filter(option => option.label.toLowerCase().includes(search.toLowerCase()))
  }

  $: onChange(internalItems)
</script>

<div>
  <Label for="emails" class={showLabel ? 'mb-1 block' : 'sr-only'}>{blockLabel}</Label>

  <Table.Root>
    <svelte:fragment slot="thead">
      <Table.Head class="">{$_('Attribute')}</Table.Head>
      <Table.Head class="">{$_('Value')}</Table.Head>
      <Table.Head flush class="w-10 text-stone-300 dark:text-stone-500">
        <span class="sr-only">{$_('Remove')}</span>
        <IcoNoir.Trash class="mx-auto {IconSize.Small}" />
      </Table.Head>
    </svelte:fragment>

    <svelte:fragment slot="tbody">
      {#each internalItems as item, index}
        <Table.Row>
          <Table.Cell flush class="w-1/2">
            {#if suggestions}
              <Label for="key-{index}" id="label-key-{index}" class="sr-only">Key position {index}</Label>
              <MultiSelect
                name="key-{index}"
                label={keyLabel}
                placeholder={$_('Select Or Add Attribute Placeholder')}
                class="h-10 rounded-none border-transparent focus:border-primary"
                width="{FormFieldClass.SelectorTableCellWidth} max-md:max-w-40"
                contentWidth={FormFieldClass.SelectorContentTableCellWidth}
                {validateAddItem}
                fetchFunction={query => keyLookupFunction(query?.search || '')}
                shouldFilter={false}
                value={item.label !== '' ? [{ label: item.label, value: item.label }] : []}
                options={[]}
                allowCreate
                multiselection={false}
                addItemText={$_('Add Attribute')}
                addItemInvalidText={$_('Cannot Add Attribute')}
                emptyText={$_('Empty Attribute Prompt')}
                on:change={({ detail }) => (item.label = detail[0].value)} />
            {:else}
              <TextFieldRaw
                name="key-{index}"
                label={keyLabel}
                placeholder={keyLabel}
                autoWidth
                focus={item._focus}
                showLabel={false}
                showErrorMessage={false}
                error={entityHasError(item, 'label')
                  ? $_('Field Required Text', { values: { field: keyLabel } })
                  : undefined}
                class={inputClasses}
                bind:value={item.label} />
            {/if}
          </Table.Cell>
          <Table.Cell flush class="w-1/2">
            {#if suggestions}
              <Label for="value-{index}" id="label-value-{index}" class="sr-only">Value position {index}</Label>
              <MultiSelect
                name="value-{index}"
                label={valueLabel}
                placeholder={$_('Select Or Add Attribute Value Placeholder')}
                class="h-10 rounded-none border-transparent focus:border-primary"
                width="{FormFieldClass.SelectorTableCellWidth} max-md:max-w-40"
                contentWidth={FormFieldClass.SelectorContentTableCellWidth}
                {validateAddItem}
                fetchFunction={query => valueLookupFunction(query?.search || '', item)}
                value={item.value !== '' ? [{ label: item.value, value: item.value }] : []}
                options={[]}
                allowCreate
                multiselection={false}
                addItemText={$_('Add Value')}
                addItemInvalidText={$_('Cannot Add Value')}
                emptyText={$_('Empty Value Prompt')}
                on:change={({ detail }) => (item.value = detail[0].value)} />
            {:else}
              <TextFieldRaw
                name="value-{index}"
                label={valueLabel}
                placeholder={valueLabel}
                autoWidth
                showLabel={false}
                showErrorMessage={false}
                error={entityHasError(item, 'value')
                  ? $_('Field Required Text', { values: { field: valueLabel } })
                  : undefined}
                class={inputClasses}
                bind:value={item.value} />
            {/if}
          </Table.Cell>
          <Table.Cell class="w-10" flush>
            <IconButton tooltip={$_('Remove Element')} variant="ghostDestructive" on:click={() => onRemoveItem(index)}>
              <IcoNoir.Trash class={IconSize.Small} />
            </IconButton>
          </Table.Cell>
        </Table.Row>
      {/each}
    </svelte:fragment>
  </Table.Root>
  <div class="border-b">
    <Button variant="ghost" class="w-full justify-start rounded-none" on:click={onAddItem}>
      <IcoNoir.Plus class="{IconSize.Button} mr-2" />
      {addItemLabel}
    </Button>
  </div>

  {#if error}
    <div class="mb-2 mt-1 flex items-center gap-1 text-xs font-semibold text-destructive">
      <IcoNoir.LongArrowLeftUp class={IconSize.Small} />
      {error}
    </div>
  {/if}
</div>
