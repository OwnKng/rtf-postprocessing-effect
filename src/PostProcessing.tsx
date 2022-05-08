//@ts-nocheck
import { useRef, useState, useEffect, useMemo } from "react"
import { extend, useThree, useFrame } from "@react-three/fiber"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import dataTextureEffect from "./effects/DataTextureEffect"
import * as THREE from "three"
import noiseEffect from "./effects/NoiseEffect"

extend({ EffectComposer, RenderPass, UnrealBloomPass })

const textureWidth = 64
const textureHeight = 64
const textureSize = textureWidth * textureHeight

const PostProcessing = ({ children }: any) => {
  const { gl, camera, size } = useThree()
  const [scene, setScene] = useState()
  const composer = useRef<EffectComposer>(null!)

  const previousMousePosition = useRef({ x: 0, y: 0 })
  const mouseVelocity = useRef({ x: 0, y: 0 })

  useEffect(
    () => void scene && composer.current.setSize(size.width, size.height),
    [size, scene]
  )

  //_ data texture effect
  const dtEffect = useMemo(() => new ShaderPass(dataTextureEffect), [])

  const dataTexture = useMemo(() => {
    const data = new Uint8Array(4 * textureSize)

    for (let i = 0; i < textureSize; i++) {
      const r = Math.random() * 255
      data[i * 4 + 0] = r
      data[i * 4 + 1] = r
      data[i * 4 + 2] = r
      data[i * 4 + 3] = 255
    }

    const dataTexture = new THREE.DataTexture(data, textureWidth, textureHeight)
    dataTexture.needsUpdate = true

    dtEffect.uniforms.uDataTexture.value = dataTexture

    return dataTexture
  }, [dtEffect])

  const updateDataTexture = (mouse) => {
    //* Reproject mouse to between 0 and 1
    mouse.x = mouse.x * 0.5 + 0.5
    mouse.y = mouse.y * 0.5 + 0.5

    const { data } = dataTexture.image

    for (let i = 0; i < data.length; i++) {
      data[i * 4] *= 0.92
      data[i * 4 + 1] *= 0.92
    }

    //* calculate position between current mouse and previous mouse position
    mouseVelocity.current.x = mouse.x - previousMousePosition.current.x
    mouseVelocity.current.y = mouse.y - previousMousePosition.current.y

    //* get grid cell for mouse position
    const gridMouseX = Math.round(textureWidth * mouse.x)
    const gridMouseY = Math.round(textureHeight * mouse.y)
    const maxDistance = 4

    //* apply the distortion
    for (let i = 0; i < textureWidth; i++) {
      for (let j = 0; j < textureHeight; j++) {
        const distance = (gridMouseX - i) ** 2 + (gridMouseY - j) ** 2
        const maxDistanceSquared = maxDistance ** 2

        if (distance < maxDistanceSquared) {
          const index = (i + textureWidth * j) * 4
          const power = distance === 0 ? 1 : maxDistance / Math.sqrt(distance)
          data[index] += 500 * mouseVelocity.current.x * power
          data[index + 1] += 500 * mouseVelocity.current.y * power
        }
      }
    }

    //* start the return of velocity back to zero
    mouseVelocity.current.x *= 0.92
    mouseVelocity.current.y *= 0.92

    dataTexture.needsUpdate = true

    //* set the previous mouse position for the next frame
    previousMousePosition.current.x = mouse.x
    previousMousePosition.current.y = mouse.y
  }

  //_ noise grain effect
  const nEffect = useMemo(() => new ShaderPass(noiseEffect), [])

  useFrame(({ mouse, clock }) => {
    scene && composer.current.render()

    updateDataTexture(mouse)
    nEffect.uniforms.uTime.value = clock.getElapsedTime()
  }, 1)

  return (
    <>
      <scene ref={setScene}>{children}</scene>
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray='passes' scene={scene} camera={camera} />
        <primitive attachArray='passes' object={dtEffect} dispose={null} />
        <primitive attachArray='passes' object={nEffect} dispose={null} />
      </effectComposer>
    </>
  )
}

export default PostProcessing
