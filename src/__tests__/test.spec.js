const { signupTests, loginTests, logoutTests } = require('./auth')
const { getCurrentProfileTests, updateCurrentProfileTests } = require('./profile')
const { changeUsernameTests } = require('./settings')

// auth
describe('Sign up', signupTests)
describe('Log in', loginTests)
describe('Log out user', logoutTests)

// profile
describe('Get current profile', getCurrentProfileTests)
describe('Update current profile', updateCurrentProfileTests)

// settings
describe("Change current user's username", changeUsernameTests)