# Nextjs Prisma Seed

A demo project to show how to seed a db with Nextjs, Prisma and MongoDB.

## install

```bash
npx create-next-app@latest
npm i prisma ts-node -D
npm i @prisma/client
npx prisma init
```

## db and environment variables

- create a db in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get the connection string
- add .env to .gitignore
- set DATABASE_URL in .env

```bash
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<db-name>?retryWrites=true&w=majority"
```

## prisma schema

In /prisma/schema.prisma, change the schema according to your needs, e.g.:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Movie {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  title String
  releaseDate String
  overview String
  posterPath String
}
```

## generate prisma client

```bash
npx prisma generate
```

## export prisma client

In /src, create /lib/prisma.ts

```ts
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma
```

## seed data

Create seed-data.ts in the prisma folder.  
For local testing purposes, you could obtain an API key from [TMDB](https://www.themoviedb.org/).  
Then use the following endpoint en copy the results in an array:
`https://api.themoviedb.org/3/discover/movie?page=1&api_key=xxxx`

```ts
export const MOVIES = [{}, {}, {}]
```

Create seed.ts in the prisma folder.
Notice that we will only use the title, overview, release_date and poster_path properties.

```ts
import { PrismaClient } from '@prisma/client'
import { MOVIES } from './seed-data'

const prisma = new PrismaClient()

function seedMovies() {
  Promise.all(
    MOVIES.map(movie =>
      prisma.movie.create({
        data: {
          title: movie.title,
          overview: movie.overview,
          releaseDate: movie.release_date,
          posterPath: movie.poster_path
        }
      })
    )
  )
    .then(() => console.log('Movies seeded successfully'))
    .catch(error => console.error(error))
}

seedMovies()
```

## update package.json

```json
"prisma": "ts-node prisma/seed.ts"
```

## update tsconfig.json

```json
"ts-node": {
  "compilerOptions": {
    "module": "commonjs"
  }
}
```

## set up and seed db

```bash
npx prisma db push
npx prisma db seed
```
