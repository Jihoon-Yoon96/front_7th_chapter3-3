import { Trash2 } from "lucide-react"
import { Button } from "../../../../shared/ui"
import { useComments } from "../../../../entities/comment/model/useComment"

interface DeleteCommentButtonProps {
  commentId: number
  postId: number
}

export const DeleteCommentButton = ({ commentId, postId }: DeleteCommentButtonProps) => {
  const { deleteComment } = useComments()

  const handleDelete = async () => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        await deleteComment(commentId, postId)
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
