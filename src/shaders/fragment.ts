export const fragment = /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vBary;
    varying vec2 vUv; 

    void main() {
        float width = 2.0;
        vec3 d = fwidth(vBary);
        vec3 s = smoothstep(d*(width + 0.5), d*(width - 0.5), vBary);
        float line = max(s.x, max(s.y, s.z));

        if(line < 0.7) discard;
        gl_FragColor = vec4(vec3(line), 1.0);
    }
`
