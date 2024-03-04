import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import Program, { ProgramAttributes } from '@database/entities/Program'
import { validateUUID } from '@expresso/helpers/Formatter'
import { DtoFindAll } from '@expresso/interfaces/Paginate'
import { ReqOptions } from '@expresso/interfaces/ReqOptions'
import ResponseError from '@expresso/modules/Response/ResponseError'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import { TOptions } from 'i18next'
import ProgramSchema from './schema'
import Tier from '@database/entities/Tier'

interface DtoPaginate extends DtoFindAll {
  data: Program[]
}

class ProgramService {
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
      Program,
      [
        {
          model: Tier,
          as: 'Tiers',
        }
      ]
    )

    const data = await Program.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await Program.count({
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
  ): Promise<Program> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await Program.findOne({
      where: { id: newId },
      paranoid: options?.isParanoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.not_found', i18nOpt)
      throw new ResponseError.NotFound(`Program ${message}`)
    }

    return data
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async create(formData: ProgramAttributes): Promise<Program> {
    const value = ProgramSchema.create.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const data = await Program.create(value, {
      returning: true,
    })

    // set Tiers
    await data.$set('Tiers', value.Tiers)

    return data
  }

  public static async update(
    id: string,
    formData: ProgramAttributes
  ): Promise<any> {
    const value = ProgramSchema.update.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const data = await this.findById(id)
    await data.update(value)

    if (value.Tiers?.length) {
      await data.$set('Tiers', value.Tiers)
    }

    return data
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async delete(id: string, options?: ReqOptions): Promise<void> {
    const data = await this.findById(id, { ...options })
    await Program.destroy({ where: { id: data.id } })
  }
}

export default ProgramService
