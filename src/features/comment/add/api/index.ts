import { Comment } from "../../../../entities/comment/model/types"
import { callAPI } from "../../../../shared/lib/callAPI"

export const addComment = async (newComment: { body: string; postId: number; userId: number }): Promise<Comment> => {
  const data = await callAPI<Comment>("/comments/add", {
    method: "POST",
    body: newComment,
  })
  return data
}
