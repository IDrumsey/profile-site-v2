import { getSortedArticles } from "@/library/posts"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const posts = await getSortedArticles()
  return NextResponse.json(posts)
}
