export type PostItem = {
  id: string
  title: string
  date: string
  category?: string
  draft: boolean
  tags: Array<string>
  hide: boolean
}

export type LeetCodeProblem = {
  id: string
  title: string
  description?: string
  lang: string
  difficulty: "Easy" | "Medium" | "Hard"
  link: string
}

export type LeetCodeProblemSolution = {
  problem: LeetCodeProblem
  codeSolution?: string
  solutionAcceptedTimestamp: number
}

export type Loading<T> = T | "loading"

export type PhotoMeta = {
  url: string
  orientation: "landscape" | "portrait" | "unknown"
  height?: number
  width?: number
}
