const noiseEffect = {
  uniforms: {
    uTime: { value: null },
    tDiffuse: { value: null },
  },
  vertexShader: `
    varying vec2 vUv; 

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        vUv = uv; 
    }`,
  fragmentShader: `
    varying vec2 vUv; 
    uniform sampler2D tDiffuse;
    uniform float uTime; 


    float random( vec2 p ) {
      vec2 K1 = vec2(
          23.14069263277926, 
          2.665144142690225 
      );
    
      return fract(cos( dot(p,K1) ) * 12345.6789);
    }
    

    void main() { 
        vec4 color = texture2D(tDiffuse, vUv);

        vec2 uvRandom = vUv;
        uvRandom.y *= random(vec2(uvRandom.y,uTime * 0.1));
        
        color.rgb += random(uvRandom)*0.15;

        gl_FragColor = color; 
    }`,
}

export default noiseEffect
