<script lang="ts">
  import type { ProcessLine } from '$api/product'
  import { FormFieldClass } from '$components/form/form'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Table } from '$ds/components/ui/_table'
  import { Label } from '$ds/components/ui/label'
  import { createEventDispatcher } from 'svelte'
  import { dndzone } from 'svelte-dnd-action'
  import { _ } from 'svelte-i18n'
  import { flip } from 'svelte/animate'
  import TextFieldRaw from './TextFieldRaw.svelte'

  export let formAPI: any = null
  export let name: string = 'processLines'
  export let id: string = name
  export let label: string = $_('Processes')
  export let showLabel: boolean = true
  export let key: number | string | undefined = undefined
  export let value: Array<ProcessLine> = []

  type InternalProcessLine = ProcessLine & {
    id?: string
  }
  const EMPTY_ITEM: InternalProcessLine = {
    name: '',
    description: '',
    duration: '',
    station: '',
  }
  const TIME_THRESHOLD = 600
  const FLIP_DURATION = 200
  const DND_CONFIG = {
    flipDurationMs: FLIP_DURATION,
    dropTargetStyle: {
      outline: 'hsl(var(--ring)) solid 2px',
    },
  }
  const dispatch = createEventDispatcher()

  let timer: NodeJS.Timeout
  let internalItems: Array<InternalProcessLine> = [{ ...EMPTY_ITEM, id: randomUUID() }]

  function randomUUID() {
    return Math.random().toString(36)
  }

  function getEmptyItems() {
    return internalItems.filter(item => item.name?.trim() === '')
  }

  function getCompletedItems() {
    return internalItems.filter(item => item.name !== '')
  }

  function onFocus() {
    const emptyItems = getEmptyItems()

    if (emptyItems.length < 1) {
      internalItems = [
        ...internalItems,
        {
          ...EMPTY_ITEM,
          id: randomUUID(),
        },
      ]
    }
  }

  function onBlur() {
    const emptyItems = getEmptyItems()

    if (emptyItems.length > 1) {
      internalItems.splice(internalItems.length - 1, 1)
      internalItems = internalItems
    }
  }

  function triggerChangeIfValid() {
    const nextValue: Array<InternalProcessLine> = getCompletedItems()

    dispatch('change', nextValue)

    if (!formAPI) return
    formAPI.updateField(name, nextValue)
  }

  function onChange(_: Array<InternalProcessLine>) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(triggerChangeIfValid, TIME_THRESHOLD)
  }

  function loadData(_: number | string | undefined) {
    const editorValue: Array<InternalProcessLine> = formAPI?.form[name] || value

    if (!editorValue) return

    internalItems = editorValue.length
      ? editorValue.map(it => ({ ...it, id: randomUUID() }))
      : [{ ...EMPTY_ITEM, id: randomUUID() }]

    onFocus()
  }

  function handleDndConsider(e: CustomEvent) {
    internalItems = e.detail.items.filter((item: InternalProcessLine) => item.name !== '')
  }
  function handleDndFinalize(e: CustomEvent) {
    internalItems = e.detail.items
  }

  $: loadData(key)
  $: onChange(internalItems)
  $: errorMessage = typeof formAPI?.errors[name] === 'string' && formAPI?.errors[name]
</script>

<div class="w-full">
  <Label for={name} id="label-{id}" class="mb-1 block {showLabel ? '' : 'sr-only'}">{label}</Label>

  <Table.Root>
    <svelte:fragment slot="thead">
      <Table.Head class="w-5 justify-center">
        <div class="sr-only">{$_('Sort')}</div>
        <IcoNoir.SortRows class={IconSize.Small} />
      </Table.Head>
      <Table.Head>{$_('Process Name')}</Table.Head>
      <Table.Head>{$_('Description')}</Table.Head>
      <Table.Head>{$_('Duration')}</Table.Head>
    </svelte:fragment>

    <svelte:fragment slot="tbody">
      <div
        class="table-row-group border-orange-400"
        use:dndzone={{
          ...DND_CONFIG,
          items: internalItems,
        }}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}>
        {#each internalItems as item, index (item.id)}
          <div class="group table-row rounded-none" animate:flip={{ duration: FLIP_DURATION }}>
            <Table.Cell flush>
              {#if item.name !== ''}
                <div class="flex h-10 items-center justify-center bg-border/20 px-1">
                  <IcoNoir.SortRows class={IconSize.Small} />
                </div>
              {/if}
            </Table.Cell>
            <Table.Cell flush>
              <TextFieldRaw
                name="name-{index}"
                label={$_('Name')}
                showLabel={false}
                bind:value={item.name}
                on:focus={onFocus}
                on:blur={onBlur}
                placeholder={$_('Name')}
                class={FormFieldClass.TableCell} />
            </Table.Cell>
            <Table.Cell flush>
              <TextFieldRaw
                name="description-{index}"
                label={$_('Description')}
                showLabel={false}
                bind:value={item.description}
                on:focus={onFocus}
                on:blur={onBlur}
                placeholder={$_('Description')}
                class={FormFieldClass.TableCell} />
            </Table.Cell>
            <Table.Cell flush>
              <TextFieldRaw
                name="duration-{index}"
                label={$_('Duration')}
                showLabel={false}
                bind:value={item.duration}
                on:focus={onFocus}
                on:blur={onBlur}
                placeholder={$_('Duration')}
                class={FormFieldClass.TableCell} />
            </Table.Cell>
          </div>
        {/each}
      </div>
    </svelte:fragment>
  </Table.Root>

  {#if !!errorMessage}
    <div id="error-{id}" class="mt-1 flex items-center gap-1 text-xs font-semibold text-destructive">
      <IcoNoir.LongArrowLeftUp class={IconSize.Small} />
      {errorMessage}
    </div>
  {/if}
</div>
