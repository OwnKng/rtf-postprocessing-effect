import { Vector2 } from "three"

const customEffect = {
  uniforms: {
    uDisruption: { value: 0 },
    tDiffuse: { value: null },
    tSize: { value: new Vector2(256, 256) },
    center: { value: new Vector2(0.5, 0.5) },
    angle: { value: 1.57 },
    scale: { value: 1.0 },
  },
  vertexShader: `
        varying vec2 vUv; 
        
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
            vUv = uv; 
        }
     `,
  fragmentShader: `
		uniform sampler2D tDiffuse;
        uniform float uDisruption;
        varying vec2 vUv; 

        void main() {
            float r = texture2D(tDiffuse, vUv + uDisruption).r;
            vec2 gb = texture2D(tDiffuse, vUv).gb;

            gl_FragColor = vec4(vec3(r, gb), 1.0); 
        }
    `,
}

export default customEffect
