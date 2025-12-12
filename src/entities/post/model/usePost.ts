import { useQuery } from "@tanstack/react-query"
import {
  fetchPosts as apiFetchPosts,
  fetchPostsByTag as apiFetchPostsByTag,
  searchPosts as apiSearchPosts,
} from "../api"

interface UsePostsParams {
  limit: number
  skip: number
  sortBy: string
  sortOrder: string
  searchQuery?: string
  tag?: string
}

export const usePosts = ({ limit, skip, sortBy, sortOrder, searchQuery, tag }: UsePostsParams) => {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", { limit, skip, sortBy, sortOrder, searchQuery, tag }],
    queryFn: () => {
      if (searchQuery) {
        return apiSearchPosts(searchQuery)
      }
      if (tag) {
        return apiFetchPostsByTag(tag)
      }
      return apiFetchPosts(limit, skip, sortBy, sortOrder)
    },
    enabled: !!searchQuery || !!tag || (limit > 0),
  })

  return {
    posts: data?.posts ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
  }
}
