import { getRequestContext } from '$root/src/lib/server/request-context'
import { RouteQueryParam } from '$utils/routes'
import { describe, expect, it } from 'vitest'
import { createRequestEvent } from '../mocks/request'

type ExampleType = {
  id: number
  name: string
  categories: string[]
}

const EXAMPLE_OBJECT: ExampleType = {
  id: 1,
  name: 'Foobar',
  categories: ['category-1', 'category-2'],
}
const EXAMPLE_OBJECT_STRING = JSON.stringify(EXAMPLE_OBJECT)
const BROKEN_JSON_STRING = EXAMPLE_OBJECT_STRING.substring(EXAMPLE_OBJECT_STRING.length - 1)
const CLONE_ID = 'test-clone-id'

describe('request-context.ts', () => {
  describe('context.inputPayload', () => {
    it('Should extract the proper object passed through the request', async () => {
      const requestEvent = createRequestEvent({ inputPayload: EXAMPLE_OBJECT })
      const requestContext = await getRequestContext<ExampleType>(requestEvent)

      expect(requestContext.inputPayload).toStrictEqual(EXAMPLE_OBJECT)
    })

    it('Should return null when no object is passed', async () => {
      const requestEvent = createRequestEvent({})
      const requestContext = await getRequestContext<ExampleType>(requestEvent)

      expect(requestContext.inputPayload).toBe(null)
    })

    it('Should return null when an invalid JSON is passed', async () => {
      const requestEvent = createRequestEvent({})
      requestEvent.url.searchParams.set(RouteQueryParam.InputPayload, BROKEN_JSON_STRING)
      const requestContext = await getRequestContext<ExampleType>(requestEvent)

      expect(requestContext.inputPayload).toBe(null)
    })
  })

  describe('context.cloneId', () => {
    it('Should extract the proper cloneId passed through the request', async () => {
      const requestEvent = createRequestEvent({ cloneId: CLONE_ID })
      const requestContext = await getRequestContext(requestEvent)

      expect(requestContext.cloneId).toEqual(CLONE_ID)
    })

    it('Should return null when no object is passed', async () => {
      const requestEvent = createRequestEvent({})
      const requestContext = await getRequestContext<ExampleType>(requestEvent)

      expect(requestContext.cloneId).toBe(null)
    })
  })
})
