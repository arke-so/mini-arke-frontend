<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/product-client-side'
  import { DefaultApi, type ProductSummary } from '$api/product'
  import type { PricedQuantifiedItem } from '$api/supply'
  import { browser } from '$app/environment'
  import ImportCSV, { type ImportResult } from '$components/import/ImportCSV.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import { DEFAULT_CURRENCY_CODE } from '$fixtures/currencies'
  import { UnitOfMeasures } from '$fixtures/uom'
  import { downloadFileFromBlob } from '$utils/download'
  import { getUOMMinQuantity } from '$utils/uom'
  import { _ } from 'svelte-i18n'

  export let disabled: boolean = false
  export let onImportComplete: (products: PricedQuantifiedItem[]) => void = () => {}

  const productsApi = new DefaultApi(createClientApiConfig())

  let importing = false
  let importLogs: string[] = []
  let importErrors: string[] = []

  type CSVProduct = {
    name: string
    extraId?: string
    quantity: string
  }

  function parseCSVRow(row: string[]): CSVProduct {
    return {
      name: row[0]?.trim() || '',
      extraId: row[1]?.trim() || undefined,
      quantity: row[2]?.trim() || '0',
    }
  }

  async function findProduct(csvProduct: CSVProduct): Promise<ProductSummary | null> {
    try {
      if (csvProduct.extraId) {
        const productsByCode = await productsApi.listProducts({
          search: csvProduct.extraId,
          limit: 20,
        })
        const exactCodeMatch = productsByCode.find(
          p => p.internalId?.toLowerCase() === csvProduct.extraId?.toLowerCase(),
        )
        if (exactCodeMatch) return exactCodeMatch
      }

      if (csvProduct.name) {
        const productsByName = await productsApi.listProducts({
          search: csvProduct.name,
          limit: 20,
        })
        const exactNameMatch = productsByName.find(p => p.name?.toLowerCase() === csvProduct.name.toLowerCase())
        if (exactNameMatch) return exactNameMatch

        if (productsByName.length > 0) {
          return productsByName[0]
        }
      }

      return null
    } catch (error) {
      throw error
    }
  }

  function csvProductToPricedQuantifiedItem(csvProduct: CSVProduct, product: ProductSummary): PricedQuantifiedItem {
    const quantity = parseFloat(csvProduct.quantity) || getUOMMinQuantity(product.uom || UnitOfMeasures.Default)

    return {
      name: product.name,
      id: product.id as string,
      extraId: product.internalId as string,
      quantity,
      uom: product.uom || UnitOfMeasures.Default,
      prices: {
        unit: product.prices?.unit || 0,
        vat: product.prices?.vat || 22,
        currency: product.prices?.currency || DEFAULT_CURRENCY_CODE,
        deals: product.prices?.deals || [],
      },
    }
  }

  async function onImport(result: ImportResult) {
    if (!result.data || result.data.length < 2) {
      importErrors = [$_('CSV file must contain at least one data row')]
      return
    }

    importing = true
    importLogs = []
    importErrors = []

    const csvRows = result.data.slice(1)
    const importedProducts: PricedQuantifiedItem[] = []

    for (let i = 0; i < csvRows.length; i++) {
      const row = csvRows[i]
      const rowNumber = i + 2

      try {
        const csvProduct = parseCSVRow(row)

        // if (!csvProduct.name) {
        //   importLogs.push(`${$_('Row')} ${rowNumber}: ${$_('Skipped - Missing Product Name')}`)
        //   continue
        // }

        if (!csvProduct.quantity || parseFloat(csvProduct.quantity) <= 0) {
          importErrors.push(`${$_('Row')} ${rowNumber}: ${$_('Invalid Quantity For')} "${csvProduct.name}"`)
          continue
        }

        const product = await findProduct(csvProduct)

        if (!product) {
          importErrors.push(`${$_('Row')} ${rowNumber}: ${$_('Product Not Found')}: "${csvProduct.name}"`)
          continue
        }

        const pricedQuantifiedItem = csvProductToPricedQuantifiedItem(csvProduct, product)
        importedProducts.push(pricedQuantifiedItem)

        importLogs.push(`${$_('Row')} ${rowNumber}: ${$_('Imported')} "${product.name}" (${csvProduct.quantity})`)
      } catch (error) {
        importErrors.push(`${$_('Row')} ${rowNumber}: ${$_('Error Processing Row')} - ${error}`)
      }
    }

    importing = false

    if (importedProducts.length > 0) {
      onImportComplete(importedProducts)
      importLogs.push(`\n${$_('Import Completed')}: ${importedProducts.length} ${$_('Products Imported')}`)
    } else {
      importErrors.push($_('No Products Were Imported'))
    }
  }

  async function downloadCSVTemplate() {
    if (!browser) return

    const template = ['name,extraId,quantity', 'Example Product,PROD-021,10', 'Another Product,,5', ',PROD-016,5'].join(
      '\n',
    )

    const blob = new Blob([template], { type: 'text/csv' })
    downloadFileFromBlob(blob, 'products-import-template.csv')
  }
</script>

<div class="space-y-4">
  <div class="flex gap-2">
    <ImportCSV {disabled} {onImport} />
    <Button variant="ghost" on:click={downloadCSVTemplate} {disabled} class="text-muted-foreground">
      <IcoNoir.Download class={IconSize.Small} />
      {$_('Download Template')}
    </Button>
  </div>

  {#if importing}
    <div class="text-sm text-muted-foreground">
      {$_('Processing CSV...')}
    </div>
  {/if}

  {#if importLogs.length > 0}
    <div class="rounded border bg-muted/50 p-3">
      <h4 class="mb-2 text-sm font-medium">{$_('Import Results')}:</h4>
      <pre class="max-h-32 overflow-auto text-xs text-muted-foreground">{importLogs.join('\n')}</pre>
    </div>
  {/if}

  {#if importErrors.length > 0}
    <div class="rounded border border-destructive/20 bg-destructive/5 p-3">
      <h4 class="mb-2 text-sm font-medium text-destructive">{$_('Import Errors')}:</h4>
      <pre class="max-h-32 overflow-auto text-xs text-destructive">{importErrors.join('\n')}</pre>
    </div>
  {/if}
</div>
