import User from '@database/entities/User'
import asyncHandler from '@expresso/helpers/asyncHandler'
import { formatDateTime } from '@expresso/helpers/Date'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import Express, { Request, Response } from 'express'
import routeDir from './routeDir'

const route = Express.Router()

route.use('/', routeDir)

route.get('/', async function (req: Request, res: Response) {
  const buildResponse = HttpResponse.get({
    message: 'Express Sequelize TS',
    apiDocs: '/api-docs',
    healthStatus: '/health',
  })
  return res.json(buildResponse)
})

// make email verify route
route.get(
  '/email/verify',
  asyncHandler(async function verifyEmail(req: Request, res: Response) {
    let message = 'Email verified'

    if (req.query?.token) {
      const updatedData = await User.update(
        { isActive: true, tokenVerify: null },
        {
          where: {
            tokenVerify: req.query.token,
          },
        }
      )

      // count updated data
      if (updatedData[0] === 0) {
        message = 'Token expired'
      }
    } else {
      message = 'Token not found'
    }

    const httpResponse = HttpResponse.get({
      message,
    })

    res.status(200).json(httpResponse)
  })
)

// Get Health Server
route.get(
  '/health',
  asyncHandler(async function getServerHealth(req: Request, res: Response) {
    const startUsage = process.cpuUsage()

    const status = {
      uptime: process.uptime(),
      message: 'Ok',
      timezone: 'ID',
      date: formatDateTime(new Date()),
      node: process.version,
      memory: process.memoryUsage,
      platform: process.platform,
      cpuUsage: process.cpuUsage(startUsage),
    }

    const httpResponse = HttpResponse.get({
      message: 'Server Uptime',
      data: status,
    })
    res.status(200).json(httpResponse)
  })
)

export default route
