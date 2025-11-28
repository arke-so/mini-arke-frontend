import { SalesChannelSummaryStatusEnum, SalesChannelSummaryTypeEnum, type SalesChannelSummary } from "$api/sales"

export const DefaultSalesChannel: SalesChannelSummary = Object.freeze({
  id: '',
  name: 'B2B',
  type: SalesChannelSummaryTypeEnum.B2b,
  status: SalesChannelSummaryStatusEnum.Active,
})