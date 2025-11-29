<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/sales-client-side'
  import { DefaultApi } from '$api/sales'
  import type { MonthlySales } from '$api/sales/models/MonthlySales'
  import { IcoNoir } from '$ds/components/icons/iconoir'
  import { DEFAULT_CURRENCY_CODE } from '$fixtures/currencies'
  import { getCurrencyDisplayedSybol } from '$utils/currencies'
  import { floatToCurrencyString } from '$utils/prices'
  import { onMount } from 'svelte'
  import { _ } from 'svelte-i18n'
  import KPICard from './KPICard.svelte'

  let monthlySales: Array<MonthlySales> = []
  let loading = true
  let error: string | null = null

  onMount(async () => {
    try {
      const salesOrdersApi = new DefaultApi(createClientApiConfig())
      monthlySales = await salesOrdersApi.lastTwoMonthSales()
    } catch (err) {
      error = $_('Error Fetching Active Sales')
      console.error('Error fetching sales this month:', err)
    } finally {
      loading = false
    }
  })

  $: currentMonth = new Date().toISOString().slice(0, 7)

  $: currentMonthData = monthlySales.find(sale => sale.month === currentMonth)
  $: previousMonthData = monthlySales.find(sale => sale.month !== currentMonth)

  $: currentMonthTotal = currentMonthData?.total ?? 0
  $: previousMonthTotal = previousMonthData?.total ?? 0
  $: formattedCurrentTotal = `${floatToCurrencyString(currentMonthTotal)} ${getCurrencyDisplayedSybol(DEFAULT_CURRENCY_CODE)}`
  $: formattedPreviousTotal = `${floatToCurrencyString(previousMonthTotal)} ${getCurrencyDisplayedSybol(DEFAULT_CURRENCY_CODE)}`
</script>

<KPICard icon={IcoNoir.Cart} iconColor="pink" {loading} {error}>
  <h3 slot="metric" class="text-2xl font-bold">{formattedCurrentTotal}</h3>
  <div slot="description" class="text-md text-muted-foreground">{$_('Sold This Month')}</div>
  <div slot="details">
    {#if previousMonthTotal > 0}
      <div class="text-sm">
        <span class="font-bold">{formattedPreviousTotal}</span>
        {$_('During Previous Month Label')}
      </div>
    {/if}
  </div>
</KPICard>
