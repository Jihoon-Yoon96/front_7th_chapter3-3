import { useQuery } from "@tanstack/react-query"
import { fetchCommentsByPostId as apiFetchCommentsByPostId } from "../api"

export const useComments = (postId: number) => {
  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => apiFetchCommentsByPostId(postId),
    enabled: !!postId,
  })

  return {
    comments: comments?.comments ?? [],
    isLoading,
    isError,
  }
}
