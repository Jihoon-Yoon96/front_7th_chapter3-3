import { callAPI } from "../../../../shared/lib/callAPI"

export const deleteComment = async (commentId: number): Promise<{ success: boolean }> => {
  const data = await callAPI<{ success: boolean }>(`/comments/${commentId}`, {
    method: "DELETE",
  })
  return data
}