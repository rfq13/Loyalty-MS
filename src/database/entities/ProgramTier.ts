import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript'
import BaseEntity from './Base'
import Tier from './Tier'
import Program from './Program'

interface ProgramTierEntity {
  id?: string
  ProgramId: string
  TierId: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type ProgramTierAttributes = Omit<
  ProgramTierEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'ProgramTiers' })
class ProgramTier extends BaseEntity {

  @ForeignKey(() => Tier)
  @Column({ type: DataType.STRING })
  TierId: string

  @BelongsTo(() => Tier)
  Tier: Tier

  @ForeignKey(() => Program)
  @Column({ type: DataType.STRING })
  ProgramId: string

  @BelongsTo(() => Program)
  Program: Program
}

export default ProgramTier
