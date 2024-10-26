/**
 * Used to fetch article data
 *
 * cite - https://www.youtube.com/watch?v=ahX4mVgM8AE
 */

import fs from "fs"
import matter from "gray-matter"
import path from "path"
import moment from "moment"

import type { PostItem } from "app/types"

const postsDir = path.join(process.cwd(), "posts")

export const getSortedArticles = (): Array<PostItem> => {
  const allPostFilenames = fs.readdirSync(postsDir)

  const allPostsData: Array<PostItem> = allPostFilenames.map((filename) => {
    const id = filename.replace(/\.mdx$/, "")

    const fullPath = path.join(postsDir, filename)
    const fileContents = fs.readFileSync(fullPath, "utf-8")

    const matterResult = matter(fileContents)

    return {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      content: matterResult.data.content,
      tags: matterResult.data.tags ?? [],
      hide: matterResult.data.hide ?? false,
      draft: matterResult.data.draft ?? false,
    }
  })

  return allPostsData.sort((a, b) => {
    const format = "DD-MM-YYYY"
    const postADate = moment(a.date, format)
    const postBDate = moment(b.date, format)

    if (postADate.isBefore(postBDate)) {
      return 1
    } else if (postBDate.isAfter(postADate)) {
      return -1
    } else return 0
  })
}

export const getPostContents = async (
  postId: string
): Promise<PostItem & { content: string }> => {
  const fullPath = path.join(postsDir, `${postId}.mdx`)

  const fileContents = fs.readFileSync(fullPath, "utf-8")

  const matterResult = matter(fileContents)

  return {
    id: postId,
    title: matterResult.data.title,
    date: matterResult.data.date,
    content: matterResult.content,
    tags: matterResult.data.tags ?? [],
    hide: matterResult.data.hide ?? false,
    draft: matterResult.data.draft ?? false,
  }
}
