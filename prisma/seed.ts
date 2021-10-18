import { PrismaClient } from '@prisma/client'
import { seedPosts } from '../lib/posts'

const prisma = new PrismaClient()

async function main() {
  // console.log(`Created ${0} posts`)
}

main().finally(async () => await prisma.$disconnect())
