import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/ui"
import { useTags } from "../../../../entities/tag/model/useTags"
import { useEffect } from "react"

interface TagFilterProps {
  selectedTag: string
  onSelectTag: (tag: string) => void
}

export const TagFilter = ({ selectedTag, onSelectTag }: TagFilterProps) => {
  const { tags, fetchTags } = useTags()

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  return (
    <Select value={selectedTag} onValueChange={onSelectTag}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {tags.map((tag) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
