import { atom, useAtom } from "jotai"
import { PostWithAuthor } from "./types"
import {
  fetchPosts as apiFetchPosts,
  fetchPostsByTag as apiFetchPostsByTag,
  searchPosts as apiSearchPosts,
} from "../api"

const postsAtom = atom<PostWithAuthor[]>([])
const totalPostsAtom = atom(0)
const postsLoadingAtom = atom(false)

export const usePosts = () => {
  const [posts, setPosts] = useAtom(postsAtom)
  const [total, setTotal] = useAtom(totalPostsAtom)
  const [loading, setLoading] = useAtom(postsLoadingAtom)

  const fetchPosts = async (limit: number, skip: number, sortBy: string, sortOrder: string) => {
    setLoading(true)
    try {
      const { posts: fetchedPosts, total: fetchedTotal } = await apiFetchPosts(limit, skip, sortBy, sortOrder)
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

  return {
    posts,
    total,
    loading,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
    setPosts,
  }
}
