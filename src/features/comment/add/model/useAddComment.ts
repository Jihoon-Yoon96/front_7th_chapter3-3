import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment as apiAddComment } from "../api"
import { Comment } from "../../../../entities/comment/model/types"

type AddCommentVariables = { body: string; postId: number; userId: number }

export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation<Comment, Error, AddCommentVariables>({
    mutationFn: apiAddComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    },
  })
}
