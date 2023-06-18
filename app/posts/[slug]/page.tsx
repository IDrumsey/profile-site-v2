import { format, parseISO } from "date-fns"
import { allPosts } from "contentlayer/generated"
import styles from "@/styles/blog-post.module.scss"
import { useMDXComponent } from "next-contentlayer/hooks"
import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import Image, { ImageProps } from "next/image"

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }))

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)

  if (!post) throw new Error(`Post not found for slug: ${params.slug}`)

  return { title: post.title }
}

const mdxComponents: MDXComponents = {
  a: ({ href, children }) => <Link href={href as string}>{children}</Link>,
  CenteredImage: (props: ImageProps) => <Image {...props} />,
}

const PostLayout = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)

  if (!post) throw new Error(`Post not found for slug: ${params.slug}`)

  const MDXContent = useMDXComponent(post.body.code)

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

      <div className={styles["content"]}>
        <MDXContent components={mdxComponents} />
      </div>
    </div>
  )
}

export default PostLayout
