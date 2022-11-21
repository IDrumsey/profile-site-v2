import styles from './project-card.module.scss'

import React from 'react'

import { Project } from '../../models/project'


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


    return (
        <>
        <div ref={ref} className={`${wrapperClassNames.join(' ')}`}>
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

export default ProjectCard