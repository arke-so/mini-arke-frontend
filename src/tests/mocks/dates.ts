import type { DateAttr } from '$api/supply'
import { faker } from '@faker-js/faker'

export function generateDateAttr(dateString?: string): DateAttr {
  return {
    at: dateString ? new Date(dateString) : faker.date.past(),
    by: {
      id: faker.string.uuid(),
      fullName: faker.person.fullName(),
      username: faker.internet.username(),
    },
  }
}
