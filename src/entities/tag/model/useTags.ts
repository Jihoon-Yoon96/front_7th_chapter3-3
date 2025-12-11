import { atom, useAtom } from "jotai"
import { Tag } from "./types"
import { fetchTags as apiFetchTags } from "../api"

const tagsAtom = atom<Tag[]>([])

export const useTags = () => {
  const [tags, setTags] = useAtom(tagsAtom)

  const fetchTags = async () => {
    try {
      const data = await apiFetchTags()
      setTags(data)
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  return {
    tags,
    fetchTags,
  }
}
