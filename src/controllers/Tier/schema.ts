import * as yup from 'yup'


export default {
  create: yup
    .object({
      name: yup.string().required(),
      minPoin: yup.number().required(),
      maxPoin: yup.number().required(),
    })
    .required(),

  update: yup
    .object({
      name: yup.string().notRequired(),
      minPoin: yup.number().notRequired(),
      maxPoin: yup.number().notRequired(),
    })
    .notRequired(),
}
