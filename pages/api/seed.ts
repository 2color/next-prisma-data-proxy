import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await prisma.post.deleteMany()
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

  res.statusCode = 200
  res.json(createdPosts)
}

export const seedPosts = [
  {
    title: 'Prisma Simplifies Database Access',
    excerpt: "Let's take a look at how Prisma makes database access a breeze",
    comments: ['Interesting post', 'Such a breeze reminds me of the ocean'],
  },
  {
    title: 'Next.js is the Best React Framework',
    excerpt: 'See how you can develop and ship faster with Next.js',
    comments: [
      'Love Next.js',
      'Next.js reduced our development process by 50%!',
    ],
  },
  {
    title: 'How to Create Models with Prisma',
    excerpt: 'The Prisma Schema Language helps you easily shape your data',
    comments: [
      'Why is the Prisma schema necessary?',
      'How do you define m-n relations?',
    ],
  },
  {
    title: 'Accessing Data in Next.js with Prisma',
    excerpt: 'Prisma is the perfect database companion for Next.js apps',
    comments: ['What is Prisma?', 'Does Prisma support PostgreSQL?'],
  },
]
