import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/index.module.scss'

import { useInView } from 'react-intersection-observer'

// a lot of the brand colors come from the official websites

import { AiFillLinkedin } from 'react-icons/ai'
import { FaGithubSquare, FaYoutubeSquare } from 'react-icons/fa'

export default function Home() {

  // https://youtu.be/r1auJEf9ISo
  // https://github.com/thebuilder/react-intersection-observer
  const { ref: descRef, inView: descInView, entry: descEntry } = useInView({
    // https://youtu.be/T8EYosX4NOo
    rootMargin: '0px 0px -20% 0px',
    triggerOnce: true,
    delay: 1000
  })


  const socialQuickLinkAnimationDelay = 2000


  const { ref: linkedInQuickLinkRef, inView: linkedInQuickLinkInView, entry: linkedInQuickLinkEntry } = useInView({
    // https://stackoverflow.com/a/68714239/17712310
    rootMargin: '0px 100% -20% 100%',
    triggerOnce: true,
    delay: socialQuickLinkAnimationDelay,
    trackVisibility: true
  })

  const { ref: githubQuickLinkRef, inView: githubQuickLinkInView, entry: githubQuickLinkEntry } = useInView({
    rootMargin: '0px 100% -20% 100%',
    triggerOnce: true,
    delay: socialQuickLinkAnimationDelay + 250
  })

  const { ref: youtubeQuickLinkRef, inView: youtubeQuickLinkInView, entry: youtubeQuickLinkEntry } = useInView({
    rootMargin: '0px 100% -20% 100%',
    triggerOnce: true,
    delay: socialQuickLinkAnimationDelay + 500
  })





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

          {/* https://stackoverflow.com/a/65509211/17712310 */}
          <img 
            src="/avatar.png"
            alt="Avatar image"
            id={styles['avatar-image']}
          />
        </div>


        <div id={styles['section-1-wrapper']}>
          {/* entity character fix suggested by next build */}
          <p id={styles['about-me-short-desc']} className={`${descInView ? styles['desc-in-view'] : styles['desc-out-view']}`}>Hi, I&apos;m Clay. I&apos;m a web developer out of Northeast Ohio.</p>

          <div id={styles['social-quick-links']} ref={descRef}>
            {/* https://react-icons.github.io/react-icons */}
            <div  
              ref={linkedInQuickLinkRef}
              className={`${styles['social-quick-link']} ${linkedInQuickLinkInView ? styles['social-quick-link-in-view'] : styles['social-quick-link-out-view']}`}
            >
              <AiFillLinkedin 
                id={styles['linked-in-social-quick-link']} 
                className={styles['social-quick-link']} 
              />
            </div>

            <div  
              ref={githubQuickLinkRef}
              className={`${styles['social-quick-link']} ${githubQuickLinkInView ? styles['social-quick-link-in-view'] : styles['social-quick-link-out-view']}`}
            >
              <FaGithubSquare 
                id={styles['github-social-quick-link']} 
                className={styles['social-quick-link']} 
              />
            </div>

            <div  
              ref={youtubeQuickLinkRef}
              className={`${styles['social-quick-link']} ${youtubeQuickLinkInView ? styles['social-quick-link-in-view'] : styles['social-quick-link-out-view']}`}
            >
              <FaYoutubeSquare 
                id={styles['youtube-social-quick-link']} 
                className={styles['social-quick-link']} 
              />
            </div>
          </div>
        </div>
      </main>
      </>
  )
}
