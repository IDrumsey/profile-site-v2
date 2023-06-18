import { format, parseISO } from "date-fns"
import { allPosts } from "contentlayer/generated"
import styles from "@/styles/blog-post.module.scss"

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }))

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)

  if (!post) throw new Error(`Post not found for slug: ${params.slug}`)

  return { title: post.title }
}

const PostLayout = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)

  if (!post) throw new Error(`Post not found for slug: ${params.slug}`)

  return (
    <div className={styles["blog-post"]}>
      <div className={styles["header"]}>
        <h1 className={styles["title"]}>{post.title}</h1>
        <h6 className={styles["description"]}>{post.description}</h6>
        <h6 className={styles["date"]}>
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </h6>
      </div>

      <hr className={styles["header-break"]} />

      <div
        dangerouslySetInnerHTML={{ __html: post.body.html }}
        className={styles["content"]}
      />
    </div>
  )
}

export default PostLayout
