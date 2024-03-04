import * as bcrypt from 'bcrypt'
import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  DefaultScope,
  Scopes,
  Table,
  Unique,
  ForeignKey,
  IsUUID,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript'
import BaseEntity from './Base'

interface UserEntity {
  id?: string
  email: string
  balance: number
  fullName: string
  password?: string | null
  pin?: string | null
  phone?: string | null
  tokenVerify?: string | null
  isActive?: boolean | null
  isTester?: boolean | null
  isDemo?: boolean | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  RoleId: string
}

export interface UserLoginAttributes {
  uid: string
  role: string
}

export type CreatePassword = Pick<UserEntity, 'password'>

export interface ForgotPasswordAttributes {
  email?: string
  phone?: string
}

export interface VerifyTokenForgotPasswordAttributes {
  email: string
  token: string
}

export interface ResetPasswordAttributes {
  email: string
  token: string
  password: string
}

export interface RefreshTokenAttributes {
  refreshToken: string
}

export type LoginAttributes = Pick<UserEntity, 'email' | 'phone' | 'password'>

export type UserAttributes = Omit<
  UserEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@DefaultScope(() => ({
  attributes: {
    exclude: ['password', 'tokenVerify'],
  },
}))
@Scopes(() => ({
  withPassword: {},
}))
@Table({ tableName: 'Users', paranoid: true })
class User extends BaseEntity {
  @Unique
  @Column
  email: string

  @Column
  fullName?: string

  @Column
  password?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isActive?: boolean

  @BeforeUpdate
  @BeforeCreate
  static setUserPassword(instance: User): void {
    const { password } = instance
    if (password) {
      let newPass = password
      const saltRounds = 10
      // check if password is already hashed
      if (newPass.length < 60) {
        newPass = bcrypt.hashSync(newPass, saltRounds)
      }

      instance.setDataValue('password', newPass)
    }
  }

  comparePassword: (currentPassword: string) => Promise<boolean>
}

User.prototype.comparePassword = async function (
  currentPassword: string
): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    const password = String(this.password)

    void bcrypt.compare(currentPassword, password, function (err, isMatch) {
      if (err) reject(err)
      resolve(isMatch)
    })
  })
}

export default User
