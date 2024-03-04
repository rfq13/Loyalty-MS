import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import { generateTransactionCode } from '@expresso/helpers/Formatter'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { Op } from 'sequelize'
import sessionSchema from './schema'
import _ from 'lodash'
import Member from '@database/entities/Member'
import PoinHistory from '@database/entities/PoinHistory'
import Tier from '@database/entities/Tier'
import Program from '@database/entities/Program'

class TrxService {

  /**
   *
   * @param formData
   * @returns
   */
  public static async create(formData: any): Promise<any> {
    const txn = await PoinHistory.sequelize?.transaction()
    const value = sessionSchema.create.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })
    try {

      const newData = _.map(value.items, (item) => {
        return {
          ...value,
          subTotal: item.ItemPrice * item.ItemQty,
        }
      })

      const totalAmount = _.sumBy(newData, 'subTotal')
      const totalQty = _.sumBy(newData, 'ItemQty')

      const trxCode = await generateTransactionCode({
        prefix: 'TRINV',
        type: 'Add Transaction',
      })

      const isFirstTrx = trxCode?.split('-')?.[1] === '0001'

      const trxDetail = {
        totalAmount,
        totalQty,
        items: value.items,
      }

      const member = await Member.findByPk(value.MemberId)
      const tier = await Tier.findOne({
        where: {
          minPoin: {
            [Op.lte]: member?.poin,
          },
          maxPoin: {
            [Op.gte]: member?.poin,
          },
        },
        order: [['minPoin', 'desc']],
        include: [
          {
            model: Program,
            as: 'Programs',
            required: true,
            where: {
              type: 'transaction',
              activity: 'Add Transaction',
              startDate: {
                [Op.lte]: new Date(),
              },
              endDate: {
                [Op.gte]: new Date(),
              },
            },
          }
        ]
      })
      let earnedPoint = 0
      let findProgram = null

      if (tier) {
        findProgram = await _.find(tier.Programs, (program) => {
          const errs = [];

          if(program?.isForFirstTrx && !isFirstTrx) {
            errs.push('First transaction only')
          }

          if(program?.minAmount && program?.minAmount > totalAmount) {
            errs.push('Minimum amount not met')
          }

          if(program?.minQty && program?.minQty > totalQty) {
            errs.push('Minimum quantity not met')
          }

          return errs.length === 0
        })

        if (findProgram) {
          earnedPoint = findProgram.benefitType === 'percentage' ? Math.floor(totalAmount * (findProgram.benefitValue / 100)) : findProgram.benefitValue

          await member?.update({
            poin: member?.poin + earnedPoint
          },{
            transaction: txn
          })
        }
      }


      await PoinHistory.create({
        MemberId: value.MemberId,
        ProgramId: findProgram?.id,
        TrxCode: trxCode,
        type: 'Add Transaction',
        poin: earnedPoint,
        remainingPoin: member?.poin || 0 + earnedPoint,
        detail: JSON.stringify(trxDetail)
      },{
        transaction: txn,
      })

      await txn?.commit()

      return {
        earnedPoint,
        trxCode,
        detail: trxDetail
      }
    } catch (error) {
      await txn?.rollback()
      throw error
    }

  }
}

export default TrxService
