import BlogPostCard from "@/components/PostCard/PostCard"
import { getSortedArticles } from "app/lib/posts"
import { useMemo } from "react"
import Stack from "@mui/material/Stack"

const BlogHomePage = () => {
  const posts = useMemo(() => {
    return getSortedArticles()
  }, [])

  return (
    <Stack
      direction="column"
      spacing={3}
      sx={{
        marginInline: "auto",
        marginTop: 4,
      }}
    >
      {posts.map((post, postI) => (
        <BlogPostCard post={post} />
      ))}
    </Stack>
  )
}

export default BlogHomePage
