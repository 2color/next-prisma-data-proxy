import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const posts = await prisma.post.findMany({
      orderBy: {
        id: 'desc',
      },
      take: 10,
    })
    res.json(posts)
  } else if (req.method === 'POST') {
    const post = await prisma.post.create({
      data: {
        title: `New Post ✍️`,
        excerpt: `Prisma with Next.js`,
        comments: {
          create: [
            {
              comment: 'Comment 1',
            },
            {
              comment: 'Comment 2',
            },
            {
              comment: 'Comment 3',
            },
          ],
        },
      },
    })
    res.json(post)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    )
  }
}
