
import { generateTransactionCode, validateUUID } from '@expresso/helpers/Formatter'
import { DtoFindAll } from '@expresso/interfaces/Paginate'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { Op } from 'sequelize'
import communitySchema from './schema'
import Member from '@database/entities/Member'
import _ from 'lodash'
import Tier from '@database/entities/Tier'
import Program from '@database/entities/Program'
import PoinHistory from '@database/entities/PoinHistory'

interface DtoPaginate extends DtoFindAll {
  data: any[]
}

class CommunityService {

  /**
   *
   * @param formData
   * @returns
   */
  public static async addMember(formData: any): Promise<any> {
    let earnedPoint = 0
    let findProgram = null
    let trxCode = ''

    const value = communitySchema.addMember.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const txn = await PoinHistory.sequelize?.transaction()

    try {

      const member = value?.MemberId ? await Member.findByPk(value?.MemberId) : null
      if(member){
        trxCode = await generateTransactionCode({
          prefix: 'TRMGM',
          type: 'Member Get Member',
        })

        const tier = await Tier.findOne({
          where: {
            minPoin: {
              [Op.lte]: member?.poin,
            },
            maxPoin: {
              [Op.gte]: member?.poin,
            },
          },
          include: [
            {
              model: Program,
              as: 'Programs',
              required: true,
              where: {
                type: 'community',
                activity: 'Member Get Member',
                benefitType: 'fixed',
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

        if (tier) {
          findProgram = tier?.Programs?.[0]

          if (findProgram) {
            earnedPoint = findProgram.benefitValue

            await member?.update({
              poin: member?.poin + earnedPoint
            },{
              transaction: txn
            })
          }
        }
      }

      const newMember = await Member.bulkCreate(value.persons, {
        returning: true
      })
      if(member){
        await PoinHistory.create({
          MemberId: member.id,
          ProgramId: findProgram?.id,
          TrxCode: trxCode,
          type: 'Member Get Member',
          poin: earnedPoint,
          remainingPoin: member?.poin + earnedPoint,
          detail: JSON.stringify(value.persons),
        },{
          transaction: txn,
        })
      }

      await txn?.commit()

      return newMember
    } catch (error: any) {
      await txn?.rollback()
      throw new ResponseError.InternalServer(error?.message)
    }


  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async addActivity(formData: any): Promise<any> {
    let earnedPoint = 0
    let findProgram = null
    let trxCode = ''


    const txn = await PoinHistory.sequelize?.transaction()
    const value = communitySchema.addActivity.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    try {

      const member = await Member.findByPk(value.MemberId)

      if(!member){
        throw new ResponseError.NotFound('Member not found')
      }

      trxCode = await generateTransactionCode({
        prefix: 'TRACT',
        type: 'Member Activity',
      })

      const tier = await Tier.findOne({
        where: {
          minPoin: {
            [Op.lte]: member?.poin || 0,
          },
          maxPoin: {
            [Op.gte]: member?.poin || 0,
          },
        },
        include: [
          {
            model: Program,
            as: 'Programs',
            required: true,
            where: {
              type: 'community',
              activity: 'Member Activity',
              benefitType: 'fixed',
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

      if (tier) {
        findProgram = tier?.Programs?.[0]

        if (findProgram) {
          earnedPoint = findProgram.benefitValue

          await member?.update({
            poin: member?.poin + earnedPoint
          },{
            transaction: txn
          })
        }
      }

      const newData = await PoinHistory.create({
        MemberId: member.id,
        ProgramId: findProgram?.id,
        TrxCode: trxCode,
        type: 'Member Get Member',
        poin: earnedPoint,
        remainingPoin: member?.poin + earnedPoint,
        detail: value.name,
      },{
        transaction: txn,
        returning: true
      })

      await txn?.commit()

      return newData
    } catch (error: any) {
      console.log(error)
      await txn?.rollback()
      throw new ResponseError.InternalServer(error?.message)
    }
  }
}

export default CommunityService
