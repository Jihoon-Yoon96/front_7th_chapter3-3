import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteComment as apiDeleteComment } from "../api"

export const useDeleteComment = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: number) => apiDeleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
    },
  })
}
