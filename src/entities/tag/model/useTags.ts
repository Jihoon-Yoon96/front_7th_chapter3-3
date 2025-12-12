import { atom, useAtom } from "jotai"
import { Tag } from "./types"
import { fetchTags as apiFetchTags } from "../api"
import { useCallback } from "react"

const tagsAtom = atom<Tag[]>([])

export const useTags = () => {
  const [tags, setTags] = useAtom(tagsAtom)

  const fetchTags = useCallback(async () => {
    try {
      const data = await apiFetchTags()
      setTags(data)
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }, [setTags])

  return {
    tags,
    fetchTags,
  }
}
