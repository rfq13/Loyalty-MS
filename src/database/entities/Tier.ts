import {
  BelongsToMany,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript'
import BaseEntity from './Base'
import ProgramTier from './ProgramTier'
import Program from './Program'

interface TierEntity {
  id?: string
  name: string
  minPoin: number
  maxPoin: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type TierAttributes = Omit<
  TierEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'Tiers' })
class Tier extends BaseEntity {

  @Column({ type: DataType.STRING })
  name: string

  @Column({ type: DataType.INTEGER })
  minPoin: number

  @Column({ type: DataType.INTEGER })
  maxPoin: number

  @BelongsToMany(() => Program, () => ProgramTier)
  Programs: Program[]
}

export default Tier
