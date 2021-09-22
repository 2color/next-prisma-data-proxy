// @ts-check
import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Trend } from 'k6/metrics'

let GetPostsTrend = new Trend('Get posts', true)
let CreatePostTrend = new Trend('Create post', true)
let CreateCommentTrend = new Trend('Create comment', true)
let LikePostTrend = new Trend('Like post', true)
let ViewPostTrend = new Trend('View post', true)

export let options = {
  vus: 40,
  duration: '15s',
}

const SLEEP_DURATION = 0.1

const baseUrl = 'http://localhost:3000/api'
// const baseUrl = `https://${__ENV.API_URL}`

// Get posts          http localhost:3000/api/posts
// Get post/comments  http localhost:3000/api/posts/1
// Create post        http POST localhost:3000/api/posts
// Create comment     http POST localhost:3000/api/comment postId=1
// View post          http PUT localhost:3000/api/post/1/views
// Like post          http PUT localhost:3000/api/post/1/likes

export default function () {
  group('user flow', function () {
    // Get posts
    let getPostsRes = http.get(`${baseUrl}/posts`)
    check(getPostsRes, { 'status 200 (get feed)': (r) => r.status == 200 })
    GetPostsTrend.add(getPostsRes.timings.duration)

    sleep(SLEEP_DURATION)

    // Create Post
    let createPostRes = http.post(`${baseUrl}/posts`)
    check(createPostRes, {
      'status 200 (create post)': (r) => r.status == 200,
    })
    CreatePostTrend.add(createPostRes.timings.duration)
    const createdPostId = JSON.parse(String(createPostRes.body)).id

    sleep(SLEEP_DURATION)

    // Create comment
    let createCommentRes = http.post(
      `${baseUrl}/comments`,
      JSON.stringify({
        postId: createdPostId,
        comment: 'comment from loadtest',
      }),
    )
    check(createCommentRes, {
      'status 200 (create comment)': (r) => r.status == 200,
    })
    CreateCommentTrend.add(createCommentRes.timings.duration)

    sleep(SLEEP_DURATION)

    // Add view to post
    let createViewRes = http.put(`${baseUrl}/posts/${createdPostId}/views`)
    check(createViewRes, {
      'status 200 (view post)': (r) => r.status == 200,
    })
    ViewPostTrend.add(createViewRes.timings.duration)

    sleep(SLEEP_DURATION)

    // Add view to post
    let createLikeRes = http.put(`${baseUrl}/posts/${createdPostId}/likes`)
    check(createLikeRes, {
      'status 200 (view post)': (r) => r.status == 200,
    })
    LikePostTrend.add(createLikeRes.timings.duration)
  })
}
