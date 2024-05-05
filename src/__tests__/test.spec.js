import { signupTests, loginTests, logoutTests } from './auth.js'
import { getCurrentProfileTests, updateCurrentProfileTests } from './profile.js'
import {
  changeUsernameTests,
  changePasswordTests
} from './settings.js'
import {
  getUserProfile,
  handleUserFollow,
  handleUserUnfollow
} from './users.js'

// auth
describe('Sign up', signupTests)
describe('Log in', loginTests)

// profile
describe('Get current profile', getCurrentProfileTests)
describe('Update current profile', updateCurrentProfileTests)

// users
describe("get user profile", getUserProfile)
describe("Follow user", handleUserFollow)
describe("Unfollow user", handleUserUnfollow)

// settings
describe("Change password", changePasswordTests)
describe("Change username", changeUsernameTests)

// logout
describe('Log out user', logoutTests)