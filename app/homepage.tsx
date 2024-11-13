"use client"

import Head from "next/head"
import Link from "next/link"

import styles from "./styles/index.module.scss"

import { useInView, InView } from "react-intersection-observer"

import { useEffect, useRef, useState, useMemo } from "react"

import { motion } from "framer-motion"

import StackSection from "@/components/tech-stack/section/section"
import SectionItem from "@/components/tech-stack/section-item/section-item"
import ProjectCard from "@/components/project-card/project-card"

import Typed from "typed.js"

// a lot of the brand colors come from the official websites

import { AiFillLinkedin, AiOutlineDotNet } from "react-icons/ai"
import {
  FaGithubSquare,
  FaYoutubeSquare,
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaPython,
  FaPhp,
  FaAngular,
  FaLaravel,
  FaAws,
  FaLongArrowAltRight,
  FaArrowAltCircleRight,
} from "react-icons/fa"
import {
  SiBlender,
  SiCplusplus,
  SiDocker,
  SiFigma,
  SiGnubash,
  SiMicrosoftazure,
  SiPowershell,
  SiVisualstudio,
} from "react-icons/si"
import { SiJavascript } from "react-icons/si"
import { RiNextjsFill } from "react-icons/ri"
import { SiMicrosoftsqlserver } from "react-icons/si"
import { FaNpm } from "react-icons/fa"
import { VscVscode } from "react-icons/vsc"

