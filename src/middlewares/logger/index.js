import developmentLogger from './dev-logger.middleware'
import productionLogger from './prod-logger.middleware'
import { NODE_ENV } from '../../config'

let loggerMiddleware = null;

if (NODE_ENV === "development") {
  loggerMiddleware = developmentLogger()
}

if (NODE_ENV === "production") {
  loggerMiddleware = productionLogger()
}

export default loggerMiddleware;