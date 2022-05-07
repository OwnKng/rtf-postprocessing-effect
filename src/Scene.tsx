import Effect from "./Effect"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

const Scene = () => (
  <Canvas onCreated={(state) => state.gl.setClearColor("#08121C")}>
    <OrbitControls />
    <Effect>
      <ambientLight intensity={0.8} />
      <mesh>
        <boxBufferGeometry />
        <meshStandardMaterial />
      </mesh>
    </Effect>
  </Canvas>
)

export default Scene
