import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Loader from 'react-loader-spinner'
import styles from '../styles/Main.module.css'
import { Post } from '@prisma/client'
import { useCallback, useState } from 'react'
import { createPost, resetPosts } from 'lib/api'
import prisma from 'lib/prisma'

// 👇 called at build time
export const getStaticProps: GetStaticProps = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      id: 'desc',
    },
  })
  return {
    props: {
      posts,
    },
    revalidate: 1
  }
}

interface HomeProps {
  posts: Post[]
}

const Home: React.FC<HomeProps> = (props) => {
  const [posts, setPosts] = useState(props.posts)
  const [isLoadingPost, setLoadingPost] = useState(false)
  const [isLoadingReset, setLoadingReset] = useState(false)

  const onCreatePost = useCallback(async () => {
    setLoadingPost(true)
    const post = await createPost()
    setPosts([post, ...posts])
    setLoadingPost(false)
  }, [posts, setLoadingPost, setPosts])

  const onResetPosts = useCallback(async () => {
    setLoadingReset(true)
    const posts = await resetPosts()
    setPosts(posts)
    setLoadingReset(false)
  }, [setPosts, setLoadingReset])

  return (
    <div className={styles.container}>
      <Head>
        <title>Prisma Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Next.js & Prisma</h1>
        <h2 className={styles.subtitle}>Databases in Serverless Made Easy</h2>
        <div className={styles.buttons}>
          <button className={styles.createButton} onClick={onCreatePost}>
            {
              <Loader
                visible={isLoadingPost}
                type="Oval"
                color="white"
                height="15"
                width="15"
              />
            }{' '}
            Create Post
          </button>
          <button className={styles.createButton} onClick={onResetPosts}>
            {
              <Loader
                visible={isLoadingReset}
                type="Oval"
                color="white"
                height="15"
                width="15"
              />
            }{' '}
            Reset Posts
          </button>
        </div>
        <div className={styles.grid}>
          {posts.map((p: Post) => {
            return (
              <div key={`${p.id}`} className={styles.card}>
                <a>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <div className={styles.buttons}>
                    <Link
                      passHref
                      href={`/post_ssr/${p.id}`}
                      key={`${p.id}-ssr`}
                    >
                      <button className={styles.navigationButton}>SSR</button>
                    </Link>
                    <Link
                      passHref
                      href={`/post_inc/${p.id}`}
                      key={`${p.id}-static`}
                    >
                      <button className={styles.navigationButton}>
                        Static
                      </button>
                    </Link>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default Home
