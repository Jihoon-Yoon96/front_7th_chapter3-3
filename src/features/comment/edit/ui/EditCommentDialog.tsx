import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../../shared/ui"
import { useEffect, useState } from "react"
import { Comment } from "../../../../entities/comment/model/types"
import { useComments } from "../../../../entities/comment/model/useComment"
import { updateComment as apiUpdateComment } from "../api"

interface EditCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedComment: Comment | null
}

export const EditCommentDialog = ({ open, onOpenChange, selectedComment }: EditCommentDialogProps) => {
  const [editedCommentBody, setEditedCommentBody] = useState("")
  const { setComments } = useComments()

  useEffect(() => {
    if (selectedComment) {
      setEditedCommentBody(selectedComment.body)
    } else {
      setEditedCommentBody("")
    }
  }, [selectedComment])

  const handleUpdateComment = async () => {
    if (!selectedComment || !editedCommentBody.trim()) return
    try {
      const data = await apiUpdateComment(selectedComment.id, editedCommentBody)
      setComments((prev) => ({
        ...prev,
        [selectedComment.postId]: prev[selectedComment.postId].map((comment) =>
          comment.id === data.id ? data : comment,
        ),
      }))
      onOpenChange(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
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
