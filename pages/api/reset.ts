import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { seedPosts } from 'lib/posts'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await prisma.post.deleteMany()
  const txs = []

  for (const post of seedPosts) {
    txs.push(
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
  const createdPosts = await prisma.$transaction(txs)

  res.statusCode = 200
  res.json(createdPosts)
}
