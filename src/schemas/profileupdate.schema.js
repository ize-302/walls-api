const yup = require('yup')

const profileUpdateSchema = yup.object({
  name: yup.string(),
  email: yup.string().email(),
  gender: yup.string(),
  bio: yup.string().max(150, 'Bio cannot be more than 150 characters'), // when changing this, dont forgrt to update column on db schema 
})

module.exports = profileUpdateSchema