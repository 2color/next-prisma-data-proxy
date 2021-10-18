import { PrismaClient } from '@prisma/client'
import { seedPosts } from '../lib/posts'

const prisma = new PrismaClient()

async function main() {
  const promises = []
  for (const post of seedPosts) {
    promises.push(
      prisma.post.create({
        data: {
          title: post.title,
          excerpt: post.excerpt,
          comments: {
            create: post.comments.map((comment) => ({ comment })),
          },
        },
      }),
    )
  }
  const createdPosts = await Promise.all(promises)

  console.log(`Created ${createdPosts.length} posts`)
}

main().finally(async () => await prisma.$disconnect)
