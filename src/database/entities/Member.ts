import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript'
import BaseEntity from './Base'

interface MemberEntity {
  id?: string
  name: string
  email: string
  phone: string
  address: string
  poin: number
  birthhDate?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type MemberAttributes = Omit<
  MemberEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'Members' })
class Member extends BaseEntity {

  @Column({ type: DataType.STRING })
  name: string

  @Column({ type: DataType.STRING })
  email: string

  @Column({ type: DataType.STRING })
  phone: string

  @Column({ type: DataType.STRING })
  address: string

  @Column({ type: DataType.INTEGER })
  poin: number

  @Column({ type: DataType.DATE })
  birthDate: Date

}

export default Member
