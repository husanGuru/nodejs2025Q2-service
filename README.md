# REST service: Containerization and Database (PostgreSQL) & ORM

## Downloading and installing

```
git clone --branch docker --single-branch https://github.com/husanGuru/nodejs2025Q2-service.git .

docker compose up -d
```

App is available on host port 4000: http://localhost:4000

- changes in /src folder triggers hot reload
- to run tests need to install packages (jest)

```
npm install
npm run test
```

Adminer (database client) is available on host port 8080: http://localhost:8080

- system: PostgreSQL
- server: postgres
- username: postgres_user
- password: password
- database: nest_db

Postgres db is available on host port :5432.
