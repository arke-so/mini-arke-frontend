import { OfferDetailsStatusEnum, type OfferDetails } from "$api/sales"

export const OffersListType = Object.freeze({
  Active: 'active',
  InProgress: 'in-progress',
  Expired: 'expired',
})

export type OffersListType = (typeof OffersListType)[keyof typeof OffersListType]

export function canAcceptOrRejectOffer(offer: OfferDetails | null): boolean {
  if (!offer) return false

  return offer.status === OfferDetailsStatusEnum.Sent
}

export function canBeMarkedAsSent(offer: OfferDetails | null): boolean {
  if (!offer) return false

  return offer.status === OfferDetailsStatusEnum.Draft
}