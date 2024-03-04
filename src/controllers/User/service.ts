import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
// import Role from '@database/entities/Role'
import User from '@database/entities/User'
import {
  validateUUID,
} from '@expresso/helpers/Formatter'
import { DtoFindAll } from '@expresso/interfaces/Paginate'
import { ReqOptions } from '@expresso/interfaces/ReqOptions'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { Request } from 'express'
import { TOptions } from 'i18next'
import _, { values } from 'lodash'

interface DtoPaginate extends DtoFindAll {
  data: User[]
}

class UserService {

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findById(
    id: string,
    options?: ReqOptions,
    roleId?: string,
    withPassword?: boolean
  ): Promise<User> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    let include = undefined

    let scope = undefined
    if (withPassword) {
      scope = 'withPassword'
    }

    const data = await User.scope(scope).findOne({
      where: { id: newId },
      include, //including,
      paranoid: options?.isParanoid,
      attributes: options?.attributes
        ? ['id', ...JSON.parse(options?.attributes || '[]')]
        : undefined,
    })

    if (!data) {
      const message = i18nConfig.t('errors.not_found', i18nOpt)
      throw new ResponseError.NotFound(`user ${message}`)
    }

    return data
  }
}

export default UserService
