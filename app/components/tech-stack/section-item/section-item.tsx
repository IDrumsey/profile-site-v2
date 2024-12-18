import styles from "./section-item.module.scss"
import React, { CSSProperties, useEffect, useRef } from "react"

import { IconType } from "react-icons"

interface Props {
  name: string
  // pascal case suggested by next dev
  LogoIcon?: IconType
  logoColor?: string
  wrapperClassNames: string[]
  animationDelay: number
  adjustLogoToTextBottom?: boolean
  wrapperStyles?: CSSProperties
}

const SectionItem = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      name,
      LogoIcon,
      logoColor,
      wrapperClassNames,
      animationDelay,
      adjustLogoToTextBottom = false,
      wrapperStyles,
    }: Props,
    ref
  ) => {
    // https://reactjs.org/docs/hooks-reference.html#useref
    const nameRef = useRef<HTMLParagraphElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (requiresShift(name)) {
        if (nameRef.current) {
          // https://www.javascripttutorial.net/javascript-dom/javascript-width-height/
          // https://stackoverflow.com/a/61475517/17712310
          const nameHeight = nameRef.current.clientHeight
          const heightToAddToLogo = nameHeight * 0.2

          if (logoRef.current && adjustLogoToTextBottom) {
            logoRef.current.style.marginBottom = `${heightToAddToLogo}px`
          }
        }
      }
      // added dependency as suggested by next build
    }, [name, adjustLogoToTextBottom])

    return (
      <>
        <div
          ref={ref}
          className={`${styles["tech-stack-item"]} ${wrapperClassNames.join(
            " "
          )}`}
          style={{
            // https://youtu.be/8RrTJY_z36c
            animationDelay: `${animationDelay}ms`,
            ...wrapperStyles,
          }}
        >
          {
            LogoIcon && (
              <div
                ref={logoRef}
                className={`${styles["tech-logo-wrapper"]}`}
              >
                <LogoIcon
                  style={{ color: logoColor }}
                  className={`${styles["tech-logo"]}`}
                />
              </div>
            )

            // <LogoIcon style={{color: logoColor}} className={`${styles['tech-logo']}`} />
          }
          <p
            ref={nameRef}
            className={`${styles["tech-name"]}`}
          >
            {name}
          </p>
        </div>
      </>
    )
  }
)

// https://stackoverflow.com/a/67993106/17712310
SectionItem.displayName = "SectionItem"

export default SectionItem

const requiresShift = (word: string) => {
  const subLetters = ["p", "y", "g", "q"]

  for (let i = 0; i < subLetters.length; i++) {
    let subLetter = subLetters[i]
    // https://careerkarma.com/blog/javascript-string-contains/#:~:text=You%20can%20check%20if%20a,designed%20specifically%20for%20that%20purpose.
    if (word.includes(subLetter)) {
      return true
    }
  }

  return false
}
