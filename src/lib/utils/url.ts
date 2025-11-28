export function isValidReturnURL(returnURL: string, currentHostname: string): boolean {
  try {
    const url = new URL(returnURL)

    return url.hostname === currentHostname
  } catch {
    return false
  }
}
