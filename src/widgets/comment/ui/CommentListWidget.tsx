import { Plus, Edit2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { highlightText } from "../../../shared/lib/highlight"
import { Comment } from "../../../entities/comment/model/types"
import { useComments } from "../../../entities/comment/model/useComment"
import { useState, useEffect } from "react"
import { AddCommentDialog } from "../../../features/comment/add/ui/AddCommentDialog"
import { EditCommentDialog } from "../../../features/comment/edit/ui/EditCommentDialog"
import { DeleteCommentButton } from "../../../features/comment/delete/ui/DeleteCommentButton"
import { LikeCommentButton } from "../../../features/comment/like/ui/LikeCommentButton"

interface CommentListProps {
  postId: number
  searchQuery: string
}

export const CommentListWidget = ({ postId, searchQuery }: CommentListProps) => {
  const { comments, fetchComments } = useComments()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  useEffect(() => {
    if (postId) {
      fetchComments(postId)
    }
  }, [postId, fetchComments])

  const handleOpenEditDialog = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditDialog(true)
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => setShowAddDialog(true)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LikeCommentButton commentId={comment.id} postId={postId} likes={comment.likes} />
              <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <DeleteCommentButton commentId={comment.id} postId={postId} />
            </div>
          </div>
        ))}
      </div>

      <AddCommentDialog open={showAddDialog} onOpenChange={setShowAddDialog} postId={postId} />
      <EditCommentDialog open={showEditDialog} onOpenChange={setShowEditDialog} selectedComment={selectedComment} />
    </div>
  )
}
