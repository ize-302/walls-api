import { clearOutTestData, initialSetup } from './utils';

beforeAll(() => initialSetup());

import './auth.test'
import './profile.test'
import './users.test'
import './posts.test'
import './settings.test'

afterAll(() => clearOutTestData());