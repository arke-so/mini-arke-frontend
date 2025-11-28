import { dev } from '$app/environment'
import pino from 'pino'

let options: pino.LoggerOptions = {
  level: 'info',
  formatters: {
    bindings: bindings => ({ pid: bindings.pid, host: bindings.hostname }),
    level: label => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
}

if (dev) {
  options = {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }
}

export const SERVICE_NAME = 'arke-frontend'
export const logger = pino(options)
