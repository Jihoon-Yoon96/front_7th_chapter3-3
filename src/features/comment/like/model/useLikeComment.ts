import { useMutation, useQueryClient } from "@tanstack/react-query"
import { likeComment as apiLikeComment } from "../api"
import { Comment } from "../../../../entities/comment/model/types"

type LikeCommentVariables = { id: number; currentLikes: number }

export const useLikeComment = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation<Comment, Error, LikeCommentVariables>({
    mutationFn: (variables) => apiLikeComment(variables.id, variables.currentLikes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
    onError: (error) => {
      console.error("댓글 좋아요 오류:", error)
    },
  })
}
