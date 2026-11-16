# Slot Booking Engine
--- A concurrency-safe class booking engine and financial ledger built with pure TypeScript and PostgreSQL 16.

## Overview

- This project is a POC to handle teacher's booking and prevent Race Conditions. 

## Key Architecture Decisions

- **ACID Transactions & Atomic Migrations:** Uses raw SQL migrations wrapped in atomic transactions (`BEGIN ... COMMIT`) to ensure schema integrity without heavy ORMs.
- **Concurrency & Anti-Double Booking:** Implements PostgreSQL `EXCLUDE USING gist` constraints (`btree_gist` extension) with `tsrange(start_time, end_time)` to mathematically prevent overlapping schedules directly at the database engine level.
- **Analytical Reporting:** Utilizes `LEFT JOIN` and `GROUP BY` on immutable UUIDs to accurately aggregate class counts and payouts, even for teachers with zero bookings.

## How To Use

- Create .env file, view the .env-template, to fill the environment variables;
- Open Docker desktop, then copy the code bellow:
```bash
docker compose up -d
npm install
npm run migrations
npm run seeds
```

## Scripts
1. Run **npm run get-teachers** to get a list of all teachers in the database.
2. Run **npm run slot-book** to schedule a class in database.  
3. Run **npm run get-teachers-billing-report** to get the Report of the amount of teacher's class and their hourly value amount.