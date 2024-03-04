/* eslint-disable @typescript-eslint/no-invalid-void-type */
import clientRedis from '@config/clientRedis'
import { RATE_LIMIT } from '@config/env'
import { logErrServer } from '@expresso/helpers/Formatter'
import { NextFunction, Request, Response } from 'express'

const ExpressRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const ipAddress =
      req.headers['cf-connecting-ip'] ??
      req.headers['x-real-ip'] ??
      req.headers['x-forwarded-for'] ??
      req.socket.remoteAddress
    const key = `rate-limit:${ipAddress}`
    const limit = Number(RATE_LIMIT)
    const current = await clientRedis.get(key)
    const duration = 15 * 60 // 15 menit
    if (current === null) {
      await clientRedis.set(key, '1', 'EX', duration)
    } else {
      const currentNumber = Number(current)
      if (currentNumber >= limit) {
        return res.status(429).json({
          success: false,
          code: 429,
          message: 'Too Many Request',
        })
      }

      await clientRedis.incr(key)
    }

    next()
  } catch (err) {
    const errType = `Limit Request Error:`
    const message = 'Too Many Requests'

    console.log(logErrServer(errType, message))

    return res.status(429).json({ code: 429, message })
  }
}

export default ExpressRateLimit
