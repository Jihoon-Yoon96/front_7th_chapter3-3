import { ThumbsUp } from "lucide-react"
import { Button } from "../../../../shared/ui"
import { useComments } from "../../../../entities/comment/model/useComment"

interface LikeCommentButtonProps {
  commentId: number
  postId: number
  likes: number
}

export const LikeCommentButton = ({ commentId, postId, likes }: LikeCommentButtonProps) => {
  const { likeComment } = useComments()

  const handleLike = async () => {
    try {
      await likeComment(commentId, postId)
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
