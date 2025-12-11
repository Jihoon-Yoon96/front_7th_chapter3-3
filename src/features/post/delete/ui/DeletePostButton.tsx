import { Trash2 } from "lucide-react"
import { Button } from "../../../../shared/ui"

interface DeletePostButtonProps {
  onDelete: () => void
}

export const DeletePostButton = ({ onDelete }: DeletePostButtonProps) => {
  const handleDelete = () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      onDelete()
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
