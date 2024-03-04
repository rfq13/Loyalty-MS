import * as yup from 'yup'


export default {
  create: yup
    .object({
      name: yup.string().required(),
      type: yup.string().required().oneOf(['transaction', 'community']),
      minAmount: yup.number().when('type', {
        is: 'transaction',
        then: yup.number().required(),
      }),
      minQty: yup.number().when('type', {
        is: 'transaction',
        then: yup.number().required(),
      }),
      isForFirstTrx: yup.boolean().when('type', {
        is: 'transaction',
        then: yup.boolean().required(),
      }),
      benefitType: yup.string().required().oneOf(['percentage', 'fixed']).when('type', {
        is: 'community',
        then: yup.string().required().oneOf(['fixed']),
      }),
      activity: yup.string().required().oneOf(['Add Transaction', 'Member Get Member', 'Member Activity', 'Birthday Bonus']),
      maxPoin: yup.number().nullable().notRequired(),
      benefitValue: yup.number().required(),
      startDate: yup.date().required(),
      endDate: yup.date().required(),
      Tiers: yup.array().of(yup.string().required()).min(1).required(),
    })
    .required(),

  update: yup
    .object({
      name: yup.string().notRequired(),
      type: yup.string().notRequired().oneOf(['transaction', 'community']),
      minAmount: yup.number().when('type', {
        is: 'transaction',
        then: yup.number().notRequired(),
      }),
      minQty: yup.number().when('type', {
        is: 'transaction',
        then: yup.number().notRequired(),
      }),
      isForFirstTrx: yup.boolean().when('type', {
        is: 'transaction',
        then: yup.boolean().notRequired(),
      }),
      benefitType: yup.string().notRequired().oneOf(['percentage', 'fixed']),
      activity: yup.string().notRequired().oneOf(['Add Transaction', 'Member Get Member', 'Member Activity', 'Birthday Bonus']),
      maxPoin: yup.number().nullable().notRequired(),
      benefitValue: yup.number().notRequired(),
      startDate: yup.date().notRequired(),
      endDate: yup.date().notRequired(),
      Tiers: yup.array().of(yup.string()).notRequired(),
    })
    .notRequired(),
}
