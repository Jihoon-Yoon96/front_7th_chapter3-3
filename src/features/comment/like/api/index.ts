import { Comment } from "../../../../entities/comment/model/types"
import { callAPI } from "../../../../shared/lib/callAPI"

export const likeComment = async (id: number, currentLikes: number): Promise<Comment> => {
  const data = await callAPI<Comment>(`/comments/${id}`, {
    method: "PUT",
    body: { likes: currentLikes + 1 },
  })
  return data
}
