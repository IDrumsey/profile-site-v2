import { Post } from "contentlayer/generated"
import styles from "./blog-post-card.module.scss"
import Link from "next/link"
import { parseISO, format } from "date-fns"

type Props = {
  post: Post
}

const BlogPostCard = ({ post }: Props) => {
  return (
    <>
      <Link href={post.url}>
        <div className={styles["blog-post-card"]}>
          <div className={styles["blog-post-card-header"]}>
            <h2 className={styles["blog-post-card-title"]}>{post.title}</h2>
          </div>
          <p>{post.description}</p>
          <div className={styles["blog-post-card-footer"]}>
            <p className={styles["blog-post-publish-date"]}>
              {format(parseISO(post.date), "LLLL d, yyyy")}
            </p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default BlogPostCard
