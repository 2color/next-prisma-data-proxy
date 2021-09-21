import React from 'react'
import styles from '../styles/Main.module.css'
import { Comment } from '@prisma/client'

interface CommentsProps {
  comments: Comment[]
}

const Comments: React.FC<CommentsProps> = (props) => {
  return (
    <div className={styles.comments}>
      <h2>Comments</h2>
      <ul>
        {props.comments.map((comment) => (
          <li key={comment.id}>{comment.comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default Comments
