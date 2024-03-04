import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Table,
} from 'sequelize-typescript'
import BaseEntity from './Base'
import Member from './Member'
import Program from './Program'

interface PoinHistoryEntity {
  id?: string
  TrxCode: string
  poin: number
  type: 'Add Transaction' | 'Redeem Poin' | 'Member Get Member' | 'Member Activity' | 'Birthday Bonus'
  MemberId: string
  remainingPoin: number
  ProgramId?: string
  detail: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type PoinHistoryAttributes = Omit<
  PoinHistoryEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'PoinHistories' })
class PoinHistory extends BaseEntity {
  @IsUUID(4)
  @ForeignKey(() => Member)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  MemberId: string

  @BelongsTo(() => Member)
  Member: Member

  @IsUUID(4)
  @ForeignKey(() => Program)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  ProgramId: string

  @BelongsTo(() => Program)
  Program: Program

  @Column({ type: DataType.STRING })
  TrxCode: string

  @Column({ type: DataType.INTEGER })
  poin: number

  @Column({ type: DataType.INTEGER })
  remainingPoin: number

  @Column({ type: DataType.ENUM('Add Transaction', 'Redeem Poin', 'Member Get Member', 'Member Activity', 'Birthday Bonus') })
  type: 'Add Transaction' | 'Redeem Poin' | 'Member Get Member' | 'Member Activity' | 'Birthday Bonus'

  @Column({ type: DataType.STRING })
  detail: string
}

export default PoinHistory
