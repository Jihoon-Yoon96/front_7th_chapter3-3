import { useQuery } from "@tanstack/react-query"
import { fetchTags as apiFetchTags } from "../api"

export const useTags = () => {
  const { data: tags, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: apiFetchTags,
  })

  return {
    tags: tags ?? [],
    isLoading,
  }
}
