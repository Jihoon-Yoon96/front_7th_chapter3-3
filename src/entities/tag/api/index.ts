import { Tag } from "../model/types"

export const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch("/api/posts/tags")
  const data: Tag[] = await response.json()
  return data
}
