import BlogPostCard from "@/components/PostCard/PostCard"
import { Grid } from "@mui/material"
import { getSortedArticles } from "app/lib/posts"
import { useMemo } from "react"

const BlogHomePage = () => {
  const posts = useMemo(() => {
    return getSortedArticles()
  }, [])

  return (
    <Grid
      container
      spacing={3}
      sx={{
        width: "50%",
        marginInline: "auto",
        marginTop: 4,
      }}
    >
      {posts.map((post, postI) => (
        <Grid
          item
          xs={12}
        >
          <BlogPostCard post={post} />
        </Grid>
      ))}
    </Grid>
  )
}

export default BlogHomePage
