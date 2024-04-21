const { signupTests, loginTests } = require('./auth')
const { getCurrentProfileTests, updateCurrentProfileTests } = require('./profile')

describe('Sign up', signupTests)
describe('Log in', loginTests)
describe('Get current profile', getCurrentProfileTests)
describe('Update current profile', updateCurrentProfileTests)