import { LOG_SERVER } from '@config/baseURL'
import { i18nConfig } from '@config/i18nextConfig'
import { ReqOptions } from '@expresso/interfaces/ReqOptions'
import ResponseError from '@expresso/modules/Response/ResponseError'
import chalk from 'chalk'
import { TOptions } from 'i18next'
import _ from 'lodash'
import { validate as uuidValidate } from 'uuid'
import { customDateFormat } from './Date'
import PoinHistory from '@database/entities/PoinHistory'
import { Op } from 'sequelize'

/**
 *
 * @param arrayData
 * @returns
 */
function arrayFormatter(arrayData: string | string[]): any[] {
  // check if data not empty
  if (!_.isEmpty(arrayData)) {
    // check if data is array, format: ['1', '2']
    if (Array.isArray(arrayData)) {
      return arrayData
    }

    // format: "['1', '2']"
    const parseJsonArray = JSON.parse(arrayData)
    if (Array.isArray(parseJsonArray)) {
      return parseJsonArray
    }

    return []
  }

  return []
}

/**
 *
 * @param value
 * @returns
 */
function validateEmpty(value: any): any {
  const emptyValues = [null, undefined, '', 'null', 'undefined']

  if (emptyValues.includes(value)) {
    return null
  }

  return value
}

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

/**
 *
 * @param value
 * @param options
 * @returns
 */
function validateUUID(value: string, options?: ReqOptions): string {
  const i18nOpt: string | TOptions = { lng: options?.lang }

  if (!uuidValidate(value)) {
    const message = i18nConfig.t('errors.incorrect_UUID_format', i18nOpt)
    throw new ResponseError.BadRequest(message)
  }

  return value
}

/**
 *
 * @param length
 * @returns
 */
function getUniqueCodev2(length = 32): string {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

interface GenerateTransactionCode {
  prefix: 'TRINV' | 'TRMGM' | 'TRACT',
  type: 'Add Transaction' | 'Redeem Poin' | 'Member Get Member' | 'Member Activity' | 'Birthday Bonus'
}

async function generateTransactionCode(
  { prefix, type }: GenerateTransactionCode
): Promise<string> {
  const prefixList = ['TRINV', 'TRMGM', 'TRACT']
  if (!prefixList.includes(prefix)) {
    throw new Error('Invalid prefix')
  }

  const noUrut = await PoinHistory.count({
    where: {
      type,
    },
  })

  // no urut, ex: 0001
  const noUrutStr = (noUrut + 1).toString().padStart(4, '0')

  const date = customDateFormat(new Date(), 'ddMMyyyy')

  return `${type}-${noUrutStr}-${date}`
}

/**
 *
 * @param type
 * @param message
 * @returns
 */
function logServer(type: string, message: string): string {
  const logErr = `${LOG_SERVER} ${chalk.blue(type)} ${chalk.green(message)}`
  return logErr
}

/**
 *
 * @param type
 * @param message
 * @returns
 */
function logErrServer(type: string, message: string): string {
  const logErr = `${LOG_SERVER} ${chalk.red(type)} ${chalk.green(message)}`
  return logErr
}

export {
  arrayFormatter,
  validateEmpty,
  validateBoolean,
  validateUUID,
  getUniqueCodev2,
  logServer,
  logErrServer,
  generateTransactionCode
}
