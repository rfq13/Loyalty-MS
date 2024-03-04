import * as yup from 'yup'


export default {
  addMember: yup
    .object({
      MemberId: yup.string().nullable().optional().notRequired(),
      persons: yup.array().of(
        yup.object({
          name: yup.string().required(),
          email: yup.string().email().required(),
          phone: yup.string().required(),
          address: yup.string().required(),
          birthDate: yup.date().required(),
          status: yup.string().oneOf(['active', 'inactive']).required(),
        }).required()
      ).required().min(1),
    })
    .required(),
  addActivity: yup
    .object({
      name: yup.string().required(),
      MemberId: yup.string().required(),
    })
    .required(),
}
