# Datasync

A data-sharing API built with NestJS. 



## API Endpoints

All endpoints require a valid Firebase Bearer token in the `Authorization` header.

### User A

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/form/company-details` | Submit company data (name, number of users, number of products). Percentage is auto-calculated. |
| GET | `/form/my-submissions` | View all of User A's form submissions |
| GET | `/form/my-uploads` | View all images uploaded to User A's account by User B |

### User B

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/form/latest/:userAId` | View User A's most recent form submission |
| POST | `/form/upload/:userAId` | Upload an image to User A's account (jpg, jpeg, png, gif -- max 5MB) |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/profile` | Returns the authenticated user's profile |


## Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Firebase project with Authentication enabled
- Cloudinary account

### Installation

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

- `PORT` -- Server port (defaults to 3000)
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` -- Database connection
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` -- Firebase Admin SDK credentials
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` -- Cloudinary credentials

### Running

```bash
# development
pnpm start:dev

# production
pnpm build
pnpm start:prod
```

### Testing

```bash
pnpm test
```

29 unit tests covering auth, form submissions, image uploads, and role-based access control.

## Project Structure

```
src/
  auth/           -- Firebase authentication, guards
  user/           -- User entity, service, DTOs
  form/           -- Form submissions, image uploads, Cloudinary integration
  database/       -- TypeORM + PostgreSQL configuration
```