import { Project } from "@/models/project"
import Image from "next/legacy/image"
import { Metadata } from "next"
import Navbar from "@/components/navbar/navbar"
import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { ProtestStrikeFont } from "./styles/fonts/fonts"
import Alert from "@/components/Alert/Alert"
import Color from "color"
import { useRouter } from "next/navigation"
import { LeetCodeProblemSolution, Loading } from "./types"
import axios from "axios"
import { Doughnut, Line } from "react-chartjs-2"
import {
  ArcElement,
  Chart,
  Legend,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js"
import { format, startOfWeek } from "date-fns"
import { CiBookmarkCheck } from "react-icons/ci"
import { FiExternalLink } from "react-icons/fi"

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const LEETCODE_EASY_COLOR = new Color("#46D19A")
const LEETCODE_MEDIUM_COLOR = new Color("#D1C346")
const LEETCODE_HARD_COLOR = new Color("#D14685")

export const metadata: Metadata = {
  title: "IDrumsey",
  description: "Profile website for IDrumsey",
}

export default function HomePage() {
  // https://youtu.be/r1auJEf9ISo
  // https://github.com/thebuilder/react-intersection-observer
  const {
    ref: descRef,
    inView: descInView,
    entry: descEntry,
  } = useInView({
    // https://youtu.be/T8EYosX4NOo
    rootMargin: "0px 0px -20% 0px",
    triggerOnce: true,
    delay: 1000,
  })

  const [canRunSocialLinksAnimation, canRunSocialLinksAnimationSetter] =
    useState(false)

  useEffect(() => {
    // https://stackoverflow.com/a/60432519/17712310
    const timer = setTimeout(() => {
      canRunSocialLinksAnimationSetter(true)
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const socialQuickLinks: {
    logoIcon: any
    logoColor: string
    url?: string
  }[] = [
    {
      logoIcon: AiFillLinkedin,
      logoColor: "#0a66c2",
      url: "https://www.linkedin.com/in/clay-casper/",
    },

    {
      logoIcon: FaGithubSquare,
      logoColor: "#A1A1A1",
      url: "https://github.com/IDrumsey",
    },

    {
      logoIcon: FaYoutubeSquare,
      logoColor: "#981C42",
      url: "https://www.youtube.com/channel/UC9uVJXXGUJB_OP7hN959qbQ",
    },
  ]

  const socialQuickLinkAnimationDelay = 400

  const {
    ref: mostUsedSectionTitleRef,
    inView: mostUsedSectionTitleInView,
    entry: mostUsedSectionTitleEntry,
  } = useInView({
    threshold: 1,
    rootMargin: "0px 100% 0% 100%",
    triggerOnce: true,
  })

  const technologies: {
    title: string
    items: {
      name: string
      logoIcon?: any
      logoColor?: string
      bottomBreak?: boolean
    }[]
  }[] = [
    {
      title: "Most Used",
      items: [
        {
          name: "HTML",
          logoIcon: FaHtml5,
          logoColor: "#D67228",
        },

        {
          name: "CSS",
          logoIcon: FaCss3Alt,
          logoColor: "#1989C1",
        },
        {
          name: "Javascript",
          logoIcon: SiJavascript,
          logoColor: "yellow",
          bottomBreak: true,
        },
        {
          name: "React",
          logoIcon: FaReact,
          logoColor: "#61dafb",
        },
        {
          name: "Next.js",
          logoIcon: RiNextjsFill,
          logoColor: "#c7c7c7",
          bottomBreak: true,
        },

        {
          name: "SQL Server",
          logoIcon: SiMicrosoftsqlserver,
          logoColor: "#d24458",
        },

        {
          name: "NodeJS",
          logoIcon: FaNodeJs,
          logoColor: "#689f63",
        },

        {
          name: "Python",
          logoIcon: FaPython,
          logoColor: "#356f9f",
          bottomBreak: true,
        },

        {
          name: "Docker",
          logoIcon: SiDocker,
          logoColor: "#1c60e6",
        },

        {
          name: "Azure",
          logoIcon: SiMicrosoftazure,
          logoColor: "#31b1e5",
        },

        {
          name: "Git",
          logoIcon: FaGitAlt,
          logoColor: "#f54d27",
        },

        {
          name: "npm",
          logoIcon: FaNpm,
          logoColor: "#c53635",
        },
        {
          name: "Blender",
          logoIcon: SiBlender,
          logoColor: "#e56b00",
        },

        {
          name: "VSCode",
          logoIcon: VscVscode,
          logoColor: "#2aaaf2",
        },

        {
          name: "Figma",
          logoIcon: SiFigma,
          logoColor: "#ea4c1d",
        },
      ],
    },

    {
      title: "Used",
      items: [
        {
          name: "PHP",
          logoIcon: FaPhp,
          logoColor: "#6448c2",
        },

        {
          name: "Angular",
          logoIcon: FaAngular,
          logoColor: "#c3002f",
        },

        {
          name: "C++",
          logoIcon: SiCplusplus,
          logoColor: "#00427e",
        },

        {
          name: "C#",
          logoIcon: AiOutlineDotNet,
          logoColor: "#72489f",
        },

        {
          name: "Laravel",
          logoIcon: FaLaravel,
          logoColor: "#ff2d20",
          bottomBreak: true,
        },

        {
          name: "AWS",
          logoIcon: FaAws,
          logoColor: "#ff9c08",
          bottomBreak: true,
        },

        {
          name: "Bash",
          logoIcon: SiGnubash,
          logoColor: "#35cb52",
        },

        {
          name: "PowerShell",
          logoIcon: SiPowershell,
          logoColor: "#2d4260",
        },

        {
          name: "Visual Studio",
          logoIcon: SiVisualstudio,
          logoColor: "#7f47b7",
        },
      ],
    },
  ]

  const techStackAnimationDelay = 50

  const featuredProjects: Project[] = useMemo(() => {
    return [
      {
        title: "Profile Site",
        description: "Pretty self explanatory.",
        repoLink: "https://github.com/IDrumsey/profile-site-v2",
        hosted: true,
        liveLink: "https://profile-site-v2.vercel.app/",
      },
      {
        title: "Loan Foresights",
        description: "Figure out a good time for you to get a loan.",
        repoLink: "https://github.com/IDrumsey/Loan-Foresight",
        hosted: true,
        liveLink: "https://idrumsey.github.io/Loan-Foresight/",
      },
      {
        title: "Report Potholes",
        description: "Centralized solution for reporting potholes.",
        repoLink: "https://github.com/IDrumsey/report-potholes-web-client",
        hosted: true,
        liveLink: "https://report-potholes.vercel.app/",
      },
      {
        title: "hinzmanenterprises.com",
        description: "A website built for a plumbing business.",
        liveLink: "https://www.hinzmanenterprises.com",
      },
      {
        title: "Tab URL Collector",
        description: "Copy the URLs of all Chrome tabs currently open.",
        repoLink: "https://github.com/IDrumsey/tab-url-collector",
        hosted: false,
        videoLink: "https://www.youtube.com/shorts/5OkmzUasmNY",
      },
      {
        title: "RoadtripsIO",
        description:
          "Crowd sourced roadtrips. Create and share roadtrips and go on your next adventure.",
        videoLink: "https://youtu.be/_t-zrlVHXXE",
        repoLink: "https://github.com/IDrumsey/RoadTripsIO",
      },
      {
        title: "Poll App",
        description:
          "Simple app to create and share polls and have people vote on them.",
        repoLink: "https://github.com/IDrumsey/PollApp",
      },
      {
        title: "Shelf Stock",
        description:
          "Web app to help stores to keep track of where products are and help customers locate those products.",
        videoLink: "https://youtu.be/lhLO08vDvIo",
        repoLink: "https://github.com/IDrumsey/Shelf-Stock",
      },
    ]
  }, [])

  const [featuredProjectWrappers, featuredProjectWrappersSetters] = useState<
    {
      project: Project
      align: boolean
    }[]
  >([])

  useEffect(() => {
    featuredProjectWrappersSetters(
      featuredProjects.map((featuredProject, i) => {
        return {
          project: featuredProject,
          align: i % 2 == 0,
        }
      })
    )
  }, [featuredProjects])

  const projectCardSectionDisplayDelay = 500
  const projectCardDisplayStaggerDelay = 400

  const [projectCardSectionDelayFlag, projectCardSectionDelayFlagSetter] =
    useState(false)

  useEffect(() => {
    // https://stackoverflow.com/a/60432519/17712310
    const timer = setTimeout(() => {
      projectCardSectionDelayFlagSetter(true)
    }, projectCardSectionDisplayDelay)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  // https://bobbyhadz.com/blog/javascript-create-array-n-elements-same-value
  const [projectCardDelayFlags, projectCardDelayFlagsSetter] = useState(
    Array(featuredProjects.length).fill(false)
  )

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    featuredProjects.forEach((project, i) => {
      // https://stackoverflow.com/a/60432519/17712310
      const timer = setTimeout(() => {
        // https://dev.to/shareef/how-to-work-with-arrays-in-reactjs-usestate-4cmi
        // https://stackoverflow.com/questions/65719838/react-usestate-setstate-in-useeffect-not-updating-array#:~:text=1-,You%20should%20use,-setChat(chat%20%3D%3E%20%5B...chat
        projectCardDelayFlagsSetter((prevFlags) =>
          prevFlags.map((projectFlag, j) => {
            if (i == j) {
              return true
            } else return projectFlag
          })
        )
      }, projectCardSectionDisplayDelay + (i + 1) * projectCardDisplayStaggerDelay)

      timers.push(timer)
    })

    return () => {
      timers.forEach((timer) => {
        clearTimeout(timer)
      })
    }
  }, [featuredProjects])

  const introTextRef = useRef(null)

  useEffect(() => {
    const typed = new Typed(introTextRef.current, {
      strings: ["Hi, I&apos;m Clay, a full-stack software engineer"],
      typeSpeed: 20,
    })

    return () => {
      typed.destroy()
    }
  }, [])

  const router = useRouter()

  // leet code stuff

  const [leetCodeSolutions, setLeetCodeSolutions] = useState<
    Array<LeetCodeProblemSolution> | "loading"
  >("loading")

  // load the leet code solutions
  useEffect(() => {
    const loader = async () => {
      const response = await axios.get<{
        solutions: Array<LeetCodeProblemSolution>
      }>("/api/leetcode/solved")

      if (response.status != 200) {
        return
      }

      setLeetCodeSolutions(response.data.solutions)
    }

    loader()
  }, [])

  return (
    <>
      <main id={styles["main-wrapper"]}>
        <div id={styles["section-1-wrapper"]}>
          {/* entity character fix suggested by next build */}
          <span
            id={styles["about-me-short-desc"]}
            className={`${
              descInView ? styles["desc-in-view"] : styles["desc-out-view"]
            }`}
          >
            <span ref={introTextRef}></span>
          </span>

          <div
            id={styles["social-quick-links"]}
            ref={descRef}
          >
            {socialQuickLinks.map((socialQuickLink, i) => (
              // https://stackoverflow.com/a/68714239/17712310
              <InView
                key={i}
                rootMargin="0px 100% -20% 100%"
                triggerOnce
              >
                {({ ref, inView }) => (
                  // https://react-icons.github.io/react-icons
                  <div
                    ref={ref}
                    className={`${styles["social-quick-link"]} ${
                      inView && canRunSocialLinksAnimation
                        ? styles["social-quick-link-in-view"]
                        : styles["social-quick-link-out-view"]
                    }`}
                    style={{
                      animationDelay: `${i * socialQuickLinkAnimationDelay}ms`,
                    }}
                  >
                    {/* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#security_and_privacy */}
                    <a
                      href={socialQuickLink.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <socialQuickLink.logoIcon
                        className={`${styles["social-quick-link-icon"]}`}
                        color={socialQuickLink.logoColor}
                      />
                    </a>
                  </div>
                )}
              </InView>
            ))}
          </div>
        </div>

        <div id={`${styles["section-2"]}`}>
          <div id={`${styles["tech-stack"]}`}>
            {
              // https://reactjs.org/docs/lists-and-keys.html
              technologies.map((technologySection, sectionI) => {
                return (
                  // https://github.com/thebuilder/react-intersection-observer#:~:text=To%20use%20the-,%3CInView%3E%20component,-%2C%20you%20pass%20it
                  // https://sentry.io/answers/unique-key-prop/#:~:text=Keys%20do%20not%20have%20to%20be%20unique%20globally.%20They%20just%20need%20to%20be%20unique%20across%20sibling%20elements.
                  <InView
                    key={sectionI}
                    threshold={1}
                    rootMargin="0px 100% 0% 100%"
                    triggerOnce
                  >
                    {({ ref, inView }) => (
                      <StackSection
                        title={technologySection.title}
                        ref={ref}
                        titleClassNames={[
                          styles["tech-stack-section-title"],
                          inView
                            ? styles["tech-stack-section-title-in-view"]
                            : styles["tech-stack-section-title-out-view"],
                        ]}
                      >
                        {technologySection.items.map((item, itemI) => {
                          return (
                            <InView
                              key={itemI}
                              threshold={1}
                              rootMargin="0px 100% 0% 100%"
                              triggerOnce
                            >
                              {({ ref, inView }) => (
                                <SectionItem
                                  LogoIcon={item.logoIcon}
                                  logoColor={item.logoColor}
                                  name={item.name}
                                  ref={ref}
                                  wrapperClassNames={[
                                    styles["tech-stack-item"],
                                    inView
                                      ? styles["tech-stack-item-in-view"]
                                      : styles["tech-stack-item-out-view"],
                                  ]}
                                  wrapperStyles={{
                                    marginBottom: item.bottomBreak
                                      ? 20
                                      : undefined,
                                  }}
                                  animationDelay={
                                    techStackAnimationDelay *
                                    (itemI + 1) *
                                    (sectionI + 1)
                                  }
                                />
                              )}
                            </InView>
                          )
                        })}
                      </StackSection>
                    )}
                  </InView>
                )
              })
            }
          </div>

          <div id={`${styles["featured-projects"]}`}>
            <Typography
              variant="h4"
              component={motion.h4}
              className={ProtestStrikeFont.className}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              Projects
            </Typography>
            {featuredProjectWrappers.map(
              (projectWrapper, i) =>
                projectWrapper && (
                  <InView
                    key={i}
                    threshold={0.5}
                    rootMargin="0px 100% 0% 100%"
                    triggerOnce
                  >
                    {({ ref, inView }) => (
                      <div
                        className={`${styles["featured-project-wrapper"]}`}
                        style={{
                          // https://stackoverflow.com/a/30587944/17712310
                          margin:
                            inView &&
                            projectCardSectionDelayFlag &&
                            projectCardDelayFlags[i]
                              ? `0 ${projectWrapper.align ? "auto" : 0} 0 ${
                                  !projectWrapper.align ? "auto" : 0
                                }`
                              : `0 ${!projectWrapper.align ? "auto" : 0} 0 ${
                                  projectWrapper.align ? "auto" : 0
                                }`,
                        }}
                      >
                        <ProjectCard
                          ref={ref}
                          project={projectWrapper.project}
                          wrapperClassNames={[
                            `${styles["project-card"]}`,
                            `${
                              inView &&
                              projectCardSectionDelayFlag &&
                              projectCardDelayFlags[i]
                                ? styles["project-in-view"]
                                : styles["project-out-view"]
                            }`,
                          ]}
                        />
                      </div>
                    )}
                  </InView>
                )
            )}
          </div>
        </div>

        <div
          style={{
            height: 2,
            width: "100%",
            marginTop: 64,
            marginBottom: 32,
            backgroundColor: "#393939",
          }}
        ></div>

        <Typography
          variant="h4"
          component={motion.h4}
          className={ProtestStrikeFont.className}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          sx={{ marginBottom: 4, textAlign: isMobile ? "center" : "auto" }}
        >
          Other work
        </Typography>

        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
          >
            <Box
              sx={{ backgroundColor: "#171717" }}
              padding={4}
              borderRadius={1}
            >
              <Typography
                variant="h6"
                sx={{ textAlign: isMobile ? "center" : "auto" }}
              >
                Business cards for Hinzman Enterprises
              </Typography>
              <hr />
              <Box sx={{ paddingY: 2 }}>
                <Image
                  src="/business-card-showcase1.png"
                  width={1148}
                  height={886}
                />
              </Box>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  color: new Color("#fff").darken(0.4).toString(),
                }}
              >
                Designing in Figma is great. Plus it&apos;s free! I designed
                these business cards for Hinzman Enterprises with what I believe
                to be two powerful features. 1) A colorful depictive picture of
                a plumber so that the client can easily find the card using the
                color and know what they&apos;re looking at by seeing a plumber.
                2) Using a QR code with utm Google Analytics tracking so we can
                see how well the card does.
              </Typography>
            </Box>
          </Grid>

          {/* blossom hill cleveland givecamp 2023 */}
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
          >
            <Box
              sx={{ backgroundColor: "#171717" }}
              padding={4}
              borderRadius={1}
            >
              <Typography
                variant="h6"
                sx={{ textAlign: isMobile ? "center" : "auto" }}
              >
                Cleveland GiveCamp 2023 Blossom Hill website upgrades
              </Typography>
              <hr />
              <Box
                sx={{ paddingY: 2, marginInline: "auto", width: "max-content" }}
              >
                <Image
                  src="/cleveland_givecamp_logo.jpg"
                  width={180}
                  height={180}
                  style={{ borderRadius: 5 }}
                />
              </Box>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  color: new Color("#fff").darken(0.4).toString(),
                }}
              >
                Working with a team of volunteers, I helped work through some
                website updates for the Blossom Hill website.
              </Typography>
            </Box>
          </Grid>

          {/* new linkedin banner design */}
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
          >
            <Box
              sx={{ backgroundColor: "#171717" }}
              padding={4}
              borderRadius={1}
            >
              <Typography
                variant="h6"
                sx={{ textAlign: isMobile ? "center" : "auto" }}
              >
                New LinkedIn Banner Design
              </Typography>
              <hr />
              <Box sx={{ paddingY: 2 }}>
                <Image
                  src="/new-linkedin-banner.jfif"
                  width={1400}
                  height={350}
                />
              </Box>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  color: new Color("#fff").darken(0.4).toString(),
                }}
              >
                After talking with David Roberts, he pointed out some issues
                with my LinkedIn profile, so I took it upon myself to more
                efficiently use the real estate offered by the LinkedIn profile
                banner with this new design that effectively communicates my
                brand and my tech stack.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <div
          style={{
            height: 2,
            width: "100%",
            marginTop: 64,
            marginBottom: 32,
            backgroundColor: "#393939",
          }}
        ></div>

        {/* leet code section */}
        <LeetCodeSection leetCodeSolutions={leetCodeSolutions} />

        <Alert
          bgColor={new Color("#4287f5")}
          onClick={() => router.push("/cool/algorithms/dijkstras3d")}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: isMobile ? "100%" : "max-content",
              maxWidth: "100%",
              marginInline: "auto",
            }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              lineHeight={2}
            >
              Check out this cool 3d interactive Dijkstras algorithm
            </Typography>
            {isMobile ? (
              <FaArrowAltCircleRight
                size={30}
                style={{ marginLeft: 36 }}
              />
            ) : (
              <FaLongArrowAltRight
                style={{ paddingLeft: 8 }}
                size={30}
              />
            )}
          </Box>
        </Alert>
      </main>
    </>
  )
}

