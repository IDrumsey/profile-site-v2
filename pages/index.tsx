import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/index.module.scss'

import { useInView, InView } from 'react-intersection-observer'


import StackSection from '../components/tech-stack/section/section'
import SectionItem from '../components/tech-stack/section-item/section-item'

// a lot of the brand colors come from the official websites

import { AiFillLinkedin } from 'react-icons/ai'
import { FaGithubSquare, FaYoutubeSquare, FaHtml5, FaCss3Alt } from 'react-icons/fa'
import {SiJavascript} from 'react-icons/si'

export default function Home() {

  // https://youtu.be/r1auJEf9ISo
  // https://github.com/thebuilder/react-intersection-observer
  const { ref: descRef, inView: descInView, entry: descEntry } = useInView({
    // https://youtu.be/T8EYosX4NOo
    rootMargin: '0px 0px -20% 0px',
    triggerOnce: true,
    delay: 1000
  })



  const socialQuickLinks: {
    logoIcon: any,
    logoColor: string,
    url?: string
  }[] = [
    {
      logoIcon: AiFillLinkedin,
      logoColor: '#0a66c2',
      url: "https://www.linkedin.com/in/clay-casper/"
    },

    {
      logoIcon: FaGithubSquare,
      logoColor: '#b9bbbd',
      url: "https://github.com/IDrumsey"
    },

    {
      logoIcon: FaYoutubeSquare,
      logoColor: '#981C42',
      url: "https://www.youtube.com/channel/UC9uVJXXGUJB_OP7hN959qbQ"
    }
  ]

  const socialQuickLinkAnimationDelay = 400



  const { ref: mostUsedSectionTitleRef, inView: mostUsedSectionTitleInView, entry: mostUsedSectionTitleEntry } = useInView({
    threshold: 1,
    rootMargin: '0px 100% 0% 100%',
    triggerOnce: true
  })


  const technologies: {
    title: string,
    items: {
      name: string,
      logoIcon: any,
      logoColor: string
    }[]
  }[] = [
    {
      title: "Most Used",
      items: [
        {
          name: "Javascript",
          logoIcon: SiJavascript,
          logoColor: "#FFE600"
        },
        
        {
          name: "HTML",
          logoIcon: FaHtml5,
          logoColor: "#D26C40"
        },

        {
          name: "CSS",
          logoIcon: FaCss3Alt,
          logoColor: "#3170CF"
        }
      ]
    }
  ]

  const techStackAnimationDelay = 50





  return (
      <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div id={styles['header']}>
          <nav id={styles['main-nav']}>
            <Link href="/blog">
              <h5 className={`${styles['nav-item']} ${styles['blog-text-gradient']}`}>Blog</h5>
            </Link>
            <Link href="/about">
              <h5 className={`${styles['nav-item']} ${styles['about-text-gradient']}`}>About me</h5>
            </Link>
          </nav>

          <div id={styles['avatar-wrapper']}>
            {/* https://stackoverflow.com/a/65509211/17712310 */}
            <img 
              src="./IMG_0917.jpg"
              alt="Avatar image"
              id={styles['avatar-image']}
            />
          </div>
        </div>


        <div id={styles['section-1-wrapper']}>
          {/* entity character fix suggested by next build */}
          <p id={styles['about-me-short-desc']} className={`${descInView ? styles['desc-in-view'] : styles['desc-out-view']}`}>Hi, I&apos;m Clay. I&apos;m a web developer out of Northeast Ohio.</p>

          <div id={styles['social-quick-links']} ref={descRef}>

            {
              socialQuickLinks.map((socialQuickLink, i) => (
                // https://stackoverflow.com/a/68714239/17712310
                <InView key={i} rootMargin='0px 100% -20% 100%' triggerOnce>
                  {
                    ({ref, inView}) => (
                      // https://react-icons.github.io/react-icons
                      <div 
                        ref={ref}
                        className={`${styles['social-quick-link']} ${inView ? styles['social-quick-link-in-view'] : styles['social-quick-link-out-view']}`}
                        style={{animationDelay: `${i * socialQuickLinkAnimationDelay}ms`}}
                      >
                        {/* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#security_and_privacy */}
                        <a href={socialQuickLink.url} target="_blank" rel="noreferrer">
                          <socialQuickLink.logoIcon 
                            color={socialQuickLink.logoColor}
                          />
                        </a>
                      </div>
                    )
                  }
                </InView>
              ))
            }
          </div>
        </div>



        <div id={`${styles['section-2']}`}>
          <div id={`${styles['tech-stack']}`}>

            {
              // https://reactjs.org/docs/lists-and-keys.html
              technologies.map((technologySection, sectionI) => {
                return (
                  // https://github.com/thebuilder/react-intersection-observer#:~:text=To%20use%20the-,%3CInView%3E%20component,-%2C%20you%20pass%20it
                  // https://sentry.io/answers/unique-key-prop/#:~:text=Keys%20do%20not%20have%20to%20be%20unique%20globally.%20They%20just%20need%20to%20be%20unique%20across%20sibling%20elements.
                  <InView key={sectionI} threshold={1} rootMargin='0px 100% 0% 100%' triggerOnce >
                    {
                      ({ref, inView}) => (
                        <StackSection title={technologySection.title} ref={ref} titleClassNames={[styles['tech-stack-section-title'], inView ? styles['tech-stack-section-title-in-view'] : styles['tech-stack-section-title-out-view']]} >
                          {
                            technologySection.items.map((item, itemI) => {
                              return (
                                <InView key={itemI} threshold={1} rootMargin='0px 100% 0% 100%' triggerOnce >
                                {({ref, inView}) => (
                                  <SectionItem 
                                    LogoIcon={item.logoIcon} 
                                    logoColor={item.logoColor} 
                                    name={item.name} 
                                    ref={ref} 
                                    wrapperClassNames={[styles['tech-stack-item'], inView ? styles['tech-stack-item-in-view'] : styles['tech-stack-item-out-view']]} 
                                    animationDelay={techStackAnimationDelay*(itemI+1)*(sectionI+1)}
                                  />
                                )}
                              </InView>
                              )
                            })
                          }
                        </StackSection>
                      )
                    }
                  </InView>
                )
              })
            }
          </div>

          <div id={`${styles['featured-projects']}`}>
            <div className={`${styles['featured-project']}`}>asdf</div>
            <div className={`${styles['featured-project']}`}>asdf</div>
            <div className={`${styles['featured-project']}`}></div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet dolorem molestias quis distinctio corporis quidem inventore odio repellendus nemo! Quo aperiam quidem consequatur sit quas esse perspiciatis, numquam et ullam, aspernatur velit a beatae? Ad quo quas quisquam distinctio itaque magnam inventore delectus omnis hic eius illum, nihil voluptates corporis nam accusamus doloribus cumque harum impedit ipsam? Aperiam culpa a obcaecati consequuntur expedita? Sapiente adipisci ut repellat, praesentium obcaecati deserunt cum laboriosam quasi, neque repellendus ea eos earum voluptatibus architecto soluta magni aspernatur vel in blanditiis, fugiat quo aut! Accusantium velit qui illum autem veniam, a quos sed optio. Nihil!
          </div>
        </div>
      </main>
      </>
  )
}
