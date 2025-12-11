import { atom, useAtom } from "jotai"
import { Comment } from "./types"
import {
  addComment as apiAddComment,
  deleteComment as apiDeleteComment,
  fetchCommentsByPostId as apiFetchCommentsByPostId,
  likeComment as apiLikeComment,
  updateComment as apiUpdateComment,
} from "../api"

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

  const addComment = async (newComment: { body: string; postId: number; userId: number }) => {
    try {
      const data = await apiAddComment(newComment)
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      return data
    } catch (error) {
      console.error("Error adding comment:", error)
      throw error
    }
  }

  const updateComment = async (commentId: number, body: string, postId: number) => {
    try {
      const data = await apiUpdateComment(commentId, body)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      return data
    } catch (error) {
      console.error("Error updating comment:", error)
      throw error
    }
  }

  const deleteComment = async (commentId: number, postId: number) => {
    try {
      await apiDeleteComment(commentId)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== commentId),
      }))
    } catch (error) {
      console.error("Error deleting comment:", error)
      throw error
    }
  }

  const likeComment = async (commentId: number, postId: number) => {
    try {
      const currentLikes = comments[postId].find((c) => c.id === commentId)?.likes || 0
      const data = await apiLikeComment(commentId, currentLikes)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) => (comment.id === data.id ? { ...comment, likes: data.likes+1 } : comment)),
      }))
    } catch (error) {
      console.error("Error liking comment:", error)
      throw error
    }
  }

  return {
    comments,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  }
}