const getRandomBool = () => {
  // https://stackoverflow.com/a/36756480/17712310
  return Math.random() < 0.5
}

type LeetCodeSectionProps = {
  leetCodeSolutions: Array<LeetCodeProblemSolution> | "loading"
}

const LeetCodeSection = (props: LeetCodeSectionProps) => {
  // figure out how many per difficulty level have been solved
  const numPerDifficulty = useMemo<{
    easy: Loading<number>
    medium: Loading<number>
    hard: Loading<number>
  }>(() => {
    if (props.leetCodeSolutions == "loading") {
      return {
        easy: "loading",
        medium: "loading",
        hard: "loading",
      }
    }

    return {
      easy: props.leetCodeSolutions.filter(
        (solution) => solution.problem.difficulty == "Easy"
      ).length,
      medium: props.leetCodeSolutions.filter(
        (solution) => solution.problem.difficulty == "Medium"
      ).length,
      hard: props.leetCodeSolutions.filter(
        (solution) => solution.problem.difficulty == "Hard"
      ).length,
    }
  }, [props.leetCodeSolutions])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box>
      <Typography
        variant="h4"
        component={motion.h4}
        className={ProtestStrikeFont.className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        sx={{ marginBottom: 4, textAlign: isMobile ? "center" : "auto" }}
      >
        Leet Code
      </Typography>

      <Stack
        direction={isMobile ? "column" : "row"}
        sx={{ width: "100%" }}
      >
        <Stack
          direction="column"
          sx={{ flexShrink: 0 }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              marginBottom: 6,
              marginInline: isMobile ? "auto" : undefined,
            }}
          >
            <DifficultyLvlIndicator
              color={LEETCODE_EASY_COLOR}
              title="Easy"
            />
            <DifficultyLvlIndicator
              color={LEETCODE_MEDIUM_COLOR}
              title="Medium"
            />
            <DifficultyLvlIndicator
              color={LEETCODE_HARD_COLOR}
              title="Hard"
            />
          </Stack>
          <SmoothDonutChart
            numEasy={numPerDifficulty.easy}
            numMedium={numPerDifficulty.medium}
            numHard={numPerDifficulty.hard}
          />
        </Stack>

        <Box
          sx={{
            flex: 1,
            marginY: isMobile ? 6 : 0,
            justifySelf: "flex-end",
          }}
        >
          {props.leetCodeSolutions !== "loading" && (
            <LeetCodeTotalSolutionsLineGraph
              solutions={props.leetCodeSolutions}
            />
          )}
        </Box>
      </Stack>

      {/* cards */}
      <Stack
        direction="column"
        spacing={4}
        sx={{ marginTop: 8 }}
      >
        {props.leetCodeSolutions == "loading" ? (
          <></>
        ) : (
          props.leetCodeSolutions.map((solution, i) => (
            <LeetCodeSolutionCard
              solution={solution}
              key={i}
            />
          ))
        )}
      </Stack>
    </Box>
  )
}

