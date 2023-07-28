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
