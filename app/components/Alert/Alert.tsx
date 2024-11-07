import { getContrastingTextColor } from "@/library/utility/general"
import { Box, keyframes } from "@mui/material"
import Color from "color"
import { motion } from "framer-motion"
import { CSSProperties, ReactNode, useState } from "react"

type AlertProps = {
  children: ReactNode
  bgColor: Color
  onClick?: () => void
  showShimmer?: boolean
  textColor?: Color
  height?: CSSProperties["height"]
}

const shimmer = keyframes`
  0% {
    background-position: -100vw 0;
  }
  100% {
    background-position: 100vw 0;
  }
`

const Alert = (props: AlertProps) => {
  const [hovering, hoveringSetter] = useState<boolean>(false)

  return (
    <Box
      component={motion.div}
      whileHover={{ scale: props.onClick ? 1.05 : 1 }} // Adjust the scale value as desired
      transition={{ type: "just", damping: 20 }}
      onMouseEnter={() => hoveringSetter(true)}
      onMouseLeave={() => hoveringSetter(false)}
      sx={{
        display: "flex",
        alignItems: "center",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        height: props.height ?? undefined,
        padding: 2,
        backgroundColor: props.bgColor
          .darken(hovering && props.onClick ? 0.2 : 0)
          .toString(),
        transition: "background-color linear 80ms",
        color: props.textColor
          ? props.textColor.toString()
          : getContrastingTextColor(props.bgColor).toString(),
        cursor: props.onClick ? "pointer" : undefined,
        backgroundImage: props.showShimmer
          ? `linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0px,
          rgba(255, 255, 255, 0.3) 25%,
          rgba(255, 255, 255, 0) 75%
        )`
          : undefined,
        backgroundSize: props.showShimmer ? "200% 100%" : undefined,
        animation: props.showShimmer ? `${shimmer} 3s infinite` : undefined,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        zIndex: 10000000000,
        overflow: "hidden",
      }}
      onClick={() => {
        if (props.onClick) {
          props.onClick()
        }
      }}
    >
      {props.children}
    </Box>
  )
}

export default Alert
