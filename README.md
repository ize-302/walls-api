# Walls API

API service for walls; a social networking site

## Tech stack
- Nodejs + Express
- SQLite database powered by [Turso.tech](https://turso.tech/)
- DrizzleORM [https://drizzle.team/](https://orm.drizzle.team/)
- Swagger for API documentation
- Redis for session management (You will need to install redis on your machine)

> This app uses session based authentication as opposed to token. Learn about them here:
[Session vs Token Authentication in 100 Seconds](https://www.youtube.com/watch?v=UBUNrFtufWo)

## Requirements
- Turso Database credentials. You get them for free here at [Turso.tech](https://turso.tech/)
- Copy and move the env example files in [env-example](./env-examples/) folder to th root and rename to `.env.development` and `.env.testing`
- Fill up the missing fields for each env files

## DB Setup
```sh
use `npm run generate` to generate migration files
use `npm run push` to migrate
use `npm run studio` to open drizzle studio
```


## Run app locally
```sh
use `npm run start:dev` to run app in development mode

Visit http://localhost:8000/api to see api in action
Visit Swagger documentation is hosted on http://localhost:8000/api/docs/#/

use `npm run test` to run test cases
```