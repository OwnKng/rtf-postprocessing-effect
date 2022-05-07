export const fragment = `
    uniform sampler2D uTexture; 
    uniform sampler2D uDataTexture; 
    varying vec2 vUv; 

    void main() {
        vec2 distortion = texture2D(uDataTexture, vUv).rg; 
        
        float r = texture2D(uTexture, vUv + 0.02 * distortion).r;  
        vec2 gb = texture2D(uTexture, vUv - 0.02 * distortion).gb;  

        gl_FragColor = vec4(r, gb, 1.0); 
    }
`
