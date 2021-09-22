# Next.js Prisma Data Platform Demo

This is an example blog app showing how to use the Prisma ORM with the Prisma Data Proxy in a Next.js app deployed to Vercel.

For comparison the blog uses two rendering approaches to display blog posts:
- **server-side rendering**
– **static generation with incremental static re-generation** 

## Installation

Clone the repo and install the dependencies:

```bash
# with npm
npm i
```
## Start the database

```bash
docker-compose up -d
```

## Set DATABASE_URL

Create `.env` by copying the example:

```bash
cp .env.example .env
```

Make sure that the `DATABASE_URL` has been set:

```
DATABASE_URL="postgresql://test-user:test-password@localhost:5432/vercel-prisma-data-proxy?schema=public"
```

## Create the database with Prisma Migrate

```bash
npx prisma migrate dev
```

## Run the App

```bash
# with npm
npm run dev
```