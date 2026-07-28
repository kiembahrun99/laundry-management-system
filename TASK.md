# Laundry Management System

Version: 1.0

## Objective

Build a modern Laundry Management System using a single Next.js project.

The project must prioritize:

- simplicity
- maintainability
- readability
- minimal dependencies
- responsive UI
- fast development
- production-ready code quality

This project is intended for a single laundry business (NOT multi-tenant).

---

# Tech Stack

Framework

- Next.js 15
- TypeScript
- App Router

Frontend

- Bootstrap 5 via CDN
- Bootstrap Icons via CDN

Backend

- Next.js Route Handlers
- Server Actions when appropriate

Database

- SQLite

ORM

- Prisma

Authentication

- Session Authentication
- bcrypt password hashing

Package Manager

- npm

---

# DO NOT USE

Do NOT use:

- Tailwind CSS
- Material UI
- Chakra UI
- Ant Design
- Redux
- Zustand
- React Query
- Firebase
- MongoDB
- MySQL
- PostgreSQL
- Docker
- Express
- Laravel
- External Backend
- jQuery

Everything must remain inside ONE Next.js project.

---

# Project Structure

app/

components/

lib/

prisma/

public/

types/

middleware.ts

package.json

---

# Folder Structure

app/

login/

dashboard/

customers/

services/

orders/

payments/

reports/

settings/

api/

components/

layout/

table/

form/

modal/

navbar/

sidebar/

lib/

auth.ts

db.ts

helper.ts

utils.ts

constants.ts

prisma/

schema.prisma

seed.ts

dev.db

---

# UI Theme

Modern SaaS Dashboard

White background

Rounded cards

Soft shadows

Bootstrap primary color

Responsive

Desktop first

Tablet compatible

Mobile usable

---

# Authentication

Roles

Admin

Employee

Login fields

Username

Password

Password must be hashed using bcrypt.

Unauthenticated users must automatically redirect to /login.

---

# Dashboard

Show:

Today's Revenue

Today's Orders

Orders Processing

Finished Orders

Orders Waiting Pickup

Recent Orders

Revenue Chart

Recent Payments

---

# Customer Module

CRUD

Fields

Full Name

Phone

Address

Notes

Created At

Updated At

Search

Pagination

Validation

No duplicate phone numbers.

---

# Service Module

CRUD

Fields

Service Name

Price Per Kg

Estimated Days

Description

Status

---

# Order Module

Fields

Invoice Number

Customer

Service

Weight

Price

Discount

Total

Payment Status

Order Status

Created By

Created Date

Notes

Invoice number format

INV-YYYYMMDD-0001

Auto Increment Daily

---

# Order Status

Received

Washing

Drying

Ironing

Finished

Picked Up

Cancelled

Status changes must create history logs.

---

# Order Timeline

Every status update creates

Timestamp

User

Description

Timeline must be displayed vertically.

---

# Payment Module

Methods

Cash

Transfer

QRIS

Status

Unpaid

DP

Paid

Fields

Invoice

Amount

Method

Paid Date

Paid By

Notes

---

# Transaction Log

Every payment

Every update

Every delete attempt

Must create immutable log.

Never hard delete.

Use Soft Delete.

---

# Reports

Daily

Weekly

Monthly

Custom Date

Revenue

Orders

Top Customers

Popular Services

Export CSV

---

# Search

Global search

Invoice

Customer Name

Phone Number

Realtime filtering

---

# Print

Invoice

A4

Thermal 58mm

Thermal 80mm

Browser print compatible

---

# Settings

Laundry Name

Address

Phone

Logo

Footer

Receipt Note

---

# Validation

All forms require server-side validation.

Never trust client input.

Use Zod.

---

# Error Handling

Friendly error messages.

Never expose stack traces.

Handle:

404

401

403

500

---

# Loading

Every async operation must have

Loading Spinner

Disabled Button

Loading Text

---

# Empty States

No Data Found

No Customers

No Orders

No Payments

Provide user-friendly messages.

---

# Database Tables

users

customers

services

orders

payments

order_logs

transaction_logs

settings

---

# Prisma Relations

Customer

hasMany Orders

Order

belongsTo Customer

Order

belongsTo Service

Payment

belongsTo Order

OrderLog

belongsTo Order

TransactionLog

belongsTo User

---

# Security

Password Hash

CSRF Protection

Server Validation

SQL Injection Protection

Escape HTML

Secure Cookies

No plaintext passwords

---

# Coding Standards

Strict TypeScript

No any type

Reusable Components

No duplicated code

Small functions

Meaningful names

No magic numbers

Comments only when necessary

---

# Performance

Server Components first

Client Components only when needed

Lazy load charts

Optimize Prisma queries

Avoid unnecessary rerenders

---

# Accessibility

Buttons have labels

Forms have labels

Keyboard navigation

Color contrast

---

# Responsive

Desktop

Laptop

Tablet

Mobile

---

# Database Seed

Automatically create

Admin User

username

admin

password

admin123

Employee User

username

employee

password

employee123

Create default services

Regular Wash

Express Wash

Iron Only

---

# Backup

Create utility

Backup SQLite database

backup/

yyyy-mm-dd.db

---

# Deliverables

The AI agent must generate

Complete source code

Prisma schema

SQLite database

Seed file

Responsive UI

Bootstrap layout

Authentication

CRUD

Reports

Print Invoice

Error handling

Validation

README.md

Installation guide

---

# Installation

npm install

npx prisma generate

npx prisma db push

npm run seed

npm run dev

---

# Final Goal

The application should look and behave like a professional SaaS dashboard while remaining simple enough for a small laundry business.

The final code must prioritize:

- clean architecture
- readability
- maintainability
- modularity
- scalability

Avoid overengineering.

Keep everything simple.

Every feature should be production quality.
