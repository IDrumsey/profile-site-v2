import { Post } from "contentlayer/generated"
import styles from "./blog-post-card.module.scss"
import Link from "next/link"
import { parseISO, format } from "date-fns"
import Image from "next/image"

type Props = {
  post: Post
  bgColor: string
}

const BlogPostCard = ({ post, bgColor }: Props) => {
  return (
    <>
      <Link
        href={post.url}
        // disable routing if draft - https://stackoverflow.com/a/73555793
        style={{
          pointerEvents: post.draft ? "none" : "auto",
        }}
      >
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
            <div className={styles["footer-section"]}>
              <p className={styles["date"]}>
                {format(parseISO(post.date), "LLLL d, yyyy")}
              </p>
              {post.draft && (
                <div className={styles["is-draft-indicator"]}>
                  <p>draft</p>
                </div>
              )}
            </div>
            <div
              className={`${styles["footer-section"]} ${styles["author-footer-section"]}`}
            >
              <p className={styles["author-name"]}>{post.author}</p>
              {post.authorPicURL && (
                <div className={styles["author-pic-wrapper"]}>
                  <Image
                    src={`/post-author-pics/${post.authorPicURL}`}
                    className={styles["author-pic"]}
                    width={500}
                    height={500}
                    alt={`${post.author} profile picture`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default BlogPostCard
