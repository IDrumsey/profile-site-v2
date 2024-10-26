"use client"

import { Typography, Box } from "@mui/material"
import { PostItem } from "app/types"
import moment from "moment"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"
import { determinePostHighlightColor } from "@/library/utility/posts"

const DEFAULT_HIGHLIGHT_COLOR = "#cf34eb"

type Props = {
  post: PostItem
}

const BlogPostCard = ({ post }: Props) => {
  const router = useRouter()

  const getHighlightColor = useCallback((): string => {
    return determinePostHighlightColor(post, DEFAULT_HIGHLIGHT_COLOR)
  }, [post])

  const highlightColor = useMemo(() => {
    return getHighlightColor()
  }, [getHighlightColor])

  return (
    <Box
      component={motion.div}
      sx={{
        padding: 2,
        backgroundColor: "#222329",
        borderRadius: 1,
      }}
      whileHover={{
        scale: 1.02,
        cursor: "pointer",
        boxShadow: `0 0 10px ffffffee`,
      }}
      onClick={() => router.push(`/blog/posts/${post.id}`)}
    >
      <Typography
        variant="body1"
        fontWeight="bold"
        color="#c9eaff"
        sx={{
          // https://css-tricks.com/how-to-create-neon-text-with-css/
          textShadow: `0 0 1px #fff, 0 0 5px ${highlightColor}, 0 0 15px ${highlightColor}`,
        }}
      >
        {post.title}
      </Typography>

      <Typography variant="caption">
        {moment(post.date).format("MM-DD-YYYY")}
      </Typography>
    </Box>
  )
}

export default BlogPostCard
