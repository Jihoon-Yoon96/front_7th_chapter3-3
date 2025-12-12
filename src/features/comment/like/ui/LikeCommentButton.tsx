import { ThumbsUp } from "lucide-react"
import { Button } from "../../../../shared/ui"
import { useComments } from "../../../../entities/comment/model/useComment"
import { likeComment as apiLikeComment } from "../api"

interface LikeCommentButtonProps {
  commentId: number
  postId: number
  likes: number
}

export const LikeCommentButton = ({ commentId, postId, likes }: LikeCommentButtonProps) => {
  const { comments, setComments } = useComments()

  const handleLike = async () => {
    try {
      const currentLikes = comments[postId].find((c) => c.id === commentId)?.likes || 0
      const data = await apiLikeComment(commentId, currentLikes)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) => (comment.id === data.id ? { ...data, likes:comment.likes+1 } : comment)),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLike}>
      <ThumbsUp className="w-3 h-3" />
      <span className="ml-1 text-xs">{likes}</span>
    </Button>
  )
}
