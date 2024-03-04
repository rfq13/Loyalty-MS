
import { i18nConfig } from '@config/i18nextConfig'
import SessionService from '@controllers/Session/service'
import userSchema from '@controllers/User/schema'
import UserService from '@controllers/User/service'
import User, {
  LoginAttributes,
  UserLoginAttributes,
  RefreshTokenAttributes,
} from '@database/entities/User'
import {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
} from '@expresso/helpers/Token'
import { ReqOptions } from '@expresso/interfaces/ReqOptions'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { TOptions } from 'i18next'
import _ from 'lodash'
import { DtoLogin } from './interface'
import * as bcrypt from 'bcrypt'

enum codeCheck {
  USER = 'user',
  SESSION = 'session',
}
interface TokenPayload {
  uid: string
}

class AuthService {

  /**
   *
   * @param formData
   * @returns
   */
  public static async signIn(
    formData: LoginAttributes,
    options?: ReqOptions,
    exp?: string
  ): Promise<DtoLogin> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.login.validateSync(
      formData,
      {
        abortEarly: false,
        stripUnknown: true,
      }
    )

    const getUser = await User.scope('withPassword').findOne({
      where: { email: value.email },
    })

    // check user account
    if (!getUser) {
      const message = i18nConfig.t('errors.account_not_found', i18nOpt)
      throw new ResponseError.NotFound(message)
    }

    const matchPassword = await getUser.comparePassword(value.password)

    // compare password
    if (!matchPassword) {
      const message = i18nConfig.t('errors.incorrect_email_or_pass', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const payloadToken: TokenPayload = {
      uid: getUser.id,
    }
    const accessToken = generateAccessToken(payloadToken, false, exp)
    const refreshToken = generateRefreshToken(payloadToken)

    const message = i18nConfig.t('success.login', i18nOpt)

    const newData = {
      message,
      ...accessToken,
      refreshToken,
      tokenType: 'Bearer',
      user: payloadToken,
    }

    return newData
  }

  /**
   * @param formData
   * @param options
   * @returns
   */

  public static async refreshToken(
    formData: RefreshTokenAttributes,
    options?: ReqOptions
  ): Promise<DtoLogin> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.refreshToken.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    // verify refresh token
    const verifyToken = verifyAccessToken(value.refreshToken)
    const verifyOldToken = verifyAccessToken(value.oldToken)

    if (!verifyToken) {
      const message = i18nConfig.t('errors.invalid_token', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    if (!verifyOldToken) {
      const message = i18nConfig.t('errors.invalid_old_token', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const payloadToken = verifyToken.data as UserLoginAttributes

    // check user account
    if (!payloadToken?.uid) {
      const message = i18nConfig.t('errors.account_not_found', i18nOpt)
      throw new ResponseError.NotFound('JWT Expired Error:' + message)
    }
    const accessToken = generateAccessToken({
      uid: payloadToken.uid,
      role: payloadToken.role,
    })

    SessionService.updateByToken(value.oldToken, accessToken.accessToken)

    const message = i18nConfig.t('success.login', i18nOpt)

    const newData = {
      message,
      ...accessToken,
      refreshToken: value.refreshToken,
      tokenType: 'Bearer',
      user: payloadToken,
    }

    return newData
  }

  /**
   *
   * @param UserId
   * @param token
   * @param options
   * @returns
   */
  public static async logout(
    UserId: string,
    token: string,
    options?: ReqOptions
  ): Promise<string> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const getUser = await UserService.findById(UserId, { ...options })

    // clean session
    await SessionService.deleteByUserToken(getUser.id, token)
    const message = i18nConfig.t('success.logout', i18nOpt)

    return message
  }

  public static async generateHash(password: string) {
    return bcrypt.hashSync(password, 10)
  }
}

export default AuthService
