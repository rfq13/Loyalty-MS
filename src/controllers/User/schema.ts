import * as yup from 'yup'

const login = yup
  .object({
    email: yup.string().email('Email tidak valid'),
    password: yup
      .string()
      .test('password', 'Password minimal 8 karakter, terdiri dari huruf besar, huruf kecil, angka, dan karakter spesial', (value) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value || '')
      }
      )
      .required('Password wajib diisi'),
  })
  .required()

const refreshToken = yup.object({
  refreshToken: yup.string().required('Kode Refresh API wajib diisi'),
  oldToken: yup.string().required('Kode API lama wajib diisi'),
})

const userSchema = {
  login,
  refreshToken,
}

export default userSchema
