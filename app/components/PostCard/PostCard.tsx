"use client"

import { Typography, Box, Stack } from "@mui/material"
import { PostItem } from "app/types"
import moment from "moment"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"
import { determinePostHighlightColor } from "@/library/utility/posts"
import { TagIconResolver } from "@/library/TagIconResolver"
import PostTag from "../PostTag/PostTag"

const DEFAULT_HIGHLIGHT_COLOR = "#cf34eb"

type Props = {
  post: PostItem
}

const BlogPostCard = ({ post }: Props) => {
  const router = useRouter()

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
          textShadow: `0 0 1px #fff`,
        }}
      >
        {post.title}
      </Typography>

      <Typography
        variant="caption"
        display="inline-block"
        mt={1}
      >
        {moment(post.date).format("MM-DD-YYYY")}
      </Typography>

      {/* post tags */}
      <Stack
        width="100%"
        direction="row"
        gap={2}
        mt={1}
        flexWrap="wrap"
      >
        {post.tags.map((tag, tagI) => {
          return (
            <PostTag
              tag={tag}
              key={tagI}
              Icon={TagIconResolver.getTagIcon(tag)}
              tagColor={TagIconResolver.getTagIconColor(tag)}
              size="small"
              showHalo={false}
            />
          )
        })}
      </Stack>
    </Box>
  )
}

export default BlogPostCard
