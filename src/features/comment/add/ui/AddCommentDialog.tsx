import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../../shared/ui"
import { useState } from "react"

interface AddCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddComment: (body: string) => void
}

export const AddCommentDialog = ({ open, onOpenChange, onAddComment }: AddCommentDialogProps) => {
  const [newCommentBody, setNewCommentBody] = useState("")

  const handleAddComment = () => {
    if (!newCommentBody.trim()) return
    onAddComment(newCommentBody)
    setNewCommentBody("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newCommentBody}
            onChange={(e) => setNewCommentBody(e.target.value)}
          />
          <Button onClick={handleAddComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
