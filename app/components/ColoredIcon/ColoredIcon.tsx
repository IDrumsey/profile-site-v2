import Color from "color"
import { IconType } from "react-icons"

type Props = {
  Icon: IconType
  color: Color | null
}

const ColoredIcon = ({ Icon, color }: Props) => {
  return <Icon style={{ color: color?.hex() ?? undefined }} />
}

export default ColoredIcon
