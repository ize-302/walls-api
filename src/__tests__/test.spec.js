import { signupTests, loginTests, logoutTests } from './authTests.js'
import { getCurrentProfileTests, updateCurrentProfileTests } from './profileTests.js'
import {
  changeUsernameTests,
  changePasswordTests
} from './settingsTests.js'
import {
  getUserProfileTests,
  getUserStatsTests,
  handleUserFollowTests,
  handleUserUnfollowTests
} from './usersTests.js'

// auth
describe('Sign up', signupTests)
describe('Log in', loginTests)

// profile
describe('Get current profile', getCurrentProfileTests)
describe('Update current profile', updateCurrentProfileTests)

// users
describe("get user profile", getUserProfileTests)
describe("get user stats", getUserStatsTests)
describe("Follow user", handleUserFollowTests)
describe("Unfollow user", handleUserUnfollowTests)

// settings
describe("Change password", changePasswordTests)
describe("Change username", changeUsernameTests)

// logout
describe('Log out user', logoutTests)