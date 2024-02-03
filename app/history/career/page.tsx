import type {} from "@mui/lab/themeAugmentation"
import Timeline from "@mui/lab/Timeline"
import { Box, SvgIcon, Typography } from "@mui/material"
import HistoryItem from "@/components/history-item/history-item"
import FITLogoSVG from "public/fortisureit-logo-flag.svg"

type Props = {}

const HistoryPage = ({}: Props) => {
  return (
    <>
      <Timeline position="alternate">
        <HistoryItem
          color="#00bbff"
          date="Spring 2019"
        >
          <Typography
            variant="body1"
            fontWeight="bold"
          >
            Graduated high school
          </Typography>
          <iframe
            src="https://giphy.com/embed/yoJC2GnSClbPOkV0eA"
            width="100%"
            height="auto"
            frameBorder="0"
            className="giphy-embed"
            allowFullScreen
          ></iframe>
          <Typography
            variant="caption"
            fontStyle="italic"
          >
            Via Giphy
          </Typography>
        </HistoryItem>
        <HistoryItem
          color="#fc0394"
          date="Spring 2022"
        >
          <Typography
            variant="body1"
            fontWeight="bold"
          >
            Graduated College
          </Typography>
          <iframe
            src="https://giphy.com/embed/wjBMdDqMCyxJoCJ2yZ"
            width="100%"
            height="auto"
            frameBorder="0"
            className="giphy-embed"
            allowFullScreen
          ></iframe>
          <Typography
            variant="caption"
            fontStyle="italic"
          >
            Via Giphy
          </Typography>
        </HistoryItem>
        <HistoryItem
          color="#fc0394"
          date="Spring 2022"
        >
          <Typography
            variant="body1"
            fontWeight="bold"
          >
            Started working at FortisureIT
          </Typography>
          <SvgIcon
            sx={{
              fontSize: "100px",
              margin: "auto",
              display: "block",
              marginTop: 2,
            }}
          >
            <FITLogoSVG />
          </SvgIcon>
        </HistoryItem>
      </Timeline>

      <iframe
        src="https://giphy.com/embed/dhCx7EyeGYD7O"
        width="100%"
        height="auto"
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen
      ></iframe>
    </>
  )
}

export default HistoryPage
