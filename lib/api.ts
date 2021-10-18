import Router from 'next/router'
import { Comment, Post } from '@prisma/client'

export const deletePost = async (id: number): Promise<void> => {
  await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  })
  await Router.push('/')
}

export const submitComment = async (
  postId: number,
  comment: string,
): Promise<Comment> => {
  const response = await fetch(`/api/comments`, {
    method: 'POST',
    body: JSON.stringify({ postId, comment }),
  })
  const responseBody = await response.json()
  return responseBody
}

export const createPost = async (): Promise<Post> => {
  const response = await fetch(`/api/posts`, {
    method: 'POST',
  })
  const post = await response.json()
  return post
}

export const resetPosts = async (): Promise<Post[]> => {
  const response = await fetch(`/api/reset`, {
    method: 'POST',
  })
  const posts = await response.json()
  return posts
}

export const incrementLikes = async (
  postId: number,
): Promise<{ likes: number }> => {
  const response = await fetch(`/api/posts/${postId}/likes`, {
    method: 'PUT',
  })
  const responseBody = await response.json()
  return responseBody
}

export const incrementViews = async (
  postId: number,
): Promise<{ views: number }> => {
  const response = await fetch(`/api/posts/${postId}/views`, {
    method: 'PUT',
  })
  const responseBody = await response.json()
  return responseBody
}
