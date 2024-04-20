const yup = require('yup')

const registrationSchema = yup.object({
  username: yup.string().required('Username name is required'),
  password: yup.string().required('Password is required'),
})

module.exports = registrationSchema