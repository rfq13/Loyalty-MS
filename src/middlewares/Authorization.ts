import SessionService from '@controllers/Session/service'
import User from '@database/entities/User'
import { logErrServer } from '@expresso/helpers/Formatter'
import { currentToken, verifyAccessToken } from '@expresso/helpers/Token'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import Sequelize from 'sequelize'

async function Authorization(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  const getToken = currentToken(req)
  const token = verifyAccessToken(getToken)

  if(!token?.data) {
    console.log('token', token)
    return res.status(401).json({
      message: 'Unauthorized!',
    })
  }

  req.setState({ userLogin: token?.data })
  next()

  return;
}

export default Authorization
