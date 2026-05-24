# Challenge Tracker Advanced Dashboard and API

An advanced, enterprise-ready full-stack Challenge Management Application and API built using TypeScript, React, Express, Prisma ORM, Drizzle ORM, and PostgreSQL. This system provides comprehensive challenge lifecycle CRUD capabilities, advanced multi-criteria reactive filtering, real-time analytics visualizations, and side-by-side ORM implementations showcasing best practices in modern backend development.

## Technical Architecture

The application is structured as a unified monorepo containing:
1. **TypeScript Backend**: Express-based REST API serving type-safe operations. It supports dual database access methodologies through both Prisma ORM and Drizzle ORM to demonstrates flexible schema management and query engines.
2. **Advanced Reactive Frontend**: A high-performance Single Page Application (SPA) built using React, Vite, TypeScript, Chart.js, and styled with premium glassmorphic Vanilla CSS. The frontend is compiled and served directly from the backend server to minimize network routing.

```
+----------------------------------------------------------------------+
|                     Advanced React SPA Dashboard                     |
|            (Vite, React, TypeScript, Chart.js, Glassmorphism)        |
+----------------------------------+-----------------------------------+
                                   |
                                   | HTTP REST Commands
                                   v
+----------------------------------+-----------------------------------+
|                     Node.js / Express Server                         |
|                         (TypeScript Engine)                          |
+------------------+-------------------------------+-------------------+
                   |                               |
                   | Prisma ORM                    | Drizzle ORM
                   v (Type-safe CRUD Queries)      v (Direct SQL Engine)
+------------------+-------------------------------+-------------------+
|                              Prisma Client   | Drizzle DB Client |
+------------------+-------------------------------+-------------------+
                   |                               |
                   v                               v
+------------------+-------------------------------+-------------------+
|                         PostgreSQL Database                          |
+----------------------------------------------------------------------+
```

## Features

- **Advanced Full Stack Languages**: Written 100% in TypeScript on both client and server to ensure interface alignment and error-free compile time checking.
- **Glassmorphism Theme**: Sleek, high-end premium styling with harmonized HSL tailoring, smooth gradients, subtle card overlays, active sidebar controls, and real-time toast dispatchers.
- **Micro-Animations**: Dynamic state transformations, list loaders, element scalers, and transition properties on interactive nodes.
- **Dual ORM Database Layer**: Configured Prisma ORM as primary schema management and migrations engine, alongside Drizzle ORM to execute optimized direct-to-SQL commands on PostgreSQL.
- **Comprehensive API**: Full support for POST, GET, PUT, PATCH, and DELETE operations, including custom Swagger interactive specifications.
- **Reactive Analytics Engine**: Instant distribution charts utilizing Chart.js rendering Status ratios, Track subdivisions, and platform Origin classifications dynamically.
- **Challenge Source Tracking**: Supports `challengeSource` indicating where the challenge originated (Work Manager, Topgear, GitHub, etc.) with indexing and advanced search filters.

## Schema Architecture

### PostgreSQL Entity Relationship

The database schema manages three primary tables: `challenges`, `challenge_types`, and `challenge_tracks`.

#### Prisma Representation (`prisma/schema.prisma`)

```prisma
model Challenge {
  id                    String    @id @default(cuid())
  name                  String
  description           String?
  type                  String
  track                 String
  status                String    @default("draft")
  phases                Json?     // Array of phase objects
  prizes                Json?     // Array of prize objects
  tags                  Json?     // Array of tag strings
  skills                Json?     // Array of skill objects
  startDate             DateTime?
  endDate               DateTime?
  registrationStartDate DateTime?
  registrationEndDate   DateTime?
  submissionStartDate   DateTime?
  submissionEndDate     DateTime?
  challengeSource       String?   // Tracks origin platform
  createdBy             String
  updatedBy             String?
  legacy                Json?     // Legacy compatibility fields
  timelineTemplateId    String?
  groups                Json?
  gitRepoURL            String?
  forumId               String?
  directProjectId       String?
  billingAccountId      String?
  overview              String?
  reviewType            String?
  created               DateTime  @default(now())
  updated               DateTime  @updatedAt
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@map("challenges")
}

model ChallengeType {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  isActive    Boolean  @default(true)
  created     DateTime @default(now())
  updated     DateTime @updatedAt

  @@map("challenge_types")
}

model ChallengeTrack {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  isActive    Boolean  @default(true)
  created     DateTime @default(now())
  updated     DateTime @updatedAt

  @@map("challenge_tracks")
}
```

#### Drizzle Representation (`src/drizzle/schema.ts`)

```typescript
import { pgTable, text, varchar, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const challenges = pgTable('challenges', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 255 }).notNull(),
  track: varchar('track', { length: 255 }).notNull(),
  status: varchar('status', { length: 255 }).default('draft').notNull(),
  phases: jsonb('phases'),
  prizes: jsonb('prizes'),
  tags: jsonb('tags'),
  skills: jsonb('skills'),
  startDate: timestamp('startDate', { withTimezone: true }),
  endDate: timestamp('endDate', { withTimezone: true }),
  registrationStartDate: timestamp('registrationStartDate', { withTimezone: true }),
  registrationEndDate: timestamp('registrationEndDate', { withTimezone: true }),
  submissionStartDate: timestamp('submissionStartDate', { withTimezone: true }),
  submissionEndDate: timestamp('submissionEndDate', { withTimezone: true }),
  challengeSource: varchar('challengeSource', { length: 255 }),
  createdBy: varchar('createdBy', { length: 255 }).notNull(),
  updatedBy: varchar('updatedBy', { length: 255 }),
  legacy: jsonb('legacy'),
  timelineTemplateId: varchar('timelineTemplateId', { length: 255 }),
  groups: jsonb('groups'),
  gitRepoURL: varchar('gitRepoURL', { length: 255 }),
  forumId: varchar('forumId', { length: 255 }),
  directProjectId: varchar('directProjectId', { length: 255 }),
  billingAccountId: varchar('billingAccountId', { length: 255 }),
  overview: text('overview'),
  reviewType: varchar('reviewType', { length: 255 }),
  created: timestamp('created', { withTimezone: true }).defaultNow().notNull(),
  updated: timestamp('updated', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
});
```

