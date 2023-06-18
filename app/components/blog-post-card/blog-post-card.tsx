import { Post } from "contentlayer/generated"
import styles from "./blog-post-card.module.scss"
import Link from "next/link"
import { parseISO, format } from "date-fns"

type Props = {
  post: Post
  bgColor: string
}

const BlogPostCard = ({ post, bgColor }: Props) => {
  return (
    <>
      <Link href={post.url}>
        <div
          className={styles["blog-post-card"]}
          style={{
            backgroundColor: `${bgColor}33`,
            border: `2px solid ${bgColor}`,
          }}
        >
          <div className={styles["header"]}>
            <h2 className={styles["title"]}>{post.title}</h2>
          </div>
          <hr className={styles["header-break"]} />
          <p className={styles["description"]}>{post.description}</p>
          <hr className={styles["footer-break"]} />
          <div className={styles["footer"]}>
            <p className={styles["date"]}>
              {format(parseISO(post.date), "LLLL d, yyyy")}
            </p>
            {post.draft && (
              <div className={styles["is-draft-indicator"]}>
                <p>draft</p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </>
  )
}

export default BlogPostCard
