import { useMutation, useQueryClient } from "@tanstack/react-query"
import { likeComment as apiLikeComment } from "../api"
import { Comment } from "../../../../entities/comment/model/types"

type LikeCommentVariables = { id: number; currentLikes: number }

interface CommentsQueryData {
  comments: Comment[]
}

export const useLikeComment = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation<Comment, Error, LikeCommentVariables>({
    mutationFn: (variables) => apiLikeComment(variables.id, variables.currentLikes),

    onMutate: async (likedComment) => {
      const queryKey = ["comments", postId]

      await queryClient.cancelQueries({ queryKey })

      const previousCommentsData = queryClient.getQueryData<CommentsQueryData>(queryKey)

      queryClient.setQueryData<CommentsQueryData>(queryKey, (oldData) => {
        if (!oldData) {
          return { comments: [] }
        }
        const updatedComments = oldData.comments.map((comment) =>
          comment.id === likedComment.id
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
        return { ...oldData, comments: updatedComments }
      })

      return { previousCommentsData }
    },

    onError: (err, likedComment, context) => {
      console.error("댓글 좋아요 오류:", err)
      if (context?.previousCommentsData) {
        queryClient.setQueryData(["comments", postId], context.previousCommentsData)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })
}
