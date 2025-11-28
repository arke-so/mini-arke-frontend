export const Products = Object.freeze({
  Product: 'products',
  SemiFinished: 'semi-finished',
})

export type ProductsType = (typeof Products)[keyof typeof Products]

export const TransportDocument = Object.freeze({
  Inbound: 'inbound',
  Outbound: 'outbound',
})

export type TransportDocumentType = (typeof TransportDocument)[keyof typeof TransportDocument]