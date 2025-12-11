import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from "../../../../shared/ui"
import { Post } from "../../../../entities/post/model/types"

interface EditPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPost: Post | null
  onPostChange: (field: keyof Post, value: string) => void
  onUpdatePost: () => void
}

export const EditPostDialog = ({
  open,
  onOpenChange,
  selectedPost,
  onPostChange,
  onUpdatePost,
}: EditPostDialogProps) => {
  if (!selectedPost) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost.title || ""}
            onChange={(e) => onPostChange("title", e.target.value)}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost.body || ""}
            onChange={(e) => onPostChange("body", e.target.value)}
          />
          <Button onClick={onUpdatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
