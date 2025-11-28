<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/infra-client-side'
  import { DefaultApi, type SearchDoc } from '$api/infra'
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { IcoNoir } from '$ds/components/icons/iconoir'
  import * as Command from '$ds/components/ui/command'
  import { assistantPanelActive } from '$stores/app'
  import { getMaterialName } from '$utils/materials'
  import {
    createMaterialStockAdjustmentRoute,
    createProductStockAdjustmentRoute,
    customersRoute,
    goodsRoute,
    productionRoute,
    productsRoute,
    purchaseRoute,
    rawMaterialsRoute,
    salesRoute,
    settingsRoute,
    stockMaterialsEventsRoute,
    stockProductsEventsRoute,
    stockProductsRoute,
    stockRoute,
    suppliersRoute,
    upsertCustomerRoute,
    upsertMaterialRoute,
    upsertOrderRoute,
    upsertProductRoute,
    upsertSalesOrderLandingRoute,
    upsertSupplierRoute,
    usersRoute,
  } from '$utils/routes'
  import { onMount } from 'svelte'
  import { _ } from 'svelte-i18n'
  import SpotlightSearchItem from './SpotlightSearchItem.svelte'

  export let open: boolean = false

  type ExtendedSearchDoc = SearchDoc & {
    handler?: () => void
    icon?: ConstructorOfATypedSvelteComponent
  }

  let value: string = ''
  let timer: NodeJS.Timeout | null = null
  let results: Array<ExtendedSearchDoc> = []

  const infraApi = new DefaultApi(createClientApiConfig())
  const UTILS: Array<ExtendedSearchDoc> = [
    {
      id: 'add-raw-material',
      name: $_('Create Material'),
      type: 'utility',
      handler: () => openPage(upsertMaterialRoute()),
      icon: IcoNoir.Plus,
    },
    {
      id: 'add-product',
      name: $_('Create Product'),
      type: 'utility',
      handler: () => openPage(upsertProductRoute()),
      icon: IcoNoir.Plus,
    },
    {
      id: 'add-supplier',
      name: $_('Create Supplier'),
      type: 'utility',
      handler: () => openPage(upsertSupplierRoute()),
      icon: IcoNoir.Plus,
    },
    {
      id: 'add-customer',
      name: $_('Create Customer'),
      type: 'utility',
      handler: () => openPage(upsertCustomerRoute()),
      icon: IcoNoir.Plus,
    },
    {
      id: 'add-purchase-order',
      name: $_('Create Purchase Order'),
      type: 'utility',
      handler: () => openPage(upsertOrderRoute()),
      icon: IcoNoir.Plus,
    },
    {
      id: 'add-sales-order',
      name: $_('Create Sales Order Landing Title'),
      type: 'utility',
      handler: () => openPage(upsertSalesOrderLandingRoute()),
      icon: IcoNoir.Plus,
    },
    {
      id: 'create-stock-adjustment-materials',
      name: `${$_('New Stock Adjustment')} - ${$_('Materials')}`,
      type: 'utility',
      handler: () => openPage(createMaterialStockAdjustmentRoute()),
      icon: IcoNoir.Plus,
    },
    {
      id: 'create-stock-adjustment-products',
      name: `${$_('New Stock Adjustment')} - ${$_('Products')}`,
      type: 'utility',
      handler: () => openPage(createProductStockAdjustmentRoute()),
      icon: IcoNoir.Plus,
    },
    {
      id: 'goto-sales',
      name: $_('Sell (page)'),
      type: 'utility',
      handler: () => openPage(salesRoute()),
    },
    {
      id: 'goto-purchases',
      name: $_('Buy (page)'),
      type: 'utility',
      handler: () => openPage(purchaseRoute()),
    },
    {
      id: 'goto-inventory',
      name: `${$_('Stock (page)')} - ${$_('Materials')}`,
      type: 'utility',
      handler: () => openPage(stockRoute()),
    },
    {
      id: 'goto-inventory-products',
      name: `${$_('Stock (page)')} - ${$_('Products')}`,
      type: 'utility',
      handler: () => openPage(stockProductsRoute()),
    },
    {
      id: 'goto-inventory-events-materials',
      name: `${$_('Stock Changes (page)')} - ${$_('Materials')}`,
      type: 'utility',
      handler: () => openPage(stockMaterialsEventsRoute()),
    },
    {
      id: 'goto-inventory-events-products',
      name: `${$_('Stock Changes (page)')} - ${$_('Products')}`,
      type: 'utility',
      handler: () => openPage(stockProductsEventsRoute()),
    },
    {
      id: 'goto-contacts',
      name: `${$_('Contacts (page)')} - ${$_('Suppliers')}`,
      type: 'utility',
      handler: () => openPage(suppliersRoute()),
    },
    {
      id: 'goto-contacts-customers',
      name: `${$_('Contacts (page)')} - ${$_('Customers')}`,
      type: 'utility',
      handler: () => openPage(customersRoute()),
    },
    {
      id: 'goto-settings',
      name: $_('Settings (page)'),
      type: 'utility',
      handler: () => openPage(settingsRoute()),
    },
    {
      id: 'goto-goods',
      name: $_('Goods (page)'),
      type: 'utility',
      handler: () => openPage(goodsRoute()),
    },
    {
      id: 'goto-materials',
      name: $_('Materials'),
      type: 'utility',
      handler: () => openPage(rawMaterialsRoute()),
    },
    {
      id: 'goto-products',
      name: $_('Products'),
      type: 'utility',
      handler: () => openPage(productsRoute()),
    },
    {
      id: 'goto-users',
      name: $_('Users (page)'),
      type: 'utility',
      handler: () => openPage(usersRoute()),
    },
    {
      id: 'goto-production',
      name: $_('Production (page)'),
      type: 'utility',
      handler: () => openPage(productionRoute()),
    },
  ]

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      open = !open
    } else if (e.key === 'g' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      assistantPanelActive.update(value => !value)
    } else if (e.key === 'Escape') {
      assistantPanelActive.set(false)
    }
  }

  function execUtil(result: SearchDoc) {
    console.log('execUtil', result)
  }

  function searchUtils(q: string) {
    const results = UTILS.filter(item => item.name?.toLowerCase().includes(q.toLowerCase()))
      .map(item => ({
        ...item,
        confidence: item.name?.toLowerCase().startsWith(q.toLowerCase()) ? 1 : 0.5,
      }))
      .sort((a, b) => b.confidence - a.confidence)

    return results
  }

  async function search(q: string) {
    if (q === 'bulbarelli') {
      results = [{ id: '1', name: 'Bulbarelli', type: 'Eh, va beh, tanta roba!' }]
      return
    }

    results = await infraApi.search({ q })
    results = results.concat(searchUtils(q))

    console.log('results', results)
  }

  function onInput(value: string) {
    if (!browser) return
    if (timer) clearTimeout(timer)
    if (!value) {
      results = []
      return
    }

    timer = setTimeout(() => search(value), 300)
  }

  async function openPage(url: string) {
    open = false
    goto(url)
  }

  function groupResults(items: Array<ExtendedSearchDoc>) {
    const grouped = items.reduce(
      (acc, result) => {
        if (!acc[result.type]) acc[result.type] = []
        acc[result.type].push(result)
        return acc
      },
      {} as Record<string, Array<ExtendedSearchDoc>>,
    )

    return Object.entries(grouped)
  }

  function getTypeLabel(typeKey: string) {
    switch (typeKey) {
      case 'supplier':
        return $_('Supplier')
      case 'raw_material':
        return $_('Raw Material')
      case 'product':
        return $_('Product')
      case 'order':
        return $_('Order')
      case 'utility':
        return $_('Utility')
      case 'utility-create':
        return $_('Utility')
      default:
        return typeKey
    }
  }

  function groupTypeToLabel(type: string) {
    switch (type) {
      case 'supplier':
        return $_('Suppliers')
      case 'raw_material':
        return $_('Raw Materials')
      case 'product':
        return $_('Products')
      case 'order':
        return $_('Order')
      case 'utility':
        return $_('Utility')
      case 'utility-create':
        return $_('Utility')
      default:
        return type
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown)

    return () => document.removeEventListener('keydown', handleKeydown)
  })

  $: onInput(value)
  $: groupedResults = groupResults(results)
