export const Domain = Object.freeze({
  Material: 'raw_material',
  Product: 'product',
  PurchasableProductSupplierReference: 'purchasable_product_supplier_reference',
  Bundle: 'bundle',
  Supplier: 'supplier',
  Customer: 'customer',
  CustomerSingleOffer: 'customer_single_offer',
  PurchaseOrder: 'purchase_order',
  PurchaseOrderTransportDocument: 'purchase_transport_document',
  SalesOrder: 'sales_order',
  SalesOrderQuote: 'sales_order_quote',
  SalesOffer: 'sales_offer',
  SalesOrderTransportDocument: 'sales_transport_document',
  OutboundTransportDocument: 'outbound_transport_document',
  InboundTransportDocument: 'inbound_transport_document'
})

export type DomainType = (typeof Domain)[keyof typeof Domain]

export const Service = Object.freeze({
  Supply: 'supply',
  Sales: 'sales',
  Product: 'product',
})

export type ServiceType = (typeof Service)[keyof typeof Service]
