import { getPostContents } from "app/lib/posts"
import { Typography, Stack } from "@mui/material"
import md from "markdown-it"
import styles from "@/styles/_blog.module.scss"
import { PoppinsFont } from "@/styles/fonts/fonts"
import moment from "moment"
import PostTag from "@/components/PostTag/PostTag"
import { TagIconResolver } from "@/library/TagIconResolver"
import hljs from "highlight.js"
import "highlight.js/styles/github-dark.css"
import { IoIosPaper } from "react-icons/io"

const PostPage = async ({ params }: { params: { slug: string } }) => {
  const articleData = await getPostContents(params.slug)

  return (
    <div
      style={{
        marginInline: "auto",
        marginTop: 8,
      }}
      className={`${PoppinsFont.className} ${styles.blogWrapper}`}
    >
      <div
        style={{
          marginTop: 32,
          marginBottom: 64,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          color="#fff"
          sx={{
            lineHeight: 1.5,
            // https://css-tricks.com/how-to-create-neon-text-with-css/
            textShadow:
              "0 0 2px #fff, 0 0 10px #cf34eb, 0 0 102px #cf34eb, 0 0 151px #cf34eb;",
          }}
          mb={2}
        >
          {articleData.title}
        </Typography>

        {/* post date */}
        <Typography
          variant="body2"
          fontStyle="italic"
          ml={1}
        >
          {moment(articleData.date).format("MMMM Do, YYYY")}
        </Typography>

        {/* TODO: tags */}
        <Stack
          width="100%"
          direction="row"
          gap={2}
          mt={1}
          flexWrap="wrap"
        >
          {articleData.tags.map((tag, tagI) => (
            <PostTag
              tag={tag}
              key={tagI}
              Icon={TagIconResolver.getTagIcon(tag)}
              tagColor={TagIconResolver.getTagIconColor(tag)}
            />
          ))}
        </Stack>
      </div>

      {/* if draft show alert */}
      {articleData.draft && (
        <div
          style={{
            opacity: 0.2,
            marginInline: "auto",
            width: "max-content",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IoIosPaper
            size={100}
            style={{}}
          />
          <p>This is a draft post.</p>
        </div>
      )}

      {/* https://dev.to/ethand91/creating-a-markdown-blog-with-nextjs-1dci */}
      <div
        dangerouslySetInnerHTML={{
          __html: md({
            html: true,
            linkify: false,
            typographer: true,
            highlight: function (str, lang) {
              if (lang && hljs.getLanguage(lang)) {
                try {
                  const highlightedCode = hljs.highlight(str, {
                    language: lang,
                  }).value

                  return highlightedCode
                } catch (__) {}
              }

              return "" // use external default escaping
            },
          }).render(articleData.content),
        }}
      />
    </div>
  )
}

export default PostPage
