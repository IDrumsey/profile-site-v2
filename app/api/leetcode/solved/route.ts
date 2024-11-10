import { getEnv } from "@/library/utility/server"
import {
  SolvedProblemGeneratedMeta,
  solvedProblemMetas,
} from "app/data/leetcode/solved"
import { LeetCodeProblemSolution } from "app/types"
import axios from "axios"
import { NextResponse } from "next/server"

/**
 * Get all the problems I've solved on leetcode
 */
export async function GET(request: Request) {
  let leetcode_base_uri: string
  let leetcode_username: string

  try {
    leetcode_base_uri = getEnv("LEET_CODE_API_BASE_URI")
    leetcode_username = getEnv("LEET_CODE_USERNAME")
  } catch (e) {
    return NextResponse.json(
      {
        errors: [
          {
            message: "Unknown uri for the leetcode api",
          },
        ],
      },
      { status: 500 }
    )
  }

  // get the problem title, description, and difficulty level
  const latestSolutionsResponse = await axios.get<{
    count: number
    submission: Array<any>
  }>(`${leetcode_base_uri}/${leetcode_username}/acSubmission?limit=200`)

  if (latestSolutionsResponse.status !== 200) {
    return NextResponse.json(
      {
        errors: [
          {
            message: "Failed to get response from the leet code api.",
          },
        ],
      },
      { status: 500 }
    )
  }

  // map to custom type
  const latestSolutions: Array<LeetCodeProblemSolution> = []

  for (let i = 0; i < latestSolutionsResponse.data.submission.length; i++) {
    const solution = latestSolutionsResponse.data.submission[i]
    let staticData: SolvedProblemGeneratedMeta | undefined
    try {
      staticData = getSolutionStaticData(solution.titleSlug)
    } catch (e) {
      // quiet catch
    }

    const questionDetails = await getQuestionDetails(solution.titleSlug)

    latestSolutions.push({
      problem: {
        id: solution.titleSlug,
        title: solution.title,
        description: staticData?.shortFormDescription,
        lang: solution.lang,
        difficulty: questionDetails.difficulty,
        link: questionDetails.link,
      },
      codeSolution: staticData?.codeSolution,
      solutionAcceptedTimestamp: solution.timestamp * 1000,
    })
  }

  return NextResponse.json({
    solutions: latestSolutions,
  })
}

function getSolutionStaticData(slug: string): SolvedProblemGeneratedMeta {
  const foundMeta = solvedProblemMetas.find(
    (solution) => solution.problemSlug == slug
  )

  if (foundMeta == undefined)
    throw new Error(`Could not find static data for problem: ${slug}`)

  return foundMeta
}

type APIQuestionDetails = {
  link: string
  questionId: string
  difficulty: "Easy" | "Medium" | "Hard"
  topicTags: Array<{ name: string; slug: string }>
}

async function getQuestionDetails(slug: string): Promise<APIQuestionDetails> {
  const leetcode_base_uri = getEnv("LEET_CODE_API_BASE_URI")

  const response = await axios.get<APIQuestionDetails>(
    `${leetcode_base_uri}/select?titleSlug=${slug}`
  )

  if (response.status != 200)
    throw new Error(`Could not fetch the details of question: ${slug}`)

  return response.data
}
