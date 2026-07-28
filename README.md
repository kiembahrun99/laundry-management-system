# Laundry Management System

Modern SaaS dashboard for single laundry business.

## Tech
- Next.js 15 + App Router + TypeScript
- Prisma + SQLite
- Bootstrap 5 + Icons via CDN
- jose JWT session + bcrypt
- Zod validation

## Install
```
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```
Open http://localhost:3000 -> redirects to /login

- admin / admin123 (ADMIN)
- employee / employee123 (EMPLOYEE)

## Features
- Auth middleware (session cookie)
- Dashboard stats
- Customers CRUD (unique phone, soft delete)
- Services CRUD
- Orders CRUD (INV-YYYYMMDD-0001 invoice), status timeline, order logs
- Payments (CASH/TRANSFER/QRIS) + auto payment status
- Reports daily/weekly/monthly/custom + CSV export
- Settings (laundry info)
- Global search API
- Print invoice (browser print)
- Transaction logs (immutable) + soft delete
- Backup util (backup/YYYY-MM-DD.db)

## Structure
app/(app)/ -> protected routes
app/api/ -> route handlers
lib/ -> db, auth, validations, utils
components/ -> reusable UI
prisma/ schema + seed
