import styles from "@/styles/_blog.module.scss"
import Link from "next/link"
import { compareDesc, format, parseISO } from "date-fns"
import { allPosts, Post } from "contentlayer/generated"
import BlogPostCard from "@/components/blog-post-card/blog-post-card"

type Props = {}

const BlogPage = ({}: Props) => {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  )

  return (
    <>
      <div id={styles["blog-post-card-grid"]}>
        {posts.map((post, i) => {
          return (
            <>
              <BlogPostCard
                key={i}
                post={post}
                bgColor="#406E90"
              />
            </>
          )
        })}
      </div>
    </>
  )
}

export default BlogPage
