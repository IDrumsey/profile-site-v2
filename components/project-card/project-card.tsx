import styles from './project-card.module.scss'

import React from 'react'

import { Project } from '../../models/project'
import { useMantineTheme } from '@mantine/core'

import { FaGithubSquare, FaYoutubeSquare } from 'react-icons/fa'


interface Props {
    project: Project,
    wrapperClassNames?: string[]
}

// https://reactjs.org/docs/forwarding-refs.html
// https://www.carlrippon.com/react-forwardref-typescript/
const ProjectCard = React.forwardRef<HTMLParagraphElement, Props>(({
    project,
    wrapperClassNames = []
}: Props, ref) => {

    // https://mantine.dev/theming/functions/
    const theme = useMantineTheme()


    return (
        <>
        <div 
            ref={ref} 
            className={`${wrapperClassNames.join(' ')}`}
            style={{
                boxShadow: `0 2px 5px ${theme.colorScheme == 'dark' ? theme.colors.dark[9] : theme.colors.gray[8]}`
            }}
        >
            <div className={`${styles['project-card-header']}`}>
                <p className={`${styles['project-card-title']}`}>{project.title}</p>
            </div>
            <div className={`${styles['project-card-body']}`}>
                <p className={`${styles['project-card-desc']}`}>{project.description}</p>
            </div>
            <div className={`${styles['project-card-footer']}`}>
                <div className={`${styles['project-quick-links']}`}>
                    {
                        project.repoLink && 

                        <a
                            href={project.repoLink}
                            className={`${styles['project-quick-link']}`}
                            target="_blank"
                            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#security_and_privacy
                            rel="noreferrer"
                        >
                            <FaGithubSquare
                                color="#A1A1A1"
                                className={`${styles['project-quick-link-logo']}`}
                            />
                        </a>
                    }

                    {
                        project.videoLink && 

                        <a
                            href={project.videoLink}
                            className={`${styles['project-quick-link']}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FaYoutubeSquare
                                color="#981C42"
                                className={`${styles['project-quick-link-logo']}`}
                            />
                        </a>
                    }
                </div>
            </div>
        </div>
        </>
    )
})

// https://stackoverflow.com/a/67993106/17712310
ProjectCard.displayName = "ProjectCard"

export default ProjectCard