import styles from './icon-circle.module.scss'
import { IconType } from 'react-icons'

interface Props {
    Logo: IconType
    size?: number
    padding?: number
    bgColor?: string
    logoColor?: string
}

const IconCircle = ({
    Logo,
    size = 25,
    padding = 25,
    bgColor = "#1E1E1E",
    logoColor = "#fff"
}: Props) => {

    return (
        <>
        <span className={`${styles['circle-wrapper']}`} style={{
            padding: `${padding}px`,
            backgroundColor: bgColor
        }}>
            <Logo color={logoColor} size={size} />
        </span>
        </>
    )
}

export default IconCircle