<script lang="ts">
  import { createClientApiConfig } from '$api/clients-utils/sales-client-side'
  import { DefaultApi } from '$api/sales'
  import { ActiveOrderStatusEnum, type ActiveOrder } from '$api/sales/models/ActiveOrder'
  import { IcoNoir } from '$ds/components/icons/iconoir'
  import { onMount } from 'svelte'
  import { _ } from 'svelte-i18n'
  import KPICard from './KPICard.svelte'

  let activeSalesOrders: Array<ActiveOrder> = []
  let loading = true
  let error: string | null = null

  onMount(async () => {
    try {
      const salesOrdersApi = new DefaultApi(createClientApiConfig())
      activeSalesOrders = await salesOrdersApi.listActiveOrders()
    } catch (err) {
      // [cp] The user doesn't need to know the technical details of the error
      error = $_('Error Fetching Active Sales')
      console.error('Error fetching active sales:', err)
    } finally {
      loading = false
    }
  })

  $: shippingInProgress = activeSalesOrders.filter(order => order.status === ActiveOrderStatusEnum.Sent).length

  $: shippingNotStarted = activeSalesOrders.filter(order => order.status === ActiveOrderStatusEnum.Accepted).length

  $: totalSales = activeSalesOrders.length
</script>

<KPICard icon={IcoNoir.Cart} iconColor="pink" {loading} {error}>
  <h3 slot="metric" class="text-2xl font-bold">{totalSales} {$_('Sales Count')}</h3>
  <div slot="description" class="text-md text-muted-foreground">{$_('Active Sales Orders')}</div>
  <div slot="details">
    {#if shippingInProgress > 0}
      <!-- [cp] I wonder how to set a plural message here: does i18n support this out of the box? -->
      <div class="text-sm">{shippingInProgress} {$_('Shipping In Progress')}</div>
    {/if}
    {#if shippingNotStarted > 0}
      <div class="text-sm"><span class="font-bold">{shippingNotStarted}</span> {$_('Shipping Not Started')}</div>
    {/if}
  </div>
</KPICard>
