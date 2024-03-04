import * as yup from 'yup'


export default {
  redeem: yup
    .object({
      MemberId: yup.string().required(),
      redeemPoin: yup.number().required().min(1),
    })
    .required(),
}
