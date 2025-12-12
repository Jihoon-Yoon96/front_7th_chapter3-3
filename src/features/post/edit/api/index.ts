import { Post } from "../../../../entities/post/model/types"
import { callAPI } from "../../../../shared/lib/callAPI"

export const updatePost = async (post: Post): Promise<Post> => {
  const data = await callAPI<Post>(`/posts/${post.id}`, {
    method: "PUT",
    body: post,
  })
  return data
}
