import { atom, useAtom } from "jotai"
import { Post, PostWithAuthor } from "./types"
import {
  addPost as apiAddPost,
  deletePost as apiDeletePost,
  fetchPosts as apiFetchPosts,
  fetchPostsByTag as apiFetchPostsByTag,
  searchPosts as apiSearchPosts,
  updatePost as apiUpdatePost,
} from "../api"

const postsAtom = atom<PostWithAuthor[]>([])
const totalPostsAtom = atom(0)
const postsLoadingAtom = atom(false)

export const usePosts = () => {
  const [posts, setPosts] = useAtom(postsAtom)
  const [total, setTotal] = useAtom(totalPostsAtom)
  const [loading, setLoading] = useAtom(postsLoadingAtom)

  const fetchPosts = async (limit: number, skip: number) => {
    setLoading(true)
    try {
      const { posts: fetchedPosts, total: fetchedTotal } = await apiFetchPosts(limit, skip)
      setPosts(fetchedPosts)
      setTotal(fetchedTotal)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchPosts = async (query: string) => {
    setLoading(true)
    try {
      const { posts: searchedPosts, total: searchedTotal } = await apiSearchPosts(query)
      setPosts(searchedPosts)
      setTotal(searchedTotal)
    } catch (error) {
      console.error("Error searching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPostsByTag = async (tag: string) => {
    setLoading(true)
    try {
      const { posts: tagPosts, total: tagTotal } = await apiFetchPostsByTag(tag)
      setPosts(tagPosts)
      setTotal(tagTotal)
    } catch (error) {
      console.error("Error fetching posts by tag:", error)
    } finally {
      setLoading(false)
    }
  }

  const addPost = async (newPost: Pick<Post, "title" | "body" | "userId">) => {
    try {
      const data = await apiAddPost(newPost)
      setPosts((prevPosts) => [data as PostWithAuthor, ...prevPosts])
      return data
    } catch (error) {
      console.error("Error adding post:", error)
      throw error
    }
  }

  const updatePost = async (updatedPost: Post) => {
    try {
      const data = await apiUpdatePost(updatedPost)
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === data.id ? (data as PostWithAuthor) : post)))
      return data
    } catch (error) {
      console.error("Error updating post:", error)
      throw error
    }
  }

  const deletePost = async (id: number) => {
    try {
      await apiDeletePost(id)
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("Error deleting post:", error)
      throw error
    }
  }

  return {
    posts,
    total,
    loading,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
    addPost,
    updatePost,
    deletePost,
  }
}
