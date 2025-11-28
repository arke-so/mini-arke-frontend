import type { DateAttr } from '$api/supply'
import { getDateFormatter } from 'svelte-i18n'

export const DEFAULT_LOCALE = 'it-IT'

export const DateFormatConfig = {
  Default: {
    year: 'numeric' as 'numeric',
    month: 'short' as 'short',
    day: 'numeric' as 'numeric',
  },
  Short: {
    year: 'numeric' as 'numeric',
    month: '2-digit' as '2-digit',
    day: '2-digit' as '2-digit',
  },
  Long: {
    year: 'numeric' as 'numeric',
    month: 'short' as 'short',
    day: '2-digit' as '2-digit',
    weekday: 'short' as 'short',
  },
  DateTime: {
    year: 'numeric' as 'numeric',
    month: '2-digit' as '2-digit',
    day: '2-digit' as '2-digit',
    hour: '2-digit' as '2-digit',
    minute: '2-digit' as '2-digit',
  },
  MonthYear: {
    year: 'numeric' as 'numeric',
    month: 'long' as 'long',
  },
}

export function renderDate(date: Date | string, format: Intl.DateTimeFormatOptions = DateFormatConfig.Default) {
  if (!date) return
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return getDateFormatter(format).format(dateObj)
}

export function renderDateTime(date: Date | string) {
  return renderDate(date, DateFormatConfig.DateTime)
}

export function renderMonthYear(date: Date | string) {
  return renderDate(date, DateFormatConfig.MonthYear)
}

export function renderCreatedAtDate(created: DateAttr | undefined) {
  return renderDate(created?.at as Date)
}

function cleanupDatestring(date: Date | string) {
  if (typeof date !== 'string') return date

  return date.substring(0, date.match(/ m=\+/)?.index || undefined)
}

export function renderDateMonthYear(date: Date | string, language: string = DEFAULT_LOCALE): string {
  if (!date) return '--'
  
  date = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat(language, DateFormatConfig.MonthYear).format(date)
}
