# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

# ENV Variables

```
DATABASE_URL="postgres://postgres:devpass@localhost:5432/t3" # Well, database, ofc..
ADMIN_USERNAME="test" # Username for logging in.
ADMIN_PASSWORD="test" # Password for logging in.
```

# Setup

Make sure your **PostgreSQL** database is up and running.

Setup the `DATABASE_URL` environment variable properly.

Run `npm install && npx prisma db push`.

Last but not least, run `npm run dev` and you'll be able to access the project at https://localhost:3000.

The default Login credentials are `username: test, password: test`.
