import styles from "./project-card.module.scss"

import React, { useState, useEffect, useMemo } from "react"

import { Project } from "@/models/project"

import { FaGithubSquare, FaYoutubeSquare } from "react-icons/fa"
import { motion } from "framer-motion"

const card_border_color = {
  name: "blue",
  nonHover: "#4b80e3",
  hover: "#ff00f7",
}

interface Props {
  project: Project
  wrapperClassNames?: string[]
}

// https://reactjs.org/docs/forwarding-refs.html
// https://www.carlrippon.com/react-forwardref-typescript/
const ProjectCard = React.forwardRef<HTMLParagraphElement, Props>(
  ({ project, wrapperClassNames = [] }: Props, ref) => {
    const [runningLiveIndicatorAnimation, runningLiveIndicatorAnimationSetter] =
      useState(false)

    useEffect(() => {
      const timeout = setTimeout(() => {
        runningLiveIndicatorAnimationSetter(true)
      }, Math.random() * 1000)

      return () => {
        clearTimeout(timeout)
      }
    }, [])

    function getClickLink(): string | undefined {
      return (
        project.liveLink ?? project.videoLink ?? project.repoLink ?? undefined
      )
    }

    return (
      <>
        <motion.div
          ref={ref}
          className={`${wrapperClassNames.join(" ")}`}
          style={{
            boxShadow: `0 0 5px ${card_border_color.nonHover}ff`,
          }}
          whileHover={{
            scale: 1.02,
            cursor: "pointer",
            boxShadow: `0 0 5px ${card_border_color.hover}ff`,
          }}
          onClick={() => {
            const linkToGoTo = getClickLink()

            if (linkToGoTo) {
              window.open(linkToGoTo, "_blank")
            }
          }}
        >
          <div className={`${styles["project-card-header"]}`}>
            <p className={`${styles["project-card-title"]}`}>{project.title}</p>
            {project.hosted && (
              <span className={`${styles["project-card-hosted-indicated"]}`}>
                <div
                  className={`${styles["project-card-hosted-indicator-blink-circle"]}`}
                  style={{
                    animation: runningLiveIndicatorAnimation
                      ? `${styles["blink-circle"]} 3000ms infinite`
                      : "",
                  }}
                ></div>
                <a href={project.liveLink ?? "#"}>
                  <p
                    className={`${styles["project-card-hosted-indicator-live-text"]}`}
                  >
                    live
                  </p>
                </a>
              </span>
            )}
          </div>
          <div className={`${styles["project-card-body"]}`}>
            <p className={`${styles["project-card-desc"]}`}>
              {project.description}
            </p>
          </div>
          <div className={`${styles["project-card-footer"]}`}>
            <div className={`${styles["project-quick-links"]}`}>
              {project.repoLink && (
                <a
                  href={project.repoLink}
                  className={`${styles["project-quick-link"]}`}
                  target="_blank"
                  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#security_and_privacy
                  rel="noreferrer"
                >
                  <FaGithubSquare
                    color="#A1A1A1"
                    className={`${styles["project-quick-link-logo"]}`}
                  />
                </a>
              )}

              {project.videoLink && (
                <a
                  href={project.videoLink}
                  className={`${styles["project-quick-link"]}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaYoutubeSquare
                    color="#981C42"
                    className={`${styles["project-quick-link-logo"]}`}
                  />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </>
    )
  }
)

// https://stackoverflow.com/a/67993106/17712310
ProjectCard.displayName = "ProjectCard"

export default ProjectCard
