import { APP_LANG } from '@config/env'
import asyncHandler from '@expresso/helpers/asyncHandler'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import route from '@routes/routeDir'
import PoinService from './service'
import { Request, Response } from 'express'

route.post(
  '/poin/redeem',
  Authorization,
  asyncHandler(async function redeem(req: Request, res: Response) {
    const formData = req.getBody()
    const data = await PoinService.redeem(formData)

    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

route.get(
  '/poin/report/earned',
  Authorization,
  asyncHandler(async function reportEarned(req: Request, res: Response) {
    const data = await PoinService.reportEarned(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/poin/report/redeemed',
  Authorization,
  asyncHandler(async function reportRedeemed(req: Request, res: Response) {
    const data = await PoinService.reportRedeemed(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/poin/report/earned/export',
  Authorization,
  asyncHandler(async function reportExport(req: Request, res: Response) {
    const { data } = await PoinService.reportEarned(req)

    await PoinService.exportExcel(data, res)
  })
)

route.get(
  '/poin/report/redeemed/export',
  Authorization,
  asyncHandler(async function reportExport(req: Request, res: Response) {
    const { data } = await PoinService.reportRedeemed(req)

    await PoinService.exportExcel(data, res)
  })
)
