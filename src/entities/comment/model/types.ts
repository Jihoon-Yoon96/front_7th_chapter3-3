import { User } from "../../user/model/types"

export interface Comment {
  id: number
  body: string
  postId: number
  likes: number
  user: Pick<User, "id" | "username">
}
