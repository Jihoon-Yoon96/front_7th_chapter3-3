import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../../shared/ui"
import { useState } from "react"
import { useAddComment } from "../model/useAddComment"

interface AddCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: number | null
}

export const AddCommentDialog = ({ open, onOpenChange, postId }: AddCommentDialogProps) => {
  const [newCommentBody, setNewCommentBody] = useState("")
  const { mutate: addComment, isPending } = useAddComment()

  const handleAddComment = async () => {
    if (!postId || !newCommentBody.trim()) return
    try {
      await addComment({ body: newCommentBody, postId, userId: 1 }) // userId는 임시로 1로 설정
      setNewCommentBody("")
      onOpenChange(false)
    } catch (error) {
      // 에러는 useAddComment 훅에서 처리됩니다.
    }
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
          <Button onClick={handleAddComment} disabled={isPending}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
