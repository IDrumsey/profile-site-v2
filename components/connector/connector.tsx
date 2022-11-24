import styles from './connector.module.scss'

interface Props {
    width: number
    height: number
    startX: number
    startY: number
    bgColor?: string
}

const Connector = ({
    width,
    height,
    startX,
    startY,
    bgColor = "#fff"
}: Props) => {

    return (
        <div className="connector"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                position: 'absolute',
                top: `${startY}px`,
                left: `${startX}px`,
                backgroundColor: bgColor
            }}
        ></div>
    )
}

export default Connector