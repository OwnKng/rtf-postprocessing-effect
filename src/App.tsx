import "./App.css"
import Sketch from "./Sketch"
import { Canvas } from "@react-three/fiber"
import PostProcessing from "./PostProcessing"

const App = () => (
  <div className='App'>
    <Canvas
      onCreated={(state) => state.gl.setClearColor("#08121C")}
      camera={{ position: [0, 5, -10] }}
    >
      <PostProcessing>
        <Sketch />
      </PostProcessing>
    </Canvas>
  </div>
)

export default App
