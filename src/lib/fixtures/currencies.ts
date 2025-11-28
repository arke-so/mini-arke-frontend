import type { ExtendedOption } from '$utils/generics'

export const DEFAULT_CURRENCY_CODE = 'EUR'

export const currencies: Array<ExtendedOption> = [
  { label: '€ (EUR)', value: 'EUR', attr: { displayed: '€' } },
  { label: '$ (USD)', value: 'USD', attr: { displayed: '$' } },
  { label: '£ (GBP)', value: 'GBP', attr: { displayed: '£' } },
  { label: '¥ (JPY)', value: 'JPY', attr: { displayed: '¥' } },
  { label: '₹ (INR)', value: 'INR', attr: { displayed: '₹' } },
  { label: '₩ (KRW)', value: 'KRW', attr: { displayed: '₩' } },
  { label: '₽ (RUB)', value: 'RUB', attr: { displayed: '₽' } },
  { label: '₺ (TRY)', value: 'TRY', attr: { displayed: '₺' } },
  { label: 'R$ (BRL)', value: 'BRL', attr: { displayed: 'R$' } },
  { label: 'C$ (CAD)', value: 'CAD', attr: { displayed: 'C$' } },
  { label: 'A$ (AUD)', value: 'AUD', attr: { displayed: 'A$' } },
  { label: 'CHF (CHF)', value: 'CHF', attr: { displayed: 'CHF' } },
  { label: 'HK$ (HKD)', value: 'HKD', attr: { displayed: 'HK$' } },
  { label: 'NZ$ (NZD)', value: 'NZD', attr: { displayed: 'NZ$' } },
  { label: 'SGD (SGD)', value: 'SGD', attr: { displayed: 'SGD' } },
]

export const currenciesMap = currencies.reduce<{ [key: string]: ExtendedOption }>((acc, currency) => {
  acc[currency.value] = currency
  return acc
}, {})
