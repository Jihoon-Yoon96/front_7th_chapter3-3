import { Trash2 } from "lucide-react"
import { Button } from "../../../../shared/ui"

interface DeleteCommentButtonProps {
  commentId: number
  onDelete: (commentId: number) => void
}

export const DeleteCommentButton = ({ commentId, onDelete }: DeleteCommentButtonProps) => {
  const handleDelete = () => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      onDelete(commentId)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete}>
      <Trash2 className="w-3 h-3" />
    </Button>
  )
}
