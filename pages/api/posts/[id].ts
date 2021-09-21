import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const postId = req.query.id
  if (req.method === 'DELETE') {
    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    }),
      res.json({ message: `Post ${postId} deleted` })
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    )
  }
}
