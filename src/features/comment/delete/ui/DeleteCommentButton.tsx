import { Trash2 } from "lucide-react"
import { Button } from "../../../../shared/ui"
import { useComments } from "../../../../entities/comment/model/useComment"
import { deleteComment as apiDeleteComment } from "../api"

interface DeleteCommentButtonProps {
  commentId: number
  postId: number
}

export const DeleteCommentButton = ({ commentId, postId }: DeleteCommentButtonProps) => {
  const { setComments } = useComments()

  const handleDelete = async () => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        await apiDeleteComment(commentId)
        setComments((prev) => ({
          ...prev,
          [postId]: prev[postId].filter((comment) => comment.id !== commentId),
        }))
      } catch (error) {
        console.error("댓글 삭제 오류:", error)
      }
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete}>
      <Trash2 className="w-3 h-3" />
    </Button>
  )
}
