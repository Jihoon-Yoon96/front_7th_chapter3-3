import { useEffect, useState } from "react"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/ui"
import { highlightText } from "../../../shared/lib/highlight"
import { Post } from "../../../entities/post/model/types"
import { User } from "../../../entities/user/model/types"
import { PostSearch } from "../../../features/post/search/ui/PostSearch"
import { PostSort } from "../../../features/post/sort/ui/PostSort"
import { PostPagination } from "../../../features/post/pagination/ui/PostPagination"
import { AddPostDialog } from "../../../features/post/add/ui/AddPostDialog"
import { EditPostDialog } from "../../../features/post/edit/ui/EditPostDialog"
import { DeletePostButton } from "../../../features/post/delete/ui/DeletePostButton"
import { CommentListWidget } from "../../comment/ui/CommentListWidget"
import { TagFilter } from "../../../features/tag/filter/ui/TagFilter"
import { UserDetailModal } from "../../../features/user/detail/ui/UserDetailModal"
import { usePosts } from "../../../entities/post/model/usePost"

import { useUser } from "../../../entities/user/model/useUser"
import { addPost as apiAddPost } from "../../../features/post/add/api"
import { updatePost as apiUpdatePost } from "../../../features/post/edit/api"
import { deletePost as apiDeletePost } from "../../../features/post/delete/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const PostsManagerWidget = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const queryClient = useQueryClient()

  // 상태 관리
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState<Pick<Post, "title" | "body" | "userId">>({ title: "", body: "", userId: 1 })
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  const {
    posts,
    total,
    isLoading,
  } = usePosts({ limit, skip, sortBy, sortOrder, searchQuery, tag: selectedTag })
  const { fetchUserById } = useUser()

  const addPostMutation = useMutation({
    mutationFn: apiAddPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    },
    onError: (error) => {
      console.error("게시물 추가 오류:", error)
    },
  })

  const updatePostMutation = useMutation({
    mutationFn: apiUpdatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      setShowEditDialog(false)
    },
    onError: (error) => {
      console.error("게시물 업데이트 오류:", error)
    },
  })

  const deletePostMutation = useMutation({
    mutationFn: apiDeletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: (error) => {
      console.error("게시물 삭제 오류:", error)
    },
  })

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  // 게시물 추가 핸들러
  const handleAddPost = () => {
    addPostMutation.mutate(newPost)
  }

  // 게시물 업데이트 핸들러
  const handleUpdatePost = () => {
    if (!selectedPost) return
    updatePostMutation.mutate(selectedPost)
  }

  // 게시물 삭제 핸들러
  const handleDeletePost = (id: number) => {
    deletePostMutation.mutate(id)
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기 핸들러
  const handleOpenUserModal = async (user: Pick<User, "id" | "username" | "image">) => {
    try {
      await fetchUserById(user.id)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    const handleOpenDialog = () => setShowAddDialog(true)
    window.addEventListener("open-add-post-dialog", handleOpenDialog)
    return () => {
      window.removeEventListener("open-add-post-dialog", handleOpenDialog)
    }
  }, [])

  useEffect(() => {
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag, searchQuery])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  // 게시물 테이블 렌더링
  const renderPostTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setSelectedTag(tag)
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => post.author && handleOpenUserModal(post.author)}>
                <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post)
                    setShowEditDialog(true)
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <DeletePostButton onDelete={() => handleDeletePost(post.id)} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* 검색 및 필터 컨트롤 */}
        <div className="flex gap-4">
                    <PostSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={() => updateURL()} />
                    <TagFilter
                      selectedTag={selectedTag}
                      onSelectTag={(value) => {
                        setSelectedTag(value)
                      }}
                    />
          <PostSort
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        </div>

        {/* 게시물 테이블 */}
        {isLoading || addPostMutation.isPending || updatePostMutation.isPending || deletePostMutation.isPending ? (
          <div className="flex justify-center p-4">로딩 중...</div>
        ) : (
          renderPostTable()
        )}

        {/* 페이지네이션 */}
        <PostPagination limit={limit} onLimitChange={setLimit} skip={skip} onSkipChange={setSkip} total={total} />
      </div>

      <AddPostDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        newPost={newPost}
        onNewPostChange={(field, value) =>
          setNewPost((prev) => {
            let typedValue: string | number
            if (field === "userId") {
              typedValue = value as number
            } else {
              typedValue = value as string
            }

            return { ...prev, [field]: typedValue }
          })
        }
        onAddPost={handleAddPost}
      />

      <EditPostDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        selectedPost={selectedPost}
        onPostChange={(field, value) => setSelectedPost((prev) => (prev ? { ...prev, [field]: value } : null))}
        onUpdatePost={handleUpdatePost}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="">
            <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
            {selectedPost && <CommentListWidget postId={selectedPost.id} searchQuery={searchQuery} />}
          </div>
        </DialogContent>
      </Dialog>

      <UserDetailModal open={showUserModal} onOpenChange={setShowUserModal} />
    </>
  )
}
