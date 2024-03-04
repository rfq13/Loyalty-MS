import chalk from 'chalk'
import {
  APP_URL,
} from './env'

export const LOG_SERVER = chalk.green('[server]')

// @ts-expect-error
const BASE_URL_SERVER: string = APP_URL

export { BASE_URL_SERVER }
