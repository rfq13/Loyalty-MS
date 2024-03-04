import ResponseError from '@expresso/modules/Response/ResponseError'
import sessionSchema from './schema'
import _ from 'lodash'
import Member from '@database/entities/Member'
import PoinHistory from '@database/entities/PoinHistory'
import { Request } from 'express'
import { APP_LANG } from '@config/env'
import { TOptions } from 'i18next'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import Program from '@database/entities/Program'
import Tier from '@database/entities/Tier'
import { Op } from 'sequelize'
import excelJS from 'exceljs'
import { Response } from 'express'

class PoinService {

  /**
   *
   * @param formData
   * @returns
   */
  public static async redeem(formData: any): Promise<any> {
    const txn = await PoinHistory.sequelize?.transaction()
    try {
      const value = sessionSchema.redeem.validateSync(formData, {
        abortEarly: false,
        stripUnknown: true,
      })

      const member = await Member.findByPk(value.MemberId)

      if (!member) throw new ResponseError.NotFound('Member not found')

      if (member?.poin < value.redeemPoin) {
        throw new ResponseError.BadRequest('Poin is not enough')
      }

      await member?.update({
        poin: member?.poin - value.redeemPoin,
      },{
        transaction: txn,
      })

      const poinHistory = await PoinHistory.create({
        MemberId: value.MemberId,
        poin: -value.redeemPoin,
        remainingPoin: member.poin - value.redeemPoin,
        detail: -value.redeemPoin + ' poin redeemed',
      },{
        transaction: txn,
        returning: true,
      })

      await txn?.commit()

      return poinHistory
    } catch (error: any) {
      await txn?.rollback()
      throw new ResponseError.InternalServer(error.message)
    }
  }

  public static async reportEarned(req: Request): Promise<any> {
    const { lang } = req.getQuery()

    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      PoinHistory,
      [
        {
          model: Member,
          as: 'Member',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: Program,
          as: 'Program',
          include: [
            {
              model: Tier,
              as: 'Tiers',
            },
          ],
        }
      ]
    )

    queryFind.where = {
      ...queryFind.where,
      poin: {
        [Op.gt]: 0,
      },
    }

    const data = await PoinHistory.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await PoinHistory.count({
      include: includeCount,
      where: queryFind.where,
    })

    return {
      data,
      total,
      message: `${total} Report earned poin found`,
    }
  }

  public static async reportRedeemed(req: Request): Promise<any> {
    const { lang } = req.getQuery()

    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      PoinHistory,
      [
        {
          model: Member,
          as: 'Member',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: Program,
          as: 'Program',
          include: [
            {
              model: Tier,
              as: 'Tiers',
            },
          ],
        }
      ]
    )

    queryFind.where = {
      ...queryFind.where,
      poin: {
        [Op.lt]: 0,
      },
    }

    const data = await PoinHistory.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await PoinHistory.count({
      include: includeCount,
      where: queryFind.where,
    })

    return {
      data,
      total,
      message: `${total} Report redeemed poin found`,
    }
  }

  public static async exportExcel(data: PoinHistory, res: Response): Promise<any> {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    worksheet.columns = [
      {
        header: 'Member',
        key: 'memberName',
      },
      {
        header: 'Program',
        key: 'programName',
      },
      {
        header: 'Tier',
        key: 'tierName',
      },
      {
        header: 'Poin',
        key: 'poin',
      },
      {
        header: 'Detail',
        key: 'detail',
      },
      {
        header: 'Remaining Poin',
        key: 'remainingPoin',
      },
      {
        header: 'Created At',
        key: 'createdAt',
      },
      {
        header: 'Updated At',
        key: 'updatedAt',
      },
    ]

    _.forEach(data, (item) => {
      worksheet.addRow({
        memberName: item.Member?.name,
        programName: item.Program?.name,
        tierName: item.Program?.Tiers?.[0]?.name ?? '-',
        poin: item.poin,
        detail: item.detail,
        remainingPoin: item.remainingPoin,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })
    })

    const fileName = `Report Poin ${new Date().toISOString()}.xlsx`
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    workbook.xlsx.write(res).then(function () {
      res.end();
    })
  }
}

export default PoinService
