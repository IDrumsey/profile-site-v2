import { useFrame } from "@react-three/fiber"
import { animate, useMotionValue } from "framer-motion"
import { useEffect, useRef } from "react"
import { GridHelper, Material } from "three"

type Props = {
  size: number
  showing: boolean
}

export const MyGridHelper = (props: Props) => {
  const grid1Ref = useRef<GridHelper>(null)
  const grid2Ref = useRef<GridHelper>(null)
  const grid3Ref = useRef<GridHelper>(null)

  const gridOpacity = useMotionValue(0)

  useEffect(() => {
    animate(gridOpacity, props.showing ? 1 : 0, { duration: 0.5 })
  }, [props.showing, gridOpacity])

  useFrame(() => {
    for (const gridRef of [grid1Ref, grid2Ref, grid3Ref]) {
      if (gridRef.current) {
        const material = gridRef.current.material as Material

        if (!Array.isArray(material)) {
          material.opacity = gridOpacity.get()
          material.transparent = true
          material.colorWrite = true
          gridRef.current.visible = gridOpacity.get() > 0
        }
      }
    }
  })

  return (
    <>
      <primitive
        ref={grid1Ref}
        object={new GridHelper(props.size, props.size, "grey")}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <primitive
        ref={grid2Ref}
        object={new GridHelper(props.size, props.size, "grey")}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <primitive
        ref={grid3Ref}
        object={new GridHelper(props.size, props.size, "grey")}
        position={[0, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />
    </>
  )
}
