import { PrismaClient } from '@prisma/client'
import { seedPosts } from '../lib/posts'

const prisma = new PrismaClient()

async function main() {
  const post = await prisma.post.create({
    data: {
      title: 'Hello world!',
      excerpt: 'Welcome to Next.js and Prisma',
      comments: {
        create: [
          {
            comment: 'Intersting!',
          },
          {
            comment: 'Wow!',
          },
        ],
      },
    },
  })
  console.log(`Created ${post.id}`)
}

main().finally(async () => await prisma.$disconnect())
