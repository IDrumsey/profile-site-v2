export type PostItem = {
  id: string
  title: string
  date: string
  category?: string
  draft: boolean
  tags: Array<string>
  hide: boolean
}
