const { signupTests, loginTests, logoutTests } = require('./auth')
const { getCurrentProfileTests, updateCurrentProfileTests } = require('./profile')
const { changeUsernameTests,
  changePasswordTests
} = require('./settings')

// auth
describe('Sign up', signupTests)
describe('Log in', loginTests)

// profile
describe('Get current profile', getCurrentProfileTests)
describe('Update current profile', updateCurrentProfileTests)

// settings
describe("Change username", changeUsernameTests)
describe("Change password", changePasswordTests)

// logout
describe('Log out user', logoutTests)