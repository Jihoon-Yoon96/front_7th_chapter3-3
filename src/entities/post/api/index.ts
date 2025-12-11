import { Post, PostWithAuthor } from "../model/types"
import { User } from "../../user/model/types"
import { callAPI } from "../../../shared/lib/callAPI"

interface FetchPostsResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

interface FetchUsersResponse {
  users: User[]
}

export const fetchPosts = async (limit: number, skip: number): Promise<FetchPostsResponse> => {
  const postsData = await callAPI<FetchPostsResponse>(`/posts?limit=${limit}&skip=${skip}`)

  const usersData = await callAPI<FetchUsersResponse>("/users?limit=0&select=username,image")

  const postsWithUsers: PostWithAuthor[] = postsData.posts.map((post) => ({
    ...post,
    author: usersData.users.find((user) => user.id === post.userId) as Pick<User, "id" | "username" | "image">,
  }))

  return {
    ...postsData,
    posts: postsWithUsers,
  }
}

export const searchPosts = async (searchQuery: string): Promise<FetchPostsResponse> => {
  const data = await callAPI<FetchPostsResponse>(`/posts/search?q=${searchQuery}`)
  return data
}

export const fetchPostsByTag = async (tag: string): Promise<FetchPostsResponse> => {
  const [postsData, usersData] = await Promise.all([
    callAPI<FetchPostsResponse>(`/posts/tag/${tag}`),
    callAPI<FetchUsersResponse>("/users?limit=0&select=username,image"),
  ])

  const postsWithUsers: PostWithAuthor[] = postsData.posts.map((post) => ({
    ...post,
    author: usersData.users.find((user) => user.id === post.userId) as Pick<User, "id" | "username" | "image">,
  }))

  return {
    ...postsData,
    posts: postsWithUsers,
  }
}

export const addPost = async (newPost: Pick<Post, "title" | "body" | "userId">): Promise<Post> => {
  const data = await callAPI<Post>("/posts/add", {
    method: "POST",
    body: newPost,
  })
  return data
}

export const updatePost = async (post: Post): Promise<Post> => {
  const data = await callAPI<Post>(`/posts/${post.id}`, {
    method: "PUT",
    body: post,
  })
  return data
}

export const deletePost = async (id: number): Promise<void> => {
  await callAPI<void>(`/posts/${id}`, {
    method: "DELETE",
  })
}
