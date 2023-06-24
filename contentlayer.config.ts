import { defineDocumentType, makeSource } from "contentlayer/source-files"
import rehypePrettyCode from "rehype-pretty-code"

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

export default makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
  mdx: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: true,
          onVisitLine(element: any) {
            // Prevent lines from collapsing in `display: grid` mode, and
            // allow empty lines to be copy/pasted
            if (element.children.length === 0) {
              element.children = [{ type: "text", value: " " }]
            }
          },
          onVisitHighlightedLine(element: any) {
            // Each line element by default has `class="line"`.
            element.properties.className?.push("highlighted")
          },
          onVisitHighlightedWord(element: any) {
            // Each word element has no className by default.
            element.properties.className = ["word"]
          },
        },
      ],
    ],
  },
})
