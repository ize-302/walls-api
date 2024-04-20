const yup = require('yup')

const loginSchema = yup.object({
  username: yup.string().matches(/^[\w-]+$/, 'Username can only contain alphanumeric characters, dashes, and underscores'),
  password: yup.string().required('Password is required'),
})

module.exports = loginSchema