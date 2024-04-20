const yup = require('yup')

const registrationSchema = yup.object({
  username: yup.string().matches(/^[\w-]+$/, 'Username can only contain alphanumeric characters, dashes, and underscores').required('Username is required'),
  password: yup.string().required('Password is required'),
})

module.exports = registrationSchema