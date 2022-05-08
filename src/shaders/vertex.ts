export const vertex = /* glsl */ `
    attribute vec3 aBary;
    
    varying vec3 vBary;
    varying vec2 vUv; 
    varying vec3 vNormal;

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        vNormal = normalize(normalMatrix * normal);
        vBary = aBary;
        vUv = uv;
    }
`
