/**
 * Wait for a given time
 * @param time {number} - Time to wait in milliseconds
 * @returns {Promise<void>} - Resolves after the given time
 */
export async function wait(time: number = 200) {
  return new Promise(resolve => setTimeout(resolve, time))
}