type SmoothDonutChartProps = {
  numEasy: Loading<number>
  numMedium: Loading<number>
  numHard: Loading<number>
}

const SmoothDonutChart = (props: SmoothDonutChartProps) => {
  const { numEasy, numMedium, numHard } = props

  // Check if any of the values are null (loading state)
  const isLoading =
    numEasy === "loading" || numMedium === "loading" || numHard === "loading"

  // Calculate total only if all values are loaded
  const total = isLoading ? 0 : numEasy + numMedium + numHard

  const data = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        data: isLoading ? [0, 0, 0] : [numEasy, numMedium, numHard],
        backgroundColor: [
          LEETCODE_EASY_COLOR.alpha(0.5).toString(),
          LEETCODE_MEDIUM_COLOR.alpha(0.5).toString(),
          LEETCODE_HARD_COLOR.alpha(0.5).toString(),
        ],
        borderColor: [
          LEETCODE_EASY_COLOR.toString(),
          LEETCODE_MEDIUM_COLOR.toString(),
          LEETCODE_HARD_COLOR.toString(),
        ],
        cutout: "90%", // Makes it a donut
        spacing: 16,
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: !isLoading, // Disable tooltip if loading
      },
      legend: {
        display: false,
      },
    },
  }

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <div
      style={{
        position: "relative",
        width: 150,
        height: 150,
        marginInline: isMobile ? "auto" : undefined,
      }}
    >
      <Doughnut
        data={data}
        options={options}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {!isLoading && (
          <>
            <div>Total {total}</div>
          </>
        )}
      </div>
    </div>
  )
}

