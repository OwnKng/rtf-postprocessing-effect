//@ts-nocheck
import React, { useRef, useState, useEffect, useMemo } from "react"
import { extend, useThree, useFrame } from "@react-three/fiber"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import customEffect from "./effects/CustomEffect"

extend({ EffectComposer, RenderPass, UnrealBloomPass })

const Effect = ({ children }: any) => {
  const { gl, camera, size } = useThree()
  const [scene, setScene] = useState()
  const composer = useRef<EffectComposer>(null!)

  useEffect(
    () => void scene && composer.current.setSize(size.width, size.height),
    [size]
  )

  useFrame(() => scene && composer.current.render(), 1)

  const effect = useMemo(() => new ShaderPass(customEffect), [])

  useFrame(({ clock }) => {
    effect.uniforms.uDisruption.value = Math.sin(clock.getElapsedTime()) * 0.05
  })

  return (
    <>
      <scene ref={setScene}>{children}</scene>
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray='passes' scene={scene} camera={camera} />
        <primitive attachArray='passes' object={effect} dispose={null} />
      </effectComposer>
    </>
  )
}

export default Effect
