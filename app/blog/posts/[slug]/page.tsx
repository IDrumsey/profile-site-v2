import { getPostContents } from "app/lib/posts"
import { Box, Typography } from "@mui/material"
import md from "markdown-it"
import styles from "@/styles/_blog.module.scss"
import { PoppinsFont } from "@/styles/fonts/fonts"
import moment from "moment"

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
      <Box
        mt={4}
        mb={8}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          color="#fff"
          sx={{
            lineHeight: 1.5,
            // https://css-tricks.com/how-to-create-neon-text-with-css/
            textShadow:
              "0 0 2px #fff, 0 0 10px #0fa, 0 0 10px #0fa, 0 0 10px #0fa, 0 0 102px #0fa, 0 0 151px #0fa;",
          }}
          mb={2}
        >
          {articleData.title}
        </Typography>

        {/* post date */}
        <Typography
          variant="body2"
          fontStyle="italic"
        >
          {moment(articleData.date).format("MMMM Do, YYYY")}
        </Typography>

        {/* TODO: tags */}
      </Box>

      {/* https://dev.to/ethand91/creating-a-markdown-blog-with-nextjs-1dci */}
      <div
        dangerouslySetInnerHTML={{
          __html: md({
            html: true,
            linkify: false,
            typographer: true,
          }).render(articleData.content),
        }}
      />
    </div>
  )
}

export default PostPage
