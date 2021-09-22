import { GetStaticPaths, GetStaticProps } from 'next'
import PostComponent from '../../components/post'
import { useRouter } from 'next/router'
import { Post, Comment } from '@prisma/client'
import { deletePost, incrementLikes, incrementViews, submitComment } from '../../lib/api'
import prisma from 'lib/prisma'

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch existing posts from the database
  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
  })

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: String(post.id) },
  }))

  return {
    paths,
    // If an ID is requested that isn't defined here, fallback will incrementally generate the page
    fallback: true,
  }
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const matchedPost = await prisma.post.findUnique({
    where: {
      id: Number(params?.id),
    },
    include: {
      comments: {
        orderBy: {
          id: 'asc',
        },
      },
    },
  })

  return {
    props: {
      post: matchedPost,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1,
  }
}

type PostPageProps = {
  post: Post & {
    comments: Comment[]
  }
}

const PostPage: React.FC<PostPageProps> = (props) => {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <PostComponent
      post={props.post}
      onDeletePost={deletePost}
      onSubmitComment={submitComment}
      onLikePost={incrementLikes}
      onViewPost={incrementViews}
    />
  )
}

export default PostPage
