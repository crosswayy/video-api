<div style="display: flex; align-items: center; justify-content: center">
<p>
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>
</div>

# NestJS Video service API. Innowise internship

## Run the API in development mode
```
npm install         // install all dependecies
npm db:dev:restart  // start postgres in docker
npm run start:dev   // start API in dev mode
```

Service will be available on port 3000.
Swagger is also available at http://localhost:3000/swagger/

### Before starting you need set environment variables creating .env file
```
POSTGRES_VERSION=           // Postgres version
POSTGRES_HOST=              // Postgres host
POSTGRES_PORT=              // Postgres port
POSTGRES_USER=              // Postgres user
POSTGRES_PASSWORD=          // Postgres password
POSTGRES_DB=                // Postgres database name

AT_SECRET=                  // Access token secret key
RT_SECRET=                  // Refresh token secret key
ACCESS_TOKEN_EXP_MIN=       // Access token expiration time in minutes
REFRESH_TOKEN_EXP_DAYS=     // Refresh token expiration time in days

MAX_FILE_SIZE=              // Video file max size
UPLOAD_LOCATION=            // Directory to upload video files
```

