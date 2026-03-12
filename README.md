# Datasync

A data-sharing API built with NestJS. 

## Documentation

Full Postman API documentation here: [datasync-docs](https://documenter.getpostman.com/view/24950715/2sBXiesu8E#c1db1179-f1b0-4b37-be39-a68198f39352)
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
