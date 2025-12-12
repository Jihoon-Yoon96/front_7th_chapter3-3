import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateComment as apiUpdateComment } from "../api"
import { Comment } from "../../../../entities/comment/model/types"

type EditCommentVariables = { id: number; body: string }

export const useEditComment = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation<Comment, Error, EditCommentVariables>({
    mutationFn: (variables) => apiUpdateComment(variables.id, variables.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
    onError: (error) => {
      console.error("댓글 업데이트 오류:", error)
    },
  })
}
