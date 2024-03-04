export interface DtoLogin {
  needOtpValidation?: boolean | null | undefined
  tokenType: string
  user: {
    uid: string
  }
  accessToken: string
  expiresIn: number
  message: string
  refreshToken: string
}
