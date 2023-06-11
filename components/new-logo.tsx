// import styles from ''

import { useGLTF } from "@react-three/drei"

type Props = {}

const NewLogoSpinner = ({}: Props) => {
  const model = useGLTF("/new-logo.gltf")

  return (
    <>
      <mesh>
        <primitive object={model.scene} />
        <meshStandardMaterial />
      </mesh>
    </>
  )
}

export default NewLogoSpinner
