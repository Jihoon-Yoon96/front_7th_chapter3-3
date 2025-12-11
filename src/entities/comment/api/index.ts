import { Comment } from "../model/types"
import { callAPI } from "../../../shared/lib/callAPI"

interface FetchCommentsResponse {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}

export const fetchCommentsByPostId = async (postId: number): Promise<FetchCommentsResponse> => {
  const data = await callAPI<FetchCommentsResponse>(`/comments/post/${postId}`)
  return data
}

export const addComment = async (newComment: { body: string; postId: number; userId: number }): Promise<Comment> => {
  const data = await callAPI<Comment>("/comments/add", {
    method: "POST",
    body: newComment,
  })
  return data
}

export const updateComment = async (id: number, body: string): Promise<Comment> => {
  const data = await callAPI<Comment>(`/comments/${id}`, {
    method: "PUT",
    body: { body },
  })
  return data
}

export const deleteComment = async (id: number): Promise<void> => {
  await callAPI<void>(`/comments/${id}`, {
    method: "DELETE",
  })
}

export const likeComment = async (id: number, currentLikes: number): Promise<Comment> => {
  const data = await callAPI<Comment>(`/comments/${id}`, {
    method: "PUT",
    body: { likes: currentLikes + 1 },
  })
  return data
}
