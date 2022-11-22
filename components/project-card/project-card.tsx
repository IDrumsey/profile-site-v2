import styles from './project-card.module.scss'

import React from 'react'

import { Project } from '../../models/project'
import { useMantineTheme } from '@mantine/core'


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
            <div className={`${styles['project-card-footer']}`}></div>
        </div>
        </>
    )
})

// https://stackoverflow.com/a/67993106/17712310
ProjectCard.displayName = "ProjectCard"

export default ProjectCard