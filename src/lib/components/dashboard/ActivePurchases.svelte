<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/supply-client-side'
  import { OrdersApi } from '$api/supply'
  import { OrderSummaryStatusEnum, type OrderSummary } from '$api/supply/models/OrderSummary'
  import { IcoNoir } from '$ds/components/icons/iconoir'
  import { onMount } from 'svelte'
  import { _ } from 'svelte-i18n'
  import KPICard from './KPICard.svelte'

  let activePurchaseOrders: Array<OrderSummary> = []
  let loading = true
  let error: string | null = null

  onMount(async () => {
    try {
      const purchaseOrdersApi = new OrdersApi(createClientApiConfig())
      activePurchaseOrders = await purchaseOrdersApi.listActiveOrders()
    } catch (err) {
      error = $_('Error Fetching Active Purchases')
      console.error('Error fetching active purchases:', err)
    } finally {
      loading = false
    }
  })

  $: sentNotApproved = activePurchaseOrders.filter(
    order => order.status === OrderSummaryStatusEnum.Sent,
  ).length

  $: confirmedPendingDelivery = activePurchaseOrders.filter(
    order => order.status === OrderSummaryStatusEnum.Accepted,
  ).length

  $: totalPurchases = activePurchaseOrders.length
</script>

<KPICard icon={IcoNoir.ShoppingBasket} iconColor="green" {loading} {error}>
  <h3 slot="metric" class="text-2xl font-bold">{totalPurchases} {$_('Purchases Count')}</h3>
  <div slot="description" class="text-md text-muted-foreground">{$_('Active Purchase Orders')}</div>
  <div slot="details">
    {#if sentNotApproved > 0}
      <div class="text-sm"><span class="font-bold">{sentNotApproved}</span> {$_('Sent Orders Not Approved')}</div>
    {/if}
    {#if confirmedPendingDelivery > 0}
      <div class="text-sm">
        <span class="font-bold">{confirmedPendingDelivery}</span> {$_('Confirmed Orders Pending Delivery')}
      </div>
    {/if}
  </div>
</KPICard>
