import { Post, PostWithAuthor } from "../model/types"
import { User } from "../../user/model/types"

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
  const postsResponse = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  const postsData: FetchPostsResponse = await postsResponse.json()

  const usersResponse = await fetch("/api/users?limit=0&select=username,image")
  const usersData: FetchUsersResponse = await usersResponse.json()

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
  const response = await fetch(`/api/posts/search?q=${searchQuery}`)
  const data: FetchPostsResponse = await response.json()
  return data
}

export const fetchPostsByTag = async (tag: string): Promise<FetchPostsResponse> => {
  const [postsResponse, usersResponse] = await Promise.all([
    fetch(`/api/posts/tag/${tag}`),
    fetch("/api/users?limit=0&select=username,image"),
  ])
  const postsData: FetchPostsResponse = await postsResponse.json()
  const usersData: FetchUsersResponse = await usersResponse.json()

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
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  })
  const data: Post = await response.json()
  return data
}

export const updatePost = async (post: Post): Promise<Post> => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  const data: Post = await response.json()
  return data
}

export const deletePost = async (id: number): Promise<void> => {
  await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
}
