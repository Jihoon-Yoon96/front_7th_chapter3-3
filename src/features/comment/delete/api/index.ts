import { callAPI } from "../../../../shared/lib/callAPI"

export const deleteComment = async (id: number): Promise<void> => {
  await callAPI<void>(`/comments/${id}`, {
    method: "DELETE",
  })
}
