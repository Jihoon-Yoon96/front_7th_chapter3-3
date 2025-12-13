import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateComment as apiUpdateComment } from "../api"
import { Comment } from "../../../../entities/comment/model/types"

type EditCommentVariables = { id: number; body: string }

interface CommentsQueryData {
  comments: Comment[]
}

export const useEditComment = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation<Comment, Error, EditCommentVariables>({
    mutationFn: (variables) => apiUpdateComment(variables.id, variables.body),

    onMutate: async (updatedComment) => {
      const queryKey = ["comments", postId]

      await queryClient.cancelQueries({ queryKey })

      const previousCommentsData = queryClient.getQueryData<CommentsQueryData>(queryKey)

      queryClient.setQueryData<CommentsQueryData>(queryKey, (oldData) => {
        if (!oldData) {
          return { comments: [] }
        }
        const updatedComments = oldData.comments.map((comment) =>
          comment.id === updatedComment.id
            ? { ...comment, body: updatedComment.body }
            : comment
        )
        return { ...oldData, comments: updatedComments }
      })

      return { previousCommentsData }
    },

    onError: (err, updatedComment, context) => {
      console.error("댓글 업데이트 오류:", err)
      if (context?.previousCommentsData) {
        queryClient.setQueryData(["comments", postId], context.previousCommentsData)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })
}
