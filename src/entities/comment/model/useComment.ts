import { atom, useAtom } from "jotai"
import { Comment } from "./types"
import { fetchCommentsByPostId as apiFetchCommentsByPostId } from "../api"

const commentsAtom = atom<{ [postId: number]: Comment[] }>({})

export const useComments = () => {
  const [comments, setComments] = useAtom(commentsAtom)

  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // Already fetched
    try {
      const data = await apiFetchCommentsByPostId(postId)
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  return {
    comments,
    setComments,
    fetchComments,
  }
}
