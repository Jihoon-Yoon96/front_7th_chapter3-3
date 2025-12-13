import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment as apiAddComment } from "../api"
import { Comment } from "../../../../entities/comment/model/types"

// useComments 훅이 반환하는 데이터 구조에 맞춘 캐시 데이터 타입
interface CommentsQueryData {
  comments: Comment[]
}

export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiAddComment, // API 요청을 수행할 함수

    onMutate: async (newComment) => {
      const queryKey = ["comments", newComment.postId]

      // 진행중인 쿼리를 취소합니다.
      await queryClient.cancelQueries({ queryKey })

      // 롤백을 위한 이전 데이터 스냅샷을 저장합니다.
      const previousCommentsData = queryClient.getQueryData<CommentsQueryData>(queryKey)

      // 캐시를 낙관적으로 업데이트합니다.
      queryClient.setQueryData<CommentsQueryData>(queryKey, (oldData) => {
        // 새로 추가할 댓글의 임시 객체를 생성합니다.
        const newCommentOptimistic: Comment = {
          id: Date.now(), // 임시 ID
          postId: newComment.postId,
          body: newComment.body,
          likes: 0, // 기본값 설정
          user: { id: newComment.userId, username: "CurrentUser" }, // 임시 유저 정보
        }

        const comments = oldData?.comments ?? []
        return {
          ...oldData,
          comments: [...comments, newCommentOptimistic],
        }
      })

      // 롤백을 위해 이전 데이터를 컨텍스트로 반환합니다.
      return { previousCommentsData }
    },

    // 에러 발생 시 롤백합니다.
    onError: (err, newComment, context) => {
      console.error("댓글 추가 중 에러 발생:", err)
      if (context?.previousCommentsData) {
        queryClient.setQueryData(
          ["comments", newComment.postId],
          context.previousCommentsData
        )
      }
    },

    // 요청이 완료되면(성공/실패 무관) 서버 데이터와 동기화합니다.
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
  })
}