type DifficultyLvlIndicatorProps = {
  color: Color
  title: string
}

const DifficultyLvlIndicator = (props: DifficultyLvlIndicatorProps) => {
  return (
    <Stack
      direction="row"
      spacing={2}
    >
      <Box
        sx={{
          border: `2px solid ${props.color.toString()}`,
          width: "16px",
          height: "16px",
          borderRadius: "100%",
          backgroundColor: props.color.alpha(0.2).toString(),
        }}
      ></Box>
      <Typography variant="body2">{props.title}</Typography>
    </Stack>
  )
}

type LeetCodeSolutionCardProps = {
  solution: LeetCodeProblemSolution
}

const CHECKMARK_COLOR = new Color("#B0B0B0")

const LeetCodeSolutionCard = (props: LeetCodeSolutionCardProps) => {
  function getSubmittedDateAsStr(): string {
    return format(
      new Date(props.solution.solutionAcceptedTimestamp),
      "MMMM dd, yyyy 'at' h:mma"
    )
  }

  const theme = useTheme()

  const [isHovering, isHoveringSetter] = useState<boolean>(false)

  return (
    <Box
      component={motion.div}
      paddingY={2}
      paddingX={4}
      sx={{ backgroundColor: new Color("#282828").toString(), borderRadius: 1 }}
      whileHover={{
        scale: 1.01,
        cursor: "pointer",
      }}
      onMouseEnter={() => isHoveringSetter(true)}
      onMouseLeave={() => isHoveringSetter(false)}
      onClick={() => {
        window.open(
          props.solution.problem.link,
          "_blank",
          "noopener,noreferrer"
        )
      }}
    >
      <Stack direction="row">
        <Box>
          <Typography
            variant="h6"
            marginBottom={1}
          >
            {props.solution.problem.title}
          </Typography>
          <Typography
            sx={{
              color: new Color("#71FF71").toString(),
              fontSize: theme.typography.caption.fontSize,
            }}
          >
            Submitted on {getSubmittedDateAsStr()}
          </Typography>
        </Box>

        {!isHovering ? (
          <CiBookmarkCheck
            size={30}
            color={CHECKMARK_COLOR.toString()}
            style={{
              alignSelf: "center",
              marginLeft: "auto",
            }}
          />
        ) : (
          <FiExternalLink
            size={30}
            color={CHECKMARK_COLOR.toString()}
            style={{
              alignSelf: "center",
              marginLeft: "auto",
            }}
          />
        )}
      </Stack>
    </Box>
  )
}

