import type {} from "@mui/lab/themeAugmentation"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineDot from "@mui/lab/TimelineDot"
import { Box, Typography } from "@mui/material"
import { ReactNode } from "react"
import TimelineCard from "@/components/timeline-card/timeline-card"
import Color from "color"

type Props = {
  color: string
  date: string
  children: ReactNode
}

const HistoryItem = ({ color, date, children }: Props) => {
  const getDotColor = (): string => {
    return Color(color).darken(0.2).hex()
  }

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          variant="outlined"
          sx={{
            borderColor: color,
            boxShadow: `0 0 5px ${getDotColor()}, inset 0 0 5px ${getDotColor()}`,
          }}
        />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <TimelineCard
          date={date}
          baseColor={color}
        >
          {children}
        </TimelineCard>
      </TimelineContent>
    </TimelineItem>
  )
}

export default HistoryItem
