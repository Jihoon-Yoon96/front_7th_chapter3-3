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

interface AddPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newPost: Pick<Post, "title" | "body" | "userId">
  onNewPostChange: (field: keyof Pick<Post, "title" | "body" | "userId">, value: string | number) => void
  onAddPost: () => void
}

export const AddPostDialog = ({
  open,
  onOpenChange,
  newPost,
  onNewPostChange,
  onAddPost,
}: AddPostDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => onNewPostChange("title", e.target.value)}
          />
          <Textarea
            rows={10}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => onNewPostChange("body", e.target.value)}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => onNewPostChange("userId", Number(e.target.value))}
          />
          <Button onClick={onAddPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