---

## Detailed REST API Documentation

The server exposes endpoints at `/api/v6/challenges`.

### 1. Prisma-Backed Endpoints (Primary REST Interface)

#### GET `/api/v6/challenges`
Retrieves a paginated list of challenges. Supports advanced filtering, search, and sorting.
- **Parameters**:
  - `page`: Page index (default: `1`)
  - `limit`: Records per page (default: `20`)
  - `search`: String matching name or description
  - `status`: Filter by status (`draft`, `active`, `completed`, `cancelled`)
  - `type`: Filter by type (`Code`, `Design`, etc.)
  - `track`: Filter by track (`Development`, `Design`, etc.)
  - `challengeSource`: Filter by origin source (`Work Manager`, `Github`, etc.)
  - `sortBy`: Field to sort (`created`, `name`, `startDate`)
  - `sortOrder`: Sorting direction (`asc`, `desc`)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
  ```

#### POST `/api/v6/challenges`
Creates a new challenge entry using Prisma.
- **Body**:
  ```json
  {
    "name": "Implement Mobile Authentication",
    "type": "Code",
    "track": "Development",
    "challengeSource": "Work Manager",
    "createdBy": "admin",
    "status": "draft",
    "description": "Create a fully functional OAuth2 secure interface."
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Challenge created successfully (Prisma)",
    "data": { "id": "cmcxot...", "name": "...", "status": "draft", ... }
  }
  ```

#### GET `/api/v6/challenges/:id`
Retrieves detailed metrics of a specific challenge.
- **Response** (`200 OK` or `404 Not Found`).

#### PATCH `/api/v6/challenges/:id`
Updates specific attributes of a challenge (partial update).
- **Body**: Any subset of challenge parameters.

#### PUT `/api/v6/challenges/:id`
Replaces the entire challenge entry (full update).

#### DELETE `/api/v6/challenges/:id`
Removes a challenge from PostgreSQL database using Prisma.

---

### 2. Drizzle-Backed Endpoints (SQL Sandbox Interface)

These endpoints provide identical interface operations but compile directly to raw structured SQL transactions via Drizzle ORM for ultra-high-speed operations.

#### GET `/api/v6/challenges/drizzle`
Lists all challenges using Drizzle query builders.

#### POST `/api/v6/challenges/drizzle`
Inserts a challenge record using Drizzle insert statements.

#### PUT `/api/v6/challenges/drizzle/:id`
Updates a challenge record using Drizzle update statements.

#### DELETE `/api/v6/challenges/drizzle/:id`
Deletes a challenge record using Drizzle delete statements.

---

### 3. Utility Endpoints

#### GET `/api/v6/challenges/types`
Returns active challenge categories.

#### GET `/api/v6/challenges/tracks`
Returns active challenge tracks.

#### GET `/health`
System health check returns status, active engine types, and database connectivity.

---

## Installation and Execution Setup

### 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: Local or hosted database instance
- **Git**: Working version tracking toolchain

### 2. Database Environmental Setup

Create a `.env` file in the root directory to store database connection details:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/challenges?schema=public"
PORT=5000
NODE_ENV=development
```

### 3. Database Migration Procedures

Run the following commands to initialize and update your PostgreSQL database schemas:

```bash
# Apply Prisma migrations to set up the tables
npx prisma migrate dev --name init

# Generate Prisma Type-safe Clients
npx prisma generate
```

### 4. Application Build and Execution

#### To build and run the full stack application in production mode:

```bash
# Install root backend dependencies
npm install

# Install React frontend dependencies
cd frontend
npm install --legacy-peer-deps
cd ..

# Build React and TypeScript source bundles
npm run build-frontend
npm run build

# Start the compiled production server
npm start
```

#### To run in active developer hot-reload mode:

```bash
# Run backend development server (listens on http://localhost:5000)
npm run dev

# Run frontend development server in a separate terminal:
cd frontend
npm run dev
```

---

## Code Quality and Git Branch Guidelines

The project adopts strict structural conventions:

### Git Commits
- Use semantic commit headers for history tracking:
  - `feat: [Description]` for new implementations.
  - `fix: [Description]` for bugs or structural adjustments.
  - `docs: [Description]` for documentation additions.
- Ensure each commit represents a single logically complete step. No large monolithic commits.

### Code Style
- Written strictly in **TypeScript** to prevent type coercion and null pointer exceptions.
- Consistent folder separation:
  - `/src/controllers` handles route handlers.
  - `/src/middleware` houses Express filters and input checks.
  - `/src/routes` lists URL endpoints.
  - `/src/drizzle` and `/prisma` house ORM schema states.
  - `/frontend` contains the standalone React dashboard.
