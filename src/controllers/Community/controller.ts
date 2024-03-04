import { APP_LANG } from '@config/env'
import asyncHandler from '@expresso/helpers/asyncHandler'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import route from '@routes/routeDir'
import CommunityService from './service'
import { Request, Response } from 'express'

route.post(
  '/community/add-member',
  Authorization,
  asyncHandler(async function create(req: Request, res: Response) {
    const formData = req.getBody()
    const data = await CommunityService.addMember(formData)
    console.log(data,"addmmbr")
    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

route.post(
  '/community/add-activity',
  Authorization,
  asyncHandler(async function create(req: Request, res: Response) {
    const formData = req.getBody()
    const data = await CommunityService.addActivity(formData)

    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)


