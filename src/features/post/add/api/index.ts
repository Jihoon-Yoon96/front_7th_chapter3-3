import { Post } from "../../../../entities/post/model/types"
import { callAPI } from "../../../../shared/lib/callAPI"

export const addPost = async (newPost: Pick<Post, "title" | "body" | "userId">): Promise<Post> => {
  const data = await callAPI<Post>("/posts/add", {
    method: "POST",
    body: newPost,
  })
  return data
}
