import { format, parseISO } from "date-fns"
import { allPosts } from "contentlayer/generated"

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
    <article>
      <h1>{post.title}</h1>
      <h6>{post.description}</h6>
      <h6>{format(parseISO(post.date), "LLLL d, yyyy")}</h6>
    </article>
  )
}

export default PostLayout
