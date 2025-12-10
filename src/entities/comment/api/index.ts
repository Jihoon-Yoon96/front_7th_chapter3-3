import { Comment } from "../model/types"

interface FetchCommentsResponse {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}

export const fetchCommentsByPostId = async (postId: number): Promise<FetchCommentsResponse> => {
  const response = await fetch(`/api/comments/post/${postId}`)
  const data: FetchCommentsResponse = await response.json()
  return data
}

export const addComment = async (newComment: Pick<Comment, "body" | "postId" | "userId">): Promise<Comment> => {
  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComment),
  })
  const data: Comment = await response.json()
  return data
}

export const updateComment = async (commentId: number, body: string): Promise<Comment> => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  })
  const data: Comment = await response.json()
  return data
}

export const deleteComment = async (commentId: number): Promise<void> => {
  await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  })
}

export const likeComment = async (commentId: number, currentLikes: number): Promise<Comment> => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: currentLikes + 1 }),
  })
  const data: Comment = await response.json()
  return data
}
