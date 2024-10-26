import Color from "color"
import { IconType } from "react-icons"

type Props = {
  Icon: IconType
  color: string | null
}

const ColoredIcon = ({ Icon, color }: Props) => {
  return <Icon color={color ?? undefined} />
}

export default ColoredIcon
