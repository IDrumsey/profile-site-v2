import Chip from "@mui/material/Chip"

type Props = {
  tag: string
}

const PostTag = ({ tag }: Props) => {
  return (
    <Chip
      label={tag}
      sx={{ backgroundColor: "#ddb1e619", color: "#ddb1e6" }}
    />
  )
}

export default PostTag
