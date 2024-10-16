import Chip from "@mui/material/Chip"
import { IconType } from "react-icons"
import ColoredIcon from "@/components/ColoredIcon/ColoredIcon"
import Color from "color"

type Props = {
  tag: string
  Icon: IconType | null
  tagColor: Color | null
}

const PostTag = ({ tag, Icon, tagColor }: Props) => {
  return (
    <Chip
      label={tag}
      sx={{
        backgroundColor: "#ddb1e619",
        color: tagColor?.lighten(0.25).hex() ?? "#ddb1e6",
        fontWeight: "bold",
        border: tagColor ? `1px solid ${tagColor.hex()}` : undefined,
        // https://css-tricks.com/how-to-create-neon-text-with-css/
        boxShadow: `0 0 2px ${tagColor?.hex()}, 0 0 10px ${tagColor
          ?.darken(0.5)
          .hex()}, 0 0 200px ${tagColor
          ?.darken(0.5)
          .hex()}, 0 0 300px ${tagColor?.darken(0.5).hex()};`,
        paddingLeft: Icon ? 1 : undefined,
      }}
      icon={
        Icon ? (
          <ColoredIcon
            Icon={Icon}
            color={tagColor?.lighten(0.5) ?? null}
          />
        ) : undefined
      }
    />
  )
}

export default PostTag