</script>

<Command.Dialog bind:open shouldFilter={false}>
  <Command.Input placeholder={$_('Search Placeholder')} bind:value />
  <Command.List>
    {#each groupedResults as [type, list]}
      <Command.Group heading={groupTypeToLabel(type)}>
        {#each list as result}
          {#if result.type === 'utility'}
            <SpotlightSearchItem
              {result}
              icon={result.icon || IcoNoir.Database}
              label={getTypeLabel(result.type)}
              onSelect={() => (result.handler ? result.handler() : execUtil(result))} />
          {:else if result.type === 'supplier'}
            <SpotlightSearchItem
              {result}
              icon={IcoNoir.Users}
              label={getTypeLabel(result.type)}
              onSelect={() => openPage(upsertSupplierRoute(result.id, true))} />
          {:else if result.type === 'raw_material'}
            <SpotlightSearchItem
              {result}
              icon={IcoNoir.Box}
              label={getTypeLabel(result.type)}
              onSelect={() => openPage(upsertMaterialRoute({ materialId: result.id, useReferrer: true }))}>
              {getMaterialName(result?.name || '')}
            </SpotlightSearchItem>
          {:else if result.type === 'product'}
            <SpotlightSearchItem
              {result}
              icon={IcoNoir.Box}
              label={getTypeLabel(result.type)}
              onSelect={() => openPage(upsertProductRoute({ productId: result.id, useReferrer: true }))} />

            <!-- <div class="py-1 pl-8">
              {#each result?.rawMaterials || [] as it}
                <div class="pl-1 text-xs">{it.name}</div>
              {/each}
            </div> -->
          {:else if result.type === 'order'}
            <SpotlightSearchItem
              {result}
              icon={IcoNoir.Box}
              label={getTypeLabel(result.type)}
              onSelect={() => openPage(upsertOrderRoute({ orderId: result.id, useReferrer: true }))} />
          {:else}
            <SpotlightSearchItem {result} icon={IcoNoir.Accounting} label={getTypeLabel(result.type)} />
          {/if}
        {/each}
      </Command.Group>
    {/each}

    <!-- {#each results as result}
      {#if result.type === 'utility-create'}
        <Command.Item value={result.id} onSelect={() => execUtil(result)}>
          <IcoNoir.Plus class="mr-2" />
          <span>{result.name}</span>
          <span class="ml-auto text-muted-foreground">{$_('Utility')}</span>
        </Command.Item>
      {:else if result.type === 'utility'}
        <Command.Item value={result.id} onSelect={() => execUtil(result)}>
          <IcoNoir.ArkeLogoOnly class="mr-2" />
          <span>{result.name}</span>
          <span class="ml-auto text-muted-foreground">{$_('Utility')}</span>
        </Command.Item>
      {:else if result.type === 'supplier'}
        <Command.Item value={result.id} onSelect={() => openPage(upsertSupplierRoute(result.id, true))}>
          <IcoNoir.Users class="mr-2" />
          <span>{result.name}</span>
          <span class="ml-auto text-muted-foreground">{getTypeLabel(result.type)}</span>
        </Command.Item>
      {:else if result.type === 'raw_material'}
        <Command.Item
          value={result.id}
          onSelect={() => openPage(upsertMaterialRoute({ materialId: result.id, useReferrer: true }))}>
          <IcoNoir.Box class="mr-2" />
          <span>{getMaterialName(result?.name || '')}</span>
          <span class="ml-auto text-muted-foreground">{getTypeLabel(result.type)}</span>
        </Command.Item>
      {:else if result.type === 'product'}
        <Command.Item
          value={result.id}
          onSelect={() => openPage(upsertProductRoute({ productId: result.id, useReferrer: true }))}>
          <IcoNoir.Box class="mr-2" />
          <span>{result.name}</span>
          <span class="ml-auto text-muted-foreground">{getTypeLabel(result.type)}</span>
        </Command.Item>
      {:else if result.type === 'order'}
        <Command.Item
          value={result.id}
          onSelect={() => openPage(upsertOrderRoute({ orderId: result.id, useReferrer: true }))}>
          <IcoNoir.Box class="mr-2" />
          <span>{result.name}</span>
          <span class="ml-auto text-muted-foreground">{getTypeLabel(result.type)}</span>
        </Command.Item>
      {:else}
        <Command.Item value={result.id}>
          <IcoNoir.Accounting class="mr-2" />
          <span>{result.name}</span>
          <span class="ml-auto text-muted-foreground">{getTypeLabel(result.type)}</span>
        </Command.Item>
      {/if}
    {/each} -->
  </Command.List>
</Command.Dialog>
