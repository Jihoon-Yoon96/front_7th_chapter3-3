import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../../shared/ui"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment as apiAddComment } from "../api"

interface AddCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: number | null
}

export const AddCommentDialog = ({ open, onOpenChange, postId }: AddCommentDialogProps) => {
  const [newCommentBody, setNewCommentBody] = useState("")
  const queryClient = useQueryClient()

  const { mutate: addComment } = useMutation({
    mutationFn: apiAddComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
      setNewCommentBody("")
      onOpenChange(false)
    },
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    },
  })

  const handleAddComment = () => {
    if (!postId || !newCommentBody.trim()) return
    addComment({ body: newCommentBody, postId, userId: 1 }) // userId는 임시로 1로 설정
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
