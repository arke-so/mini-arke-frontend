/**
 * Validate email
 * @param value {string} - Email value
 * @returns {boolean} - True if email is valid
 */
export function isValidEmail(value: string): boolean {
  return /^[a-zA-Z0-9][^\s@]*@[^\s@]+\.[^\s@]+$/.test(value)
}

/**
 * Validate URL
 * @param value {string} - URL value
 * @returns {boolean} - True if URL is valid
 */
export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
