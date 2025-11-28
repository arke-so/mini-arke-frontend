import { OrderDetailsStatusEnum, type OrderDetails } from "$api/sales";

export function generateSalesOrder(overrides?: Partial<OrderDetails>): OrderDetails {
  return {
    id: 'order-123',
    customerId: 'customer-456',
    status: OrderDetailsStatusEnum.Accepted,
    expectedShippingTime: new Date(),
    shippingAddress: '123 Main St, Anytown, USA',
    total: 1000,
    totalVatIncl: 1200,
    version: 1,
    products: [
      {
        name: 'Product 1',
        quantity: 2,
        extraId: 'prod-001',
        uom: 'unit',
        id: 'item-001',
        meta: {},
        orderId: 'order-123',
        prices: {
          currency: 'EUR',
          unit: 10,
          deals: [],
          vat: 22,
        },
      },
    ],
    ...overrides
  }
}