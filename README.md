# CET Mechanical Placement Portal

A modern placement portal for the Mechanical Engineering Department of College of Engineering Trivandrum, built for the Mechanical Association.

## What It Does

- Public landing page with animated hero content and quick links
- Opportunities board for internships and placements with filters, search, details, uploads, and admin updates
- Placement statistics with charts, analytics, multi-year company records, and on-campus/off-campus tracking
- Alumni insights with testimonials, CTC data, and placement mode
- Protected admin dashboard with JWT login, CRUD forms, and upload support
- MySQL-backed data layer with automatic compatibility for older databases

## Tech Stack

- Next.js 16, React, TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- MySQL with `mysql2`
- JWT auth with bcrypt password hashing
- Chart.js / react-chartjs-2

## Project Structure

```text
app/                  App Router pages and API routes
components/           Public UI, admin UI, and shared components
lib/                  Database helpers, auth, types, and validators
database/             SQL schema, seed data, and migration files
public/uploads/       Local upload target for opportunity files and logos
scripts/              Admin bootstrap helper
```

## Requirements

- Node.js 20+
- MySQL 8+
- npm or pnpm

## Setup

1. Install dependencies.

```bash
npm install
```

2. Create your local environment file.

```bash
copy .env.example .env.local
```

3. Update `.env.local` with your MySQL credentials and a strong `JWT_SECRET`.

4. Create the database and seed it.

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

5. Create the admin account.

```bash
node scripts/create-admin.js admin admin123
```

Change that password immediately after the first login.

## Existing Database Migrations

If you already have an older database, run the migrations that match the current app shape:

```bash
mysql -u root -p < database/migration-2026-06-24-opportunity-updates.sql
mysql -u root -p < database/migration-2026-06-24-named-opportunity-assets.sql
mysql -u root -p < database/migration-2026-06-24-placement-mode.sql
mysql -u root -p < database/migration-2026-06-24-opportunity-status-and-stat-years.sql
mysql -u root -p < database/migration-2026-06-24-nullable-alumni-ctc.sql
mysql -u root -p < database/migration-2026-07-23-placement-mode.sql
```

The app also self-heals a few older schema variants at runtime, but running the SQL files is the cleanest route before deploying.

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Environment Variables

Required values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=cet_mech_placement
JWT_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Hosting Notes

- Use a managed MySQL host for production, since Vercel does not run MySQL itself.
- Set the same environment variables in your host dashboard.
- Make sure the database schema and seed data are applied before the first deployment.
- Keep `public/uploads` on persistent storage if you move beyond local development.

## GitHub Push Checklist

```bash
git init
git add .
git commit -m "Prepare production-ready placement portal"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Tables

- `admins`: `id`, `username`, `passwordHash`, `createdAt`
- `opportunities`: `id`, `type`, `status`, `company`, `description`, `applicationLink`, `applicationLinks`, `deadline`, `compensation`, `documents`, `logo`, `createdAt`, `updatedAt`
- `placement_statistics`: `id`, `company`, `package`, `placementMode`, `years`, `notes`, `createdAt`, `updatedAt`
- `alumni_insights`: `id`, `name`, `company`, `passoutYear`, `position`, `placementMode`, `ctc`, `review`, `createdAt`, `updatedAt`
- `opportunity_updates`: `id`, `opportunityId`, `message`, `createdAt`

## License

MIT
