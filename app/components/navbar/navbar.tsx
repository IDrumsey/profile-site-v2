import styles from "./navbar.module.scss"
import Link from "next/link"

type Props = {}

const Navbar = ({}: Props) => {
  return (
    <>
      <div id={styles["header"]}>
        <nav id={styles["main-nav"]}>
          <Link href="/">
            <h5
              className={`${styles["nav-item"]} ${styles["home-text-gradient"]}`}
            >
              Home
            </h5>
          </Link>
          <Link href="/blog">
            <h5
              className={`${styles["nav-item"]} ${styles["blog-text-gradient"]}`}
            >
              Blog
            </h5>
          </Link>
          <Link href="/history/career">
            <h5
              className={`${styles["nav-item"]} ${styles["history-text-gradient"]}`}
            >
              Career History
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
    </>
  )
}

export default Navbar
