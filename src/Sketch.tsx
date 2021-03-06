//@ts-nocheck
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { Mesh } from "three"
import * as THREE from "three"
import { vertex } from "./shaders/vertex"
import { fragment } from "./shaders/fragment"
import { Text } from "@react-three/drei"

const Sketch = () => {
  const meshRef = useRef<Mesh>(null!)

  const geometry = useMemo(() => {
    const geometry = new THREE.IcosahedronBufferGeometry(5.02, 1)

    const length = geometry.attributes.position.array.length

    const bary = []

    for (let i = 0; i < length; i++) {
      bary.push(0, 0, 1, 0, 1, 0, 0)
    }

    const aBary = new Float32Array(bary)
    geometry.setAttribute("aBary", new THREE.BufferAttribute(aBary, 3))

    return geometry
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        side: THREE.DoubleSide,
      }),
    []
  )

  useFrame(() => {
    meshRef.current.rotation.x += 0.005
    meshRef.current.rotation.z -= 0.005
  })

  return (
    <>
      <Text
        color='white'
        anchorX='middle'
        anchorY='middle'
        fontSize={1.5}
        position={[-6, -4, 0]}
        fillOpacity={0}
        outlineOpacity={1}
        strokeWidth={0.02}
      >
        POST
      </Text>
      <Text
        color='white'
        anchorX='middle'
        anchorY='middle'
        fontSize={2}
        position={[-6, -6, 0]}
        fillOpacity={0}
        outlineOpacity={1}
        strokeWidth={0.03}
      >
        PROCESSING
      </Text>
      <mesh ref={meshRef} geometry={geometry} material={material} />
    </>
  )
}

export default Sketch
