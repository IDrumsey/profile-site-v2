"use client"

import { Typography, Box } from "@mui/material"
import { PostItem } from "app/types"
import moment from "moment"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

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
