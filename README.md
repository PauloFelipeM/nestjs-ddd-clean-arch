# Nest Clean - Forum API

Forum API built with NestJS following **Clean Architecture**, **DDD**, and **Event-Driven Architecture** principles.

## Tech Stack

- **Framework:** NestJS 11
- **Language:** TypeScript 5.7
- **Database:** PostgreSQL 16 + Prisma ORM
- **Cache:** Redis + ioredis
- **Authentication:** JWT (RS256) with Passport.js
- **Storage:** AWS S3 / Cloudflare R2
- **Validation:** Zod
- **Testing:** Vitest + Supertest

## Architecture

```
src/
├── core/                # Base entities, Either monad, domain events
├── domain/
│   ├── forum/           # Forum domain (questions, answers, comments, attachments)
│   │   ├── application/ # Repository interfaces and use cases
│   │   └── enterprise/  # Entities, value objects, and events
│   └── notification/    # Notification domain
│       ├── application/ # Subscribers and use cases
│       └── enterprise/  # Notification entity
└── infra/               # Infrastructure layer
    ├── auth/            # JWT strategy and guards
    ├── cache/           # Redis cache repository
    ├── database/        # Prisma client and repositories
    ├── http/            # Controllers, pipes, and presenters
    ├── storage/         # R2 storage (S3)
    └── events/          # Event handling (NestJS)
```

## Prerequisites

- Node.js
- Docker and Docker Compose

## Setup

```bash
# Install dependencies
npm install

# Start PostgreSQL and Redis
docker-compose up -d

# Run migrations
npx prisma migrate dev

# Copy environment variables
cp .env.example .env
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_PRIVATE_KEY` | RS256 private key (base64) | - |
| `JWT_PUBLIC_KEY` | RS256 public key (base64) | - |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare R2 account ID | - |
| `AWS_BUCKET_NAME` | S3/R2 bucket name | - |
| `AWS_ACCESS_KEY_ID` | AWS/R2 access key | - |
| `AWS_SECRET_ACCESS_KEY` | AWS/R2 secret key | - |
| `REDIS_HOST` | Redis host | `127.0.0.1` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_DB` | Redis database | `0` |
| `PORT` | Application port | `3333` |

## Running the Application

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Tests

```bash
# Unit tests
npm run test

# Unit tests (watch)
npm run test:watch

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## Endpoints

### Authentication

| Method | Route | Description |
|---|---|---|
| `POST` | `/accounts` | Create account |
| `POST` | `/session` | Authenticate and get JWT |

### Questions (requires JWT)

| Method | Route | Description |
|---|---|---|
| `POST` | `/questions` | Create question |
| `GET` | `/questions?page=1` | List recent questions |
| `GET` | `/questions/:slug` | Get question by slug |
| `PUT` | `/questions/:id` | Edit question |
| `DELETE` | `/questions/:id` | Delete question |

### Answers (requires JWT)

| Method | Route | Description |
|---|---|---|
| `POST` | `/questions/:questionId/answers` | Answer a question |
| `GET` | `/questions/:questionId/answers` | List answers for a question |
| `PUT` | `/answers/:id` | Edit answer |
| `DELETE` | `/answers/:id` | Delete answer |
| `PATCH` | `/answers/:answerId/choose-as-best` | Choose best answer |

### Comments (requires JWT)

| Method | Route | Description |
|---|---|---|
| `POST` | `/questions/:questionId/comments` | Comment on a question |
| `POST` | `/answers/:answerId/comments` | Comment on an answer |
| `GET` | `/questions/:questionId/comments` | List question comments |
| `GET` | `/answers/:answerId/comments` | List answer comments |
| `DELETE` | `/questions/:questionId/comments/:commentId` | Delete question comment |
| `DELETE` | `/answers/:answerId/comments/:commentId` | Delete answer comment |

### Attachments (requires JWT)

| Method | Route | Description |
|---|---|---|
| `POST` | `/attachments` | Upload file (PNG, JPG, JPEG, PDF - max 2MB) |

### Notifications (requires JWT)

| Method | Route | Description |
|---|---|---|
| `PATCH` | `/notifications/:notificationId/read` | Mark notification as read |

## Use Cases

**Forum:**
- Create, edit, and delete questions
- Answer questions and choose best answer
- Comment on questions and answers
- List recent questions with pagination
- Get question by slug
- Upload attachments

**Notifications:**
- Automatic notification when an answer is created
- Notification when best answer is chosen
- Mark notification as read

## Patterns

- **Clean Architecture** - Separation between domain, application, and infrastructure
- **DDD** - Rich entities, Aggregate Roots, Value Objects (Slug)
- **Either Monad** - Functional error handling
- **Repository Pattern** - Data access abstraction
- **Domain Events** - Domain events with subscribers
- **Dependency Injection** - NestJS IoC container
