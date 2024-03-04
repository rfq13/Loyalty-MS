/* eslint-disable prettier/prettier */
import 'dotenv/config'

function validateBoolean(value: string | boolean | number | any): boolean {
  const invalidValues = [
    null,
    undefined,
    '',
    false,
    0,
    'false',
    '0',
    'null',
    'undefined',
  ]

  if (invalidValues.includes(value)) {
    return false
  }

  return true
}

// node env
export const NODE_ENV = process.env.NODE_ENV ?? 'development'

// app
export const APP_URL = process.env.APP_URL
export const APP_KEY = process.env.APP_KEY
export const APP_NAME = process.env.APP_NAME ?? 'Loyalty-MS'
export const APP_LANG = process.env.APP_LANG ?? 'id'
export const APP_PORT = Number(process.env.APP_PORT) ?? 3011

// rate limit request
export const RATE_LIMIT = Number(process.env.RATE_LIMIT) ?? 100

// jwt access
export const JWT_SECRET: any = process.env.JWT_SECRET

export const JWT_ACCESS_TOKEN_EXPIRED = process.env.JWT_ACCESS_TOKEN_EXPIRED ?? '1d'
export const JWT_REFRESH_TOKEN_EXPIRED =
  process.env.JWT_REFRESH_TOKEN_EXPIRED ?? '7d'


// database
export const DB_CONNECTION = process.env.DB_CONNECTION ?? 'mysql'
export const DB_HOST = process.env.DB_HOST ?? '127.0.0.1'
export const DB_PORT = Number(process.env.DB_PORT) ?? 3306
export const DB_DATABASE = process.env.DB_DATABASE ?? 'Loyalty-MS'
export const DB_USERNAME = process.env.DB_USERNAME ?? 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD ?? 'root'
export const DB_SYNC = validateBoolean(process.env.DB_SYNC) ?? false
export const DB_TIMEZONE = process.env.DB_TIMEZONE ?? '+07:00' // for mysql = +07:00, for postgres = Asia/Jakarta

// redis
export const REDIS_HOST = process.env.REDIS_HOST ?? '127.0.0.1'
export const REDIS_PORT = Number(process.env.REDIS_PORT) ?? 6379
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? undefined
