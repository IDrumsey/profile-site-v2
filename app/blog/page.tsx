"use client"

import BlogPostCard from "@/components/PostCard/PostCard"
import { useEffect, useMemo, useState } from "react"
import Stack from "@mui/material/Stack"
import { TagIconResolver } from "@/library/TagIconResolver"
import PostTag from "@/components/PostTag/PostTag"
import { getPosts } from "@/library/network/client-requests"
import { PostItem } from "app/types"

const BlogHomePage = () => {
  const [posts, setPosts] = useState<Array<PostItem>>([])

  useEffect(() => {
    const postsLoader = async () => {
      const networkResponse = await getPosts()
      setPosts(networkResponse.data as Array<PostItem>)
    }

    postsLoader()
  }, [])

  const uniqueTags: Array<string> = useMemo(() => {
    const tags: Array<string> = []
    for (const post of posts) {
      for (const tag of post.tags) {
        if (tags.includes(tag)) {
          continue
        } else {
          tags.push(tag)
        }
      }
    }

    return tags
  }, [posts])

  const [selectedTag, selectedTagSetter] = useState<string | null>(null)

  return (
    <div>
      <Stack
        direction="row"
        flexWrap="wrap"
        width="100%"
        gap={2}
        my={4}
      >
        {uniqueTags.map((tag, tagI) => {
          return (
            <PostTag
              tag={tag}
              key={tagI}
              Icon={TagIconResolver.getTagIcon(tag)}
              tagColor={TagIconResolver.getTagIconColor(tag)}
              onClick={() => {
                selectedTagSetter(tag)
              }}
              cursor="pointer"
              showHalo={selectedTag == tag}
            />
          )
        })}
      </Stack>
      <Stack
        direction="column"
        spacing={3}
        sx={{
          marginInline: "auto",
          marginTop: 4,
        }}
      >
        {posts.map((post, postI) =>
          post.hide == true || post.draft ? (
            <></>
          ) : (
            <BlogPostCard
              post={post}
              key={postI}
            />
          )
        )}
      </Stack>
    </div>
  )
}

export default BlogHomePage
