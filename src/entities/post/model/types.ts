import { User } from "../../user/model/types"

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  author?: Pick<User, "id" | "username" | "image"> // Post 목록에서는 일부 정보만 사용
}

export interface PostWithAuthor extends Post {
  author: Pick<User, "id" | "username" | "image">
}
