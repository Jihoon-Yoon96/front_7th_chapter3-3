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
