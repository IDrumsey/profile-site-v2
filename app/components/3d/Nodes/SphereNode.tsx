import Color from "color"
import { Vector3 } from "three"

interface SphereNodeProps {
  onSphereClick?: ((location: Vector3) => void) | undefined
  position: Vector3
  color: Color
}

const SphereNode = (props: SphereNodeProps) => {
  return (
    <mesh
      position={[props.position.x, props.position.y, props.position.z]}
      onClick={() =>
        props.onSphereClick ? props.onSphereClick(props.position) : {}
      }
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={props.color.toString()} />
    </mesh>
  )
}

export default SphereNode
