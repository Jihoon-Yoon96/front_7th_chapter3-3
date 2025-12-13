import { Comment } from "../../../../entities/comment/model/types"
import { callAPI } from "../../../../shared/lib/callAPI"

export const likeComment = async (commentId: number, currentLikes: number): Promise<Comment> => {
  const data = await callAPI<Comment>(`/comments/${commentId}`, {
    method: "PATCH",
    body: { likes: currentLikes + 1 },
  })
  return data
}