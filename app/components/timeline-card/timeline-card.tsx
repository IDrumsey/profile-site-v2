import { ReactNode } from "react"
import styles from "./timeline-card.module.scss"
import { Box, Typography } from "@mui/material"
import Color from "color"

type Props = {
  date: string
  baseColor: string
  children: ReactNode
}

const TimelineCard = ({ children, baseColor, date }: Props) => {
  const getBgColor = (): string => {
    const color = Color(baseColor)

    return color.darken(0.8).alpha(0.5).hex()
  }

  return (
    <div
      style={{
        paddingInline: 32,
        paddingBlock: 16,
        borderRadius: 5,
        backgroundColor: getBgColor(),
        border: `1.5px solid ${baseColor}`,
        boxShadow: `0 0 1px ${baseColor}, inset 0 0 1px ${baseColor}`,
      }}
    >
      <Typography
        variant="caption"
        marginBottom={2}
      >
        {date}
      </Typography>
      {children}
    </div>
  )
}

export default TimelineCard
