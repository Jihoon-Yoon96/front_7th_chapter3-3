import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../shared/ui"
import { AddPostButton } from "../features/post/add/ui/AddPostButton"
import { PostsManagerWidget } from "../widgets/post/ui/PostsManagerWidget"

const PostsManagerPage = () => {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <AddPostButton onClick={() => {
            // This is a temporary solution until the add post logic is moved to the widget
            const event = new CustomEvent("open-add-post-dialog")
            window.dispatchEvent(event)
          }} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PostsManagerWidget />
      </CardContent>
    </Card>
  )
}

export default PostsManagerPage
