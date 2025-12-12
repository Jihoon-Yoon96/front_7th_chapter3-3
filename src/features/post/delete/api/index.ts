import { callAPI } from "../../../../shared/lib/callAPI"

export const deletePost = async (id: number): Promise<void> => {
  await callAPI<void>(`/posts/${id}`, {
    method: "DELETE",
  })
}
