import styles from './section.module.scss'
import React from 'react'

interface Props {
    title: string
    // https://www.carlrippon.com/react-children-with-typescript/
    children: JSX.Element | JSX.Element[]
    titleClassNames: string[]
}

// https://reactjs.org/docs/forwarding-refs.html
// https://www.carlrippon.com/react-forwardref-typescript/
const Section = React.forwardRef<HTMLParagraphElement, Props>(({
    title,
    children,
    titleClassNames
}, ref) => {

    return (
        <>
        {/* https://bobbyhadz.com/blog/javascript-convert-array-to-string-with-spaces */}
        <div className={`${styles["section-header-wrapper"]} ${titleClassNames.join(' ')}`} ref={ref}>
            <p className={`${styles['section-title']}`}>{title}</p>
            <div className={`${styles['underline']}`}></div>
        </div>
        <div className={`${styles['tech-stack']}`}>
            {children}
        </div>
        </>
    )
})

// https://stackoverflow.com/a/67993106/17712310
Section.displayName = "Tech-Stack-Section"

export default Section