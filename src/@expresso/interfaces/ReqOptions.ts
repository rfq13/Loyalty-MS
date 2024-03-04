import User from '@database/entities/User'
import { Request } from 'express'

export interface ReqOptions {
  lang?: string
  isParanoid?: boolean
  isForce?: boolean
  attributes?: string
  where?: any
  transaction?: any
  currentUser?: User
  req?: Request
}
