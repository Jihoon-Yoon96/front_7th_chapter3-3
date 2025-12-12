import { ThumbsUp } from "lucide-react"
import { Button } from "../../../../shared/ui"

interface LikeCommentButtonProps {
  commentId: number
  likes: number
  onLike: (commentId: number, currentLikes: number) => void
}

export const LikeCommentButton = ({ commentId, likes, onLike }: LikeCommentButtonProps) => {
  const handleLike = () => {
    onLike(commentId, likes)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLike}>
      <ThumbsUp className="w-3 h-3" />
      <span className="ml-1 text-xs">{likes}</span>
    </Button>
  )
}
