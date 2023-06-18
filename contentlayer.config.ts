import { defineDocumentType, makeSource } from "contentlayer/source-files"

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    description: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, required: false },
    draft: { type: "boolean", required: true },
    author: { type: "string", required: true },
    authorGithubProfileLink: { type: "string", required: false },
    authorPicURL: { type: "string", required: false },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({ contentDirPath: "posts", documentTypes: [Post] })
