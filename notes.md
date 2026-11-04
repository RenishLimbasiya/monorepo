# Prisma and PostgreSQL command guide

Run these commands from the repository root unless a command says otherwise. The examples use PowerShell.

## One-time local setup

1. Create the Docker Compose environment file and set a strong URL-safe password:

   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```

2. If you will run the API directly with Node instead of inside Docker, create its local connection file too. Set the password in its `DATABASE_URL` to match the root `.env` password:

   ```powershell
   Copy-Item taskflow/api/.env.example taskflow/api/.env
   notepad taskflow/api/.env
   ```

3. Start PostgreSQL. The host port is `5433`; inside the Compose network the database is `db:5432`.

   ```powershell
   docker compose up -d db
   docker compose ps
   ```

4. Check the Prisma schema and generate the client:

   ```powershell
   npm run db:validate --workspace=@taskflow/api
   npm run db:generate --workspace=@taskflow/api
   ```

The initial migration is already in `taskflow/api/prisma/migrations` and is applied automatically when the API container starts.

## Change the Prisma schema

After editing `taskflow/api/prisma/schema.prisma`, create and apply a development migration:

```powershell
npm run db:migrate --workspace=@taskflow/api -- --name add_a_descriptive_name
```

This command requires PostgreSQL to be running and `taskflow/api/.env` to contain a valid `DATABASE_URL`. It creates a migration under `prisma/migrations` and regenerates the Prisma Client.

For a production database that already has committed migrations, apply them without creating a new one:

```powershell
npm run db:deploy --workspace=@taskflow/api
```

In Docker, `db:deploy` runs automatically before the API starts. Rebuild/restart after changing API or schema code:

```powershell
docker compose up --build -d api
```

Check migration status from the API directory:

```powershell
Set-Location taskflow/api
npx prisma migrate status
Set-Location ../..
```

## Inspect and edit database data

Open Prisma Studio from the repository root:

```powershell
npm run db:studio --workspace=@taskflow/api
```

Connect with `psql` from the host (it will prompt for the password):

```powershell
psql -h localhost -p 5433 -U taskflow -d taskflow
```

Or run SQL inside the PostgreSQL container:

```powershell
docker compose exec db psql -U taskflow -d taskflow -c "\dt"
docker compose exec db psql -U taskflow -d taskflow -c 'SELECT id, email, name, "createdAt" FROM users;'
```

## Authentication and user account endpoints

The API uses bcrypt password hashes and short-lived JWT bearer access tokens. Set a unique `JWT_ACCESS_TOKEN_SECRET` in the root `.env` and use the same value in `taskflow/api/.env` for local API development. The example files are templates; do not use their placeholder values in a deployed environment.

Register a user (the response includes an access token):

```powershell
$body = @{ email = 'person@example.com'; name = 'Example User'; password = 'use-a-long-unique-password' } | ConvertTo-Json
$session = Invoke-RestMethod -Method Post -Uri http://localhost/api/v1/auth/register -ContentType 'application/json' -Body $body
$token = $session.data.accessToken
$userId = $session.data.user.id
```

Log in an existing user:

```powershell
$body = @{ email = 'person@example.com'; password = 'use-a-long-unique-password' } | ConvertTo-Json
$session = Invoke-RestMethod -Method Post -Uri http://localhost/api/v1/auth/login -ContentType 'application/json' -Body $body
$token = $session.data.accessToken
```

Get the current user, then update or delete that user's record. User ID routes only allow access to the matching account:

```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri http://localhost/api/v1/auth/me -Headers $headers
Invoke-RestMethod -Method Patch -Uri "http://localhost/api/v1/user/$userId" -Headers $headers -ContentType 'application/json' -Body '{"name":"Updated Name"}'
Invoke-RestMethod -Method Delete -Uri "http://localhost/api/v1/user/$userId" -Headers $headers
```

Registration creates the user; there is no public endpoint to list all users. Login and registration are rate-limited. Access tokens expire after 15 minutes; the client should keep them in memory and discard them when logging out.

## Back up and restore PostgreSQL

Create a plain SQL backup in the repository root:

```powershell
docker compose exec -T db pg_dump -U taskflow -d taskflow > taskflow-backup.sql
```

Restore a backup into the running database:

```powershell
Get-Content taskflow-backup.sql | docker compose exec -T db psql -U taskflow -d taskflow
```

## Stop and reset

Stop containers while retaining the database volume:

```powershell
docker compose down
```

**Destructive:** remove the containers and the PostgreSQL volume, permanently deleting the local database data:

```powershell
docker compose down --volumes
```
