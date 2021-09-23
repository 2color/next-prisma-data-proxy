import React, { useCallback, useEffect, useState } from 'react'
import Loader from 'react-loader-spinner'
import styles from '../styles/Main.module.css'
import { Post, Comment } from '@prisma/client'
import Comments from './comments'
import Head from 'next/head'

type PostProps = {
  post: Post & {
    comments: Comment[] | null
  }
  onDeletePost: (id: number) => Promise<void>
  onSubmitComment: (postId: number, comment: string) => Promise<Comment>
  onLikePost: (postId: number) => Promise<{ likes: number }>
  onViewPost: (postId: number) => Promise<{ views: number }>
}

const PostComponent: React.FC<PostProps> = ({
  post,
  onDeletePost,
  onSubmitComment,
  onLikePost,
  onViewPost,
}) => {
  const [likesCount, setLikesCount] = useState(post.likes)
  const [viewsCount, setViewsCount] = useState(post.views)
  const [isPostingComment, setPostingComment] = useState(false)
  const [comments, setComments] = useState(post.comments || [])
  const [comment, setComment] = useState('')
  useEffect(() => {
    const updatePostViews = async () => {
      const { views } = await onViewPost(post.id)
      setViewsCount(views)
    }
    updatePostViews()
  }, [onViewPost, post.id])

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (comment.length === 0) return
      setPostingComment(true)
      const createdComment = await onSubmitComment(post.id, comment)
      setPostingComment(false)
      setComment('')
      setComments((comments) => [...comments, createdComment])
    },
    [onSubmitComment, comment, post.id],
  )
  const onLike = useCallback(
    async (e) => {
      e.preventDefault()
      const { likes } = await onLikePost(post.id)
      setLikesCount(likes)
    },
    [setLikesCount, onLikePost, post.id],
  )
  return (
    <div className={styles.container}>
      <Head>
        <title>{post.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
      <p>
        <strong>Views:</strong> {viewsCount}
        <br />
        <button onClick={onLike} className={styles.likeButton} type="button">
          <Loader
            visible={isPostingComment}
            type="Oval"
            color="white"
            height="15"
            width="15"
          />{' '}
          👍 {likesCount}
        </button>
      </p>

      {comments?.length ? <Comments comments={comments} /> : null}
      <form className={styles.commentForm} onSubmit={onSubmit}>
        <input
          id="comment"
          type="comment"
          aria-label=""
          placeholder="Enter your comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
          }}
        />
        <button
          disabled={comment.length === 0}
          className={styles.createButton}
          type="submit"
        >
          <Loader
            visible={isPostingComment}
            type="Oval"
            color="white"
            height="15"
            width="15"
          />{' '}
          Submit
        </button>
      </form>
      <button
        className={styles.deleteButton}
        onClick={() => onDeletePost(post.id)}
      >
        Delete Post
      </button>
    </div>
  )
}

export default PostComponent
