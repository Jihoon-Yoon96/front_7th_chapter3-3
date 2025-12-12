import { Comment } from "../../../../entities/comment/model/types"
import { callAPI } from "../../../../shared/lib/callAPI"

export const updateComment = async (id: number, body: string): Promise<Comment> => {
  const data = await callAPI<Comment>(`/comments/${id}`, {
    method: "PUT",
    body: { body },
  })
  return data
}
