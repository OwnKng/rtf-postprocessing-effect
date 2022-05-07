import { useTexture } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { fragment } from "./shaders/fragment"
import { vertex } from "./shaders/vertex"
import * as THREE from "three"

const DistortionMaterial = ({ texture, dataTexture }: any) => {
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uDataTexture: { value: dataTexture },
    }),
    [dataTexture, texture]
  )

  return (
    <shaderMaterial
      uniforms={uniforms}
      vertexShader={vertex}
      fragmentShader={fragment}
    />
  )
}

const width = 20
const height = 20
const size = width * height

const Sketch = () => {
  const texture = useTexture("temple.jpeg")

  const previousMousePosition = useRef({ x: 0, y: 0 })
  const mouseVelocity = useRef({ x: 0, y: 0 })

  const { viewport } = useThree()

  const dataTexture = useMemo(() => {
    const data = new Uint8Array(4 * size)

    for (let i = 0; i < size; i++) {
      const r = Math.random() * 255
      data[i * 4 + 0] = r
      data[i * 4 + 1] = r
      data[i * 4 + 2] = r
      data[i * 4 + 3] = 255
    }

    const dataTexture = new THREE.DataTexture(data, width, height)
    dataTexture.needsUpdate = true

    return dataTexture
  }, [])

  useFrame(({ mouse }) => {
    const { data } = dataTexture.image

    for (let i = 0; i < data.length; i++) {
      data[i * 4] *= 0.92
      data[i * 4 + 1] *= 0.92
    }

    //* Reproject mouse to between 0 and 1
    mouse.x = mouse.x * 0.5 + 0.5
    mouse.y = mouse.y * 0.5 + 0.5

    //* calculate position between current mouse and previous mouse position
    mouseVelocity.current.x = mouse.x - previousMousePosition.current.x
    mouseVelocity.current.y = mouse.y - previousMousePosition.current.y

    //* get grid cell for mouse position
    const gridMouseX = Math.round(width * mouse.x)
    const gridMouseY = Math.round(height * mouse.y)
    const maxDistance = 4

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const distance = (gridMouseX - i) ** 2 + (gridMouseY - j) ** 2
        const maxDistanceSqaured = maxDistance ** 2

        if (distance < maxDistanceSqaured) {
          const index = (i + width * j) * 4
          const power = distance === 0 ? 1 : maxDistance / Math.sqrt(distance)
          data[index] += 500 * mouseVelocity.current.x * power
          data[index + 1] += 500 * mouseVelocity.current.y * power
        }
      }
    }

    mouseVelocity.current.x *= 0.9
    mouseVelocity.current.y *= 0.9

    dataTexture.needsUpdate = true

    previousMousePosition.current.x = mouse.x
    previousMousePosition.current.y = mouse.y
  })

  return (
    <mesh>
      <planeBufferGeometry args={[viewport.width, viewport.height]} />
      <DistortionMaterial texture={texture} dataTexture={dataTexture} />
    </mesh>
  )
}

export default Sketch
