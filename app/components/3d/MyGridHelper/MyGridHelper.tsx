import { GridHelper } from "three"

type Props = {
  size: number
}

export const MyGridHelper = (props: Props) => {
  return (
    <>
      <primitive
        object={new GridHelper(props.size, props.size, "grey")}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <primitive
        object={new GridHelper(props.size, props.size, "grey")}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <primitive
        object={new GridHelper(props.size, props.size, "grey")}
        position={[0, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />
    </>
  )
}
