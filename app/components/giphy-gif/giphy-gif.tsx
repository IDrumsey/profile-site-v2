// import styles from ''
import { PropsWithChildren, HTMLProps } from "react"

export type GiphyGifProps = {
  options?: HTMLProps<HTMLDivElement>
  link: string
}

const GiphyGif = ({
  children,
  options,
  link,
}: PropsWithChildren<GiphyGifProps>) => {
  return (
    <div style={{ width: "max-content", ...options?.style }}>
      {children}
      <p style={{ fontSize: 15, color: "#7d7d7d", marginTop: -25 }}>
        <a href={link}>via GIPHY</a>
      </p>
    </div>
  )
}

export default GiphyGif
