import { parseJSON, stringifyJSON } from '$utils/json'
import { describe, expect, it } from 'vitest'

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

describe('json.ts', () => {
  describe('parseJSON', () => {
    it('Should correctly parse a JSON string into an object', () => {
      const jsonString = stringifyJSON(EXAMPLE_OBJECT)

      expect(parseJSON<ExampleType>(jsonString)).toStrictEqual(EXAMPLE_OBJECT)
    })

    it('Should return null, when receiving a broken JSON string', () => {
      expect(parseJSON<ExampleType>(BROKEN_JSON_STRING)).toEqual(null)
    })

    it('Should return null, when receiving a falsey object', () => {
      expect(parseJSON<ExampleType>(null)).toEqual(null)
    })
  })

  describe('stringifyJSON', () => {
    it('Should correctly stringify an object into a JSON string', () => {
      expect(stringifyJSON(EXAMPLE_OBJECT)).toEqual(EXAMPLE_OBJECT_STRING)
    })

    it('Should return null, when receiving a falsey object', () => {
      expect(stringifyJSON(null)).toEqual(null)
      expect(stringifyJSON(undefined)).toEqual(null)
    })
  })
})
