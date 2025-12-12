import { Plus, Edit2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { highlightText } from "../../../shared/lib/highlight"
import { Comment } from "../../../entities/comment/model/types"
import { useComments } from "../../../entities/comment/model/useComment"
import { useState } from "react"
import { AddCommentDialog } from "../../../features/comment/add/ui/AddCommentDialog"
import { EditCommentDialog } from "../../../features/comment/edit/ui/EditCommentDialog"
import { DeleteCommentButton } from "../../../features/comment/delete/ui/DeleteCommentButton"
import { LikeCommentButton } from "../../../features/comment/like/ui/LikeCommentButton"
import { addComment as apiAddComment } from "../../../features/comment/add/api"
import { updateComment as apiUpdateComment } from "../../../features/comment/edit/api"
import { deleteComment as apiDeleteComment } from "../../../features/comment/delete/api"
import { likeComment as apiLikeComment } from "../../../features/comment/like/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface CommentListProps {
  postId: number
  searchQuery: string
}

export const CommentListWidget = ({ postId, searchQuery }: CommentListProps) => {
  const {
    comments,
    isLoading,
  } = useComments(postId)
  const queryClient = useQueryClient()

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  const addCommentMutation = useMutation({
    mutationFn: apiAddComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
      setShowAddDialog(false)
    },
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    },
  })

  const updateCommentMutation = useMutation({
    mutationFn: (variables: { id: number; body: string }) => apiUpdateComment(variables.id, variables.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
      setShowEditDialog(false)
    },
    onError: (error) => {
      console.error("댓글 업데이트 오류:", error)
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: apiDeleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
    },
  })

  const likeCommentMutation = useMutation({
    mutationFn: (variables: { id: number; currentLikes: number }) =>
      apiLikeComment(variables.id, variables.currentLikes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
    onError: (error) => {
      console.error("댓글 좋아요 오류:", error)
    },
  })

  const handleOpenEditDialog = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditDialog(true)
  }

  const handleAddComment = (newComment: { body: string; postId: number; userId: number }) => {
    addCommentMutation.mutate(newComment)
  }

  const handleUpdateComment = (id: number, body: string) => {
    updateCommentMutation.mutate({ id, body })
  }

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId)
  }

  const handleLikeComment = (commentId: number, currentLikes: number) => {
    likeCommentMutation.mutate({ id: commentId, currentLikes })
  }

  const isMutating = addCommentMutation.isPending || updateCommentMutation.isPending || deleteCommentMutation.isPending || likeCommentMutation.isPending

  if (isLoading || isMutating) {
    return <div className="flex justify-center p-4">댓글 로딩 중...</div>
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
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LikeCommentButton
                commentId={comment.id}
                postId={postId}
                likes={comment.likes}
                onLike={handleLikeComment}
              />
              <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <DeleteCommentButton commentId={comment.id} postId={postId} onDelete={handleDeleteComment} />
            </div>
          </div>
        ))}
      </div>

      <AddCommentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        postId={postId}
        onAddComment={handleAddComment}
      />
      <EditCommentDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        selectedComment={selectedComment}
        onUpdateComment={handleUpdateComment}
      />
    </div>
  )
}
