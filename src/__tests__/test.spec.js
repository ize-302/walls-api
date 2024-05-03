import { signupTests, loginTests, logoutTests } from './auth.js'
import { getCurrentProfileTests, updateCurrentProfileTests } from './profile.js'
import {
  changeUsernameTests,
  changePasswordTests
} from './settings.js'

// auth
describe('Sign up', signupTests)
describe('Log in', loginTests)

// profile
describe('Get current profile', getCurrentProfileTests)
describe('Update current profile', updateCurrentProfileTests)

// settings
describe("Change password", changePasswordTests)
describe("Change username", changeUsernameTests)

// logout
describe('Log out user', logoutTests)