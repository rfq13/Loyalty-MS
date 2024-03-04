import { APP_LANG, APP_URL } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import SessionService from '@controllers/Session/service'
import { UserLoginAttributes } from '@database/entities/User'
import asyncHandler from '@expresso/helpers/asyncHandler'
import {
  currentToken,
} from '@expresso/helpers/Token'
import userAgentHelper from '@expresso/helpers/userAgent'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import ResponseError from '@expresso/modules/Response/ResponseError'
import Authorization from '@middlewares/Authorization'
import route from '@routes/routeDir'
import { Request, Response } from 'express'
import { TOptions } from 'i18next'
import AuthService from './service'

route.post(
  '/auth/sign-in',
  asyncHandler(async (req: Request, res: Response) => {
    const { lang, exp = undefined } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()

    const data = await AuthService.signIn(
      formData,
      { lang: defaultLang },
      exp
    )
    const httpResponse = HttpResponse.get(data)

    // create session
    await SessionService.save({
      UserId: data.user.uid as unknown as string,
      token: data.accessToken,
      ipAddress: req.clientIp?.replace('::ffff:', ''),
      device: userAgentHelper.currentDevice(req),
      platform: userAgentHelper.currentPlatform(req),
    })

    res
      .status(200)
      .cookie('token', data.accessToken, {
        maxAge: Number(data.expiresIn) * 1000,
        httpOnly: true,
        path: '/loyalty-ms',
        secure: process.env.NODE_ENV === 'production',
      })
      .json(httpResponse)
  })
)

// refresh token
route.post(
  '/auth/refresh-token',
  asyncHandler(async function refreshToken(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()

    const data = await AuthService.refreshToken(formData, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/logout',
  Authorization,
  asyncHandler(async function logout(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const formData = req.getBody()
    const getToken = currentToken(req)
    const userLogin = req.getState('userLogin') as UserLoginAttributes

    if (userLogin.uid !== formData.UserId) {
      const message = i18nConfig.t('errors.invalid_user_login', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const message = await AuthService.logout(userLogin.uid, getToken, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get({ message })
    res.status(200).clearCookie('token', { path: '/v1' }).json(httpResponse)
  })
)
