const { signupTests, loginTests, logoutTests } = require('./auth')
const { getCurrentProfileTests, updateCurrentProfileTests } = require('./profile')

describe('Sign up', signupTests)
describe('Log in', loginTests)
describe('Log out user', logoutTests)
describe('Get current profile', getCurrentProfileTests)
describe('Update current profile', updateCurrentProfileTests)