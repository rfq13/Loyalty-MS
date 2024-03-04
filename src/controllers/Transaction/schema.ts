import * as yup from 'yup'


export default {
  create: yup
    .object({
      MemberId: yup.string().required(),
      items: yup.array().of(
        yup.object({
          ItemName: yup.string().required(),
          ItemQty: yup.number().required(),
          ItemPrice: yup.number().required(),
        }).required()
      ).min(1).required(),
    })
    .required(),
}
