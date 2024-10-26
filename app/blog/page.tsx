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

  const tagsToShow: Array<string> = useMemo(() => {
    const tags: Array<string> = []

    // tags that are actually used on at least one post
    for (const post of posts) {
      // don't consider posts that are hidden or drafts
      if (post.draft || post.hide) continue

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

  /**
   * filter the posts down to just the ones to show
   */
  const postsToShow = useMemo<Array<PostItem>>(() => {
    let finalPostsList = posts
    // filter by the selected tag if one has been selected
    if (selectedTag) {
      finalPostsList = finalPostsList.filter((post) =>
        post.tags.includes(selectedTag)
      )
    }

    return finalPostsList
  }, [posts, selectedTag])

  return (
    <div style={{ marginBottom: 64 }}>
      <Stack
        direction="row"
        flexWrap="wrap"
        width="100%"
        gap={2}
        my={4}
      >
        {tagsToShow.map((tag, tagI) => {
          return (
            <PostTag
              tag={tag}
              key={tagI}
              Icon={TagIconResolver.getTagIcon(tag)}
              tagColor={TagIconResolver.getTagIconColor(tag)}
              onClick={() => {
                const thisTagIsAlreadySelected = selectedTag == tag

                if (thisTagIsAlreadySelected) {
                  selectedTagSetter(null)
                } else {
                  selectedTagSetter(tag)
                }
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
        {postsToShow.map((post, postI) =>
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
