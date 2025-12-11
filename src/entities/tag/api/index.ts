import { Tag } from "../model/types"
import { callAPI } from "../../../shared/lib/callAPI"

export const fetchTags = async (): Promise<Tag[]> => {
  const data = await callAPI<Tag[]>("/posts/tags")
  return data
}
