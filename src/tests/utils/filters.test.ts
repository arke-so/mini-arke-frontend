import { createQueryRequestObject, DEFAULT_ITEMS_LIMIT, getQueryFromURL, isQueryActive } from '$utils/filters'
import { describe, expect, it } from 'vitest'

describe('filters.ts', () => {
  it('Should correctly extract a query object from the URL', () => {
    const url = new URL('http://localhost:3000/?search=hello')
    const query = getQueryFromURL(url)

    expect(query.search).toBe('hello')
  })

  it('Should correctly extract a query object from the URL with no search parameter', () => {
    const url = new URL('http://localhost:3000/')
    const query = getQueryFromURL(url)

    expect(query.search).toBe(undefined)
  })

  it('Should tell the query is active when search is present', () => {
    const query = { search: 'hello' }

    expect(isQueryActive(query)).toBe(true)
  })

  it('Should tell the query is not active when search is not present', () => {
    const query = { search: '' }

    expect(isQueryActive(query)).toBe(false)
  })

  it('Should create a request object from the query', () => {
    const query = { search: 'hello' }

    expect(createQueryRequestObject(query)).toEqual({ search: 'hello', limit: DEFAULT_ITEMS_LIMIT })
  })
})
