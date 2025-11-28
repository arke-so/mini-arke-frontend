import { DefaultSalesChannel } from '$fixtures/channels'
import { parseJSON } from '$utils/json'
import { RouteQueryParam } from '$utils/routes'
import type { RequestEvent } from '@sveltejs/kit'

type ArkeRequestContext<T> = {
  cloneId: string | null
  inputPayload: T | null
  salesChannelId: string | undefined
}

export async function getRequestContext<T = unknown>(event: RequestEvent): Promise<ArkeRequestContext<T>> {
  const cloneId = event.url.searchParams.get(RouteQueryParam.CloneId)
  const inputPayloadRaw = event.url.searchParams.get(RouteQueryParam.InputPayload)
  const inputPayload = parseJSON<T>(inputPayloadRaw)
  const salesChannelId = ((event.url.searchParams.get(RouteQueryParam.SalesChannelId) !== null || event.url.searchParams.get(RouteQueryParam.SalesChannelId) === '') ? 
    event.url.searchParams.get(RouteQueryParam.SalesChannelId) 
    : event.cookies.get(RouteQueryParam.SalesChannelId)) ?? DefaultSalesChannel.id

  return {
    cloneId,
    inputPayload,
    salesChannelId,
  }
}

export function saveSalesChannelId(event: RequestEvent, salesChannelId: string | undefined) {
  if (salesChannelId === undefined) return

  event.cookies.set(RouteQueryParam.SalesChannelId, salesChannelId, {
    httpOnly: true,
    path: '/',
    secure: false,
  })
}