import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import Tier, { TierAttributes } from '@database/entities/Tier'
import { validateUUID } from '@expresso/helpers/Formatter'
import { DtoFindAll } from '@expresso/interfaces/Paginate'
import { ReqOptions } from '@expresso/interfaces/ReqOptions'
import ResponseError from '@expresso/modules/Response/ResponseError'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import { TOptions } from 'i18next'
import TierSchema from './schema'

interface DtoPaginate extends DtoFindAll {
  data: Tier[]
}

class TierService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoPaginate> {
    const { lang } = req.getQuery()

    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Tier,
      []
    )

    const data = await Tier.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await Tier.count({
      include: includeCount,
      where: queryFind.where,
    })

    const message = i18nConfig.t('success.data_received', i18nOpt)
    return { message: `${total} ${message}`, data, total }
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findById(
    id: string,
    options?: ReqOptions
  ): Promise<Tier> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await Tier.findOne({
      where: { id: newId },
      paranoid: options?.isParanoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.not_found', i18nOpt)
      throw new ResponseError.NotFound(`Tier ${message}`)
    }

    return data
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async create(formData: TierAttributes): Promise<Tier> {
    const value = TierSchema.create.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const data = await Tier.create(value, {
      returning: true,
    })

    return data
  }

  public static async update(
    id: string,
    formData: TierAttributes
  ): Promise<any> {
    const value = TierSchema.update.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const data = await this.findById(id)
    await data.update(value)

    return data
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async delete(id: string, options?: ReqOptions): Promise<void> {
    const data = await this.findById(id, { ...options })
    await Tier.destroy({ where: { id: data.id } })
  }
}

export default TierService
