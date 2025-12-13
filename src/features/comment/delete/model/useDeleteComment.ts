import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteComment as apiDeleteComment } from "../api"
import { Comment } from "../../../../entities/comment/model/types"

interface CommentsQueryData {
  comments: Comment[]
}

export const useDeleteComment = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation<
    { success: boolean },
    Error,
    number,
    { previousCommentsData: CommentsQueryData | undefined }
  >({
    mutationFn: (commentId: number) => apiDeleteComment(commentId),

    onMutate: async (deletedCommentId) => {
      const queryKey = ["comments", postId]

      await queryClient.cancelQueries({ queryKey })

      const previousCommentsData =
        queryClient.getQueryData<CommentsQueryData>(queryKey)

      queryClient.setQueryData<CommentsQueryData>(queryKey, (oldData) => {
        if (!oldData) {
          return { comments: [] }
        }
        const updatedComments = oldData.comments.filter(
          (comment) => comment.id !== deletedCommentId,
        )
        return { ...oldData, comments: updatedComments }
      })

      return { previousCommentsData }
    },

    onError: (err, _deletedCommentId, context) => {
      console.error("댓글 삭제 오류:", err)
      if (context?.previousCommentsData) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previousCommentsData,
        )
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })
}
