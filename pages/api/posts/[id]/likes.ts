import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const postId = req.query.id
  if (req.method === 'PUT') {
    const post = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    })

    res.json({ id: post.id, likes: post.likes })
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    )
  }
}
