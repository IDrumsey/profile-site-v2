import { getContrastingTextColor } from "@/library/utility/general"
import { Box, keyframes } from "@mui/material"
import Color from "color"
import { motion } from "framer-motion"
import { ReactNode, useState } from "react"

type AlertProps = {
  children: ReactNode
  bgColor: Color
  onClick: () => void
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
      whileHover={{ scale: 1.05 }} // Adjust the scale value as desired
      transition={{ type: "just", damping: 20 }}
      onMouseEnter={() => hoveringSetter(true)}
      onMouseLeave={() => hoveringSetter(false)}
      sx={{
        position: "sticky",
        bottom: 0,
        left: 0,
        width: "100vw",
        padding: 2,
        backgroundColor: props.bgColor.darken(hovering ? 0.2 : 0).toString(),
        transition: "background-color linear 80ms",
        color: getContrastingTextColor(props.bgColor).toString(),
        cursor: "pointer",
        backgroundImage: `linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0px,
          rgba(255, 255, 255, 0.3) 25%,
          rgba(255, 255, 255, 0) 75%
        )`,
        backgroundSize: "200% 100%",
        animation: `${shimmer} 3s infinite`,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
      }}
      onClick={() => {
        props.onClick()
      }}
    >
      {props.children}
    </Box>
  )
}

export default Alert
