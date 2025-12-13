import { Comment } from "../../../../entities/comment/model/types"
import { callAPI } from "../../../../shared/lib/callAPI"

export const updateComment = async (commentId: number, body: string): Promise<Comment> => {
  const data = await callAPI<Comment>(`/comments/${commentId}`, {
    method: "PATCH", // PUT 대신 PATCH를 사용하여 부분 수정을 명시
    body: { body },
  })
  return data
}