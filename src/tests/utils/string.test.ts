import { camelCaseToSnakeCase, generateStringHash, getNameInitials, snakeCaseToCamelCase, tinyString } from '$utils/string'
import { describe, expect, it } from 'vitest'

describe('tinyString', () => {
  it('should return the original string if its length is less than or equal to max', () => {
    expect(tinyString('hello', 10)).toBe('hello')
  })

  it('should return the truncated string with ellipsis if its length is greater than max', () => {
    expect(tinyString('hello world', 5)).toBe('hello ...')
  })

  it('should return an empty string if the input text is undefined', () => {
    expect(tinyString(undefined, 10)).toBe('')
  })

  it('should handle empty string input correctly', () => {
    expect(tinyString('', 10)).toBe('')
  })
})

describe('getNameInitials', () => {
  it('should return "JD" if the input name is undefined', () => {
    expect(getNameInitials(undefined)).toBe('JD')
  })

  it('should return "JD" if the input name is an empty string', () => {
    expect(getNameInitials('')).toBe('JD')
  })

  it('should return the initials of a single name', () => {
    expect(getNameInitials('John')).toBe('J')
  })

  it('should return the initials of a two-word name', () => {
    expect(getNameInitials('John Doe')).toBe('JD')
  })

  it('should return the initials of a multi-word name', () => {
    expect(getNameInitials('John Michael Doe')).toBe('JM')
  })

  it('should handle names with extra spaces correctly', () => {
    expect(getNameInitials('  John   Doe  ')).toBe('JD')
  })
})

describe('snakeCaseToCamelCase', () => {
  it('should convert snake_case to camelCase', () => {
    expect(snakeCaseToCamelCase('hello_world')).toBe('helloWorld')
  })

  it('should handle multiple underscores correctly', () => {
    expect(snakeCaseToCamelCase('hello_beautiful_world')).toBe('helloBeautifulWorld')
  })

  it('should handle strings with no underscores', () => {
    expect(snakeCaseToCamelCase('hello')).toBe('hello')
  })

  it('should handle strings with dashes', () => {
    expect(snakeCaseToCamelCase('hello-world')).toBe('helloWorld')
  })
})

describe('camelCaseToSnakeCase', () => {
  it('should convert camelCase to snake_case', () => {
    expect(camelCaseToSnakeCase('helloWorld')).toBe('hello_world')
  })

  it('should handle multiple capital letters correctly', () => {
    expect(camelCaseToSnakeCase('helloBeautifulWorld')).toBe('hello_beautiful_world')
  })

  it('should handle strings with no capital letters', () => {
    expect(camelCaseToSnakeCase('hello')).toBe('hello')
  })
})

describe('generateStringHash', () => {
  it('should generate a hash string from input text', () => {
    const hash = generateStringHash('test')
    expect(typeof hash).toBe('string')
    expect(hash.length).toBeGreaterThan(0)
  })

  it('should generate consistent hashes for the same input', () => {
    const hash1 = generateStringHash('test')
    const hash2 = generateStringHash('test')
    expect(hash1).toBe(hash2)
  })

  it('should generate different hashes for different inputs', () => {
    const hash1 = generateStringHash('test1')
    const hash2 = generateStringHash('test2')
    expect(hash1).not.toBe(hash2)
  })
})
