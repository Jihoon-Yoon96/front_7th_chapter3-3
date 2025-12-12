import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../../shared/ui"
import { useEffect, useState } from "react"
import { Comment } from "../../../../entities/comment/model/types"

interface EditCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedComment: Comment | null
  onUpdateComment: (id: number, body: string) => void
}

export const EditCommentDialog = ({
  open,
  onOpenChange,
  selectedComment,
  onUpdateComment,
}: EditCommentDialogProps) => {
  const [editedCommentBody, setEditedCommentBody] = useState("")

  useEffect(() => {
    if (selectedComment) {
      setEditedCommentBody(selectedComment.body)
    } else {
      setEditedCommentBody("")
    }
  }, [selectedComment])

  const handleUpdateComment = () => {
    if (!selectedComment || !editedCommentBody.trim()) return
    onUpdateComment(selectedComment.id, editedCommentBody)
  }

  if (!selectedComment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={editedCommentBody}
            onChange={(e) => setEditedCommentBody(e.target.value)}
          />
          <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
