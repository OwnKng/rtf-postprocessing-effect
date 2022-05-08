const dataTexureEffect = {
  uniforms: {
    uDataTexture: { value: null },
    tDiffuse: { value: null },
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
        uniform sampler2D uDataTexture;
        varying vec2 vUv; 

        void main() {
            vec2 disruption = texture2D(uDataTexture, vUv).rg; 

            //_ color
            float r = texture2D(tDiffuse, vUv + 0.05 * disruption).r;
            vec2 gb = texture2D(tDiffuse, vUv + 0.04 * disruption).gb; 

            gl_FragColor = vec4(vec3(r, gb), 1.0); 
        }
    `,
}

export default dataTexureEffect
