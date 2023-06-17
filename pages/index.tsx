import Head from "next/head"
import Link from "next/link"

import styles from "../styles/index.module.scss"

import { useInView, InView } from "react-intersection-observer"

import { useEffect, useState } from "react"

import { motion } from "framer-motion"

import StackSection from "../components/tech-stack/section/section"
import SectionItem from "../components/tech-stack/section-item/section-item"
import ProjectCard from "../components/project-card/project-card"

// a lot of the brand colors come from the official websites

import { AiFillLinkedin } from "react-icons/ai"
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
} from "react-icons/fa"
import { SiCplusplus } from "react-icons/si"
import { SiJavascript } from "react-icons/si"
import { Project } from "../models/project"
import Image from "next/legacy/image"

export default function Home() {
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
    }[]
  }[] = [
    {
      title: "Most Used",
      items: [
        {
          name: "Javascript",
          logoIcon: SiJavascript,
          logoColor: "yellow",
        },

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
          name: "React",
          logoIcon: FaReact,
          logoColor: "#61dafb",
        },

        {
          name: "NodeJS",
          logoIcon: FaNodeJs,
          logoColor: "#689f63",
        },

        {
          name: "Git",
          logoIcon: FaGitAlt,
          logoColor: "#f54d27",
        },

        {
          name: "Python",
          logoIcon: FaPython,
          logoColor: "#356f9f",
        },
      ],
    },

    {
      title: "It's been a minute",
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
          name: "Laravel",
          logoIcon: FaLaravel,
          logoColor: "#ff2d20",
        },
      ],
    },
  ]

  const techStackAnimationDelay = 50

  const featuredProjects: Project[] = [
    {
      title: "Profile Site",
      description: "Pretty self explanatory.",
      repoLink: "https://github.com/IDrumsey/profile-site-v2",
      hosted: true,
      liveLink: "https://idrumsey.github.io/profile-site-v2/",
    },
    {
      title: "Loan Foresights",
      description: "Figure out a good time for you to get a loan.",
      repoLink: "https://github.com/IDrumsey/Loan-Foresight",
      hosted: true,
      liveLink: "https://idrumsey.github.io/Loan-Foresight/",
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
  }, [])

  const projectCardSectionDisplayDelay = 2100
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
  }, [])

  return <>
    <Head>
      <title>Create Next App</title>
      <meta
        name="description"
        content="Generated by create next app"
      />
      <link
        rel="icon"
        href="/favicon.ico"
      />
    </Head>

    <img
      src="./top-gradient.png"
      alt="Gradient"
      id={styles["top-gradient"]}
    />

    <main id={styles["main-wrapper"]}>
      <div id={styles["header"]}>
        <nav id={styles["main-nav"]}>
          <Link href="/blog" legacyBehavior>
            <h5
              className={`${styles["nav-item"]} ${styles["blog-text-gradient"]}`}
            >
              Blog
            </h5>
          </Link>
          <Link href="/about" legacyBehavior>
            <h5
              className={`${styles["nav-item"]} ${styles["about-text-gradient"]}`}
            >
              About me
            </h5>
          </Link>
        </nav>

        <div id={styles["avatar-wrapper"]}>
          {/* https://stackoverflow.com/a/65509211/17712310 */}
          <img
            src="./IMG_0917.jpg"
            alt="Avatar image"
            id={styles["avatar-image"]}
          />
        </div>
      </div>

      <div id={styles["section-1-wrapper"]}>
        {/* entity character fix suggested by next build */}
        <p
          id={styles["about-me-short-desc"]}
          className={`${
            descInView ? styles["desc-in-view"] : styles["desc-out-view"]
          }`}
        >
          Hi, I&apos;m Clay. I&apos;m a web developer out of Northeast Ohio.
        </p>

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
    </main>
  </>;
}

const getRandomBool = () => {
  // https://stackoverflow.com/a/36756480/17712310
  return Math.random() < 0.5
}
