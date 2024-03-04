import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Table,
} from 'sequelize-typescript'
import BaseEntity from './Base'
import Tier from './Tier'
import ProgramTier from './ProgramTier'

interface ProgramEntity {
  id?: string
  name: string
  type: 'transaction' | 'community'
  minAmount?: number
  minQty?: number
  isForFirstTrx?: boolean
  benefitType: 'percentage' | 'fixed'
  activity: 'Add Transaction' | 'Member Get Member' | 'Member Activity' | 'Birthday Bonus'
  maxPoin?: number
  benefitValue: number
  startDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type ProgramAttributes = Omit<
  ProgramEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'Programs' })
class Program extends BaseEntity {

  @Column({ type: DataType.STRING })
  name: string

  @Column({ type: DataType.ENUM('transaction', 'community') })
  type: 'transaction' | 'community'

  @Column({ type: DataType.INTEGER })
  minAmount: number

  @Column({ type: DataType.INTEGER })
  minQty: number

  @Column({ type: DataType.BOOLEAN })
  isForFirstTrx: boolean

  @Column({ type: DataType.ENUM('percentage', 'fixed') })
  benefitType: 'percentage' | 'fixed'

  @Column({ type: DataType.ENUM('Add Transaction', 'Member Get Member', 'Member Activity', 'Birthday Bonus') })
  activity: 'Add Transaction' | 'Member Get Member' | 'Member Activity' | 'Birthday Bonus'

  @Column({ type: DataType.INTEGER })
  maxPoin: number

  @Column({ type: DataType.INTEGER })
  benefitValue: number

  @Column({ type: DataType.DATE })
  startDate: Date

  @Column({ type: DataType.DATE })
  endDate: Date

  @BelongsToMany(() => Tier, () => ProgramTier)
  Tiers: Tier[]
}

export default Program