type LeetCodeTotalSolutionsLineGraphProps = {
  solutions: Array<LeetCodeProblemSolution>
}

const LEETCODE_TOTALS_GRAPH_COLOR = new Color("#8403fc")

const LeetCodeTotalSolutionsLineGraph = ({
  solutions,
}: LeetCodeTotalSolutionsLineGraphProps) => {
  const [chartData, setChartData] = useState<any>()

  useEffect(() => {
    // Sort solutions by the accepted timestamp
    const sortedSolutions = [...solutions].sort(
      (a, b) => a.solutionAcceptedTimestamp - b.solutionAcceptedTimestamp
    )

    // Aggregate solutions by week
    const weeklyTotals: Record<string, number> = {}
    sortedSolutions.forEach((sol) => {
      const weekStart = format(
        startOfWeek(new Date(sol.solutionAcceptedTimestamp)),
        "MMMM dd, yyyy"
      )
      weeklyTotals[weekStart] = (weeklyTotals[weekStart] || 0) + 1 // Increment count for the week
    })

    // Prepare data for the chart
    let cumulativeTotal = 0
    const labels: string[] = []
    const dataPoints: number[] = []

    Object.keys(weeklyTotals)
      .sort()
      .forEach((week) => {
        cumulativeTotal += weeklyTotals[week]
        labels.push(week)
        dataPoints.push(cumulativeTotal)
      })

    // Set up chart data
    setChartData({
      labels,
      datasets: [
        {
          label: "Total Solutions Over Time (Weekly)",
          data: dataPoints,
          borderColor: LEETCODE_TOTALS_GRAPH_COLOR.alpha(0.3).toString(), // Bright purple for the line
          pointBackgroundColor:
            LEETCODE_TOTALS_GRAPH_COLOR.alpha(0.3).toString(), // Bright purple for the points
          pointBorderColor: LEETCODE_TOTALS_GRAPH_COLOR.toString(), // Border color of the points
          pointBorderWidth: 2,
          fill: true,
          tension: 0.1, // Optional: Makes the line a bit smoother
        },
      ],
    })
  }, [solutions])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  if (!chartData) {
    return <p>Loading...</p>
  }

  return (
    <Line
      data={chartData}
      options={{
        scales: {
          x: {
            title: {
              display: true,
              text: !isMobile ? "Week of" : "",
              font: {
                weight: "bold",
                size: 16,
              },
            },
            ticks: {
              autoSkip: true,
              maxRotation: isMobile ? 80 : 30,
              minRotation: isMobile ? 80 : 30,
            },
          },
        },
      }}
    />
  )
}
