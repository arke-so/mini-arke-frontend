import { renderCreatedAtDate, renderDate, renderDateTime } from '$lib/utils/dates'
import { locale } from 'svelte-i18n'
import { beforeEach, describe, expect, it } from 'vitest'
import { generateDateAttr } from '../mocks/dates'

describe('dates.ts', () => {
  beforeEach(() => {
    locale.set('it-IT')
  })

  describe('renderDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-10-05T14:48:00.000Z')
      const formattedDate = renderDate(date)
      expect(formattedDate).toBe('5 ott 2023')
    })

    it('should format date correctly with different locale', () => {
      locale.set('de-DE')
      const date = new Date('2023-10-05T14:48:00.000Z')
      const formattedDate = renderDate(date)
      expect(formattedDate).toBe('5. Okt. 2023')
    })
  })

  describe('renderDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2023-10-05T14:48:00.000Z')
      const formattedDateTime = renderDateTime(date)
      expect(formattedDateTime).toBe('05/10/2023, 14:48')
    })

    it('should format date and time correctly with different locale', () => {
      locale.set('de-DE')
      const date = new Date('2023-10-05T14:48:00.000Z')
      const formattedDateTime = renderDateTime(date)
      expect(formattedDateTime).toBe('05.10.2023, 14:48')
    })
  })

  describe('renderCreatedAtDate', () => {
    it('should format created date correctly', () => {
      const created = generateDateAttr('2023-10-05T14:48:00.000Z')
      const formattedCreatedAtDate = renderCreatedAtDate(created)
      expect(formattedCreatedAtDate).toBe('5 ott 2023')
    })

    it('should return undefined if created date is undefined', () => {
      const formattedCreatedAtDate = renderCreatedAtDate(undefined)
      expect(formattedCreatedAtDate).toBeUndefined()
    })

    it('should format created date correctly with different locale', () => {
      locale.set('de-DE')
      const created = generateDateAttr('2023-10-05T14:48:00.000Z')
      const formattedCreatedAtDate = renderCreatedAtDate(created)
      expect(formattedCreatedAtDate).toBe('5. Okt. 2023')
    })
  })
})
