import { IconButton } from "@mui/material"
import { styled } from "@mui/material/styles"

const AlwaysVisibleIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "bgColor" && prop !== "hoverColor", // Filter custom props
})<{ bgColor?: string; hoverColor?: string }>(
  ({ theme, bgColor, hoverColor }) => ({
    backgroundColor: bgColor ?? theme.palette.grey[800], // Light background color
    "&:hover": {
      backgroundColor: hoverColor ?? theme.palette.grey[700], // Darker on hover
    },
    padding: theme.spacing(3),
  })
)

export default AlwaysVisibleIconButton
