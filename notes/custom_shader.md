# Final shader
## Uniforms

```js
const uniforms = {
    u_lamina_color: new THREE.Color('white').convertSRGBToLinear(),
    u_lamina_alpha: 1,
    u_Color1_color: new THREE.Color('#f0aed2').convertSRGBToLinear(),
    u_Color1_alpha: 1,
    u_Depth1_alpha: 0.5,
    u_Depth1_near: 0,
    u_Depth1_far: 300,
    u_Depth1_origin: new THREE.Vector3(10, 10, 10),
    u_Depth1_colorA: new THREE.Color('blue').convertSRGBToLinear(),
    u_Depth1_colorB: new THREE.Color('#00aaff').convertSRGBToLinear(),
    u_Depth2_alpha: 0.5,
    u_Depth2_near: 0,
    u_Depth2_far: 300,
    u_Depth2_origin: new THREE.Vector3(100, 100, 100),
    u_Depth2_colorA: new THREE.Color('#ff0000').convertSRGBToLinear(),
    u_Depth2_colorB: new THREE.Color('#00aaff').convertSRGBToLinear(),
    u_Noise1_offset: new THREE.Vector3(0, 0, 0),
    u_Noise1_scale: 0.5,
    u_Noise1_colorA: new THREE.Color('#666666').convertSRGBToLinear(),
    u_Noise1_colorB: new THREE.Color('#666666').convertSRGBToLinear(),
    u_Noise1_colorC: new THREE.Color('#ffffff').convertSRGBToLinear(),
    u_Noise1_colorD: new THREE.Color('#ffffff').convertSRGBToLinear(),
    u_Noise1_alpha: 1,
}
```
## Vert
```c
varying vec3 v_Depth1_worldPosition;
varying vec3 v_Depth1_position;
varying vec3 v_Depth2_worldPosition;
varying vec3 v_Depth2_position;
varying vec3 v_Noise1_position;

void getDepth1() {
    v_Depth1_worldPosition = (vec4(position, 1.0) * modelMatrix).xyz;
    v_Depth1_position = position;
}

void getDepth2() {
    v_Depth2_worldPosition = (vec4(position, 1.0) * modelMatrix).xyz;
    v_Depth2_position = position;
}

void getNoise1() {
    v_Noise1_position = position;
}

// fill in the HelpersChunk and NoiseChunk
void main() {
    vec3 lamina_finalPosition = position;
    vec3 lamina_finalNormal = normal;

    // Depth 1
    getDepth1();
    getDepth2();
    getNoise1();

    gl_Position = projectionMatrix * modelViewMatrix * vec4(lamina_finalPosition, 1.0);
}
```

## Frag
```c
// fill in the HelpersChunk, NoiseChunk and BlendModesChunk
uniform vec3 u_lamina_color;
uniform float u_lamina_alpha;

uniform vec3 u_Color1_color;
uniform float u_Color1_alpha;

uniform float u_Depth1_alpha;
uniform float u_Depth1_near;
uniform float u_Depth1_far;
uniform vec3 u_Depth1_origin;
uniform vec3 u_Depth1_colorA;
uniform vec3 u_Depth1_colorB;

varying vec3 v_Depth1_worldPosition;
varying vec3 v_Depth1_position;

uniform float u_Depth2_alpha;
uniform float u_Depth2_near;
uniform float u_Depth2_far;
uniform vec3 u_Depth2_origin;
uniform vec3 u_Depth2_colorA;
uniform vec3 u_Depth2_colorB;

uniform vec3 u_Noise1_offset;
uniform float u_Noise1_scale;

uniform vec3 u_Depth1_colorA;
uniform vec3 u_Depth1_colorB;
uniform vec3 u_Depth1_colorC;
uniform vec3 u_Depth1_colorD;

uniform float u_Noise1_alpha;

varying vec3 v_Depth2_worldPosition;
varying vec3 v_Depth2_position;

varying vec3 v_Noise1_position;

vec4 getColor1(vec4 finalColor) {
    vec4 output = vec4(u_Color_1_color, u_Color_1_alpha);
    // blend for normal mode
    return lamina_blend_alpha(output, finalColor, finalColor.a);
}

vec4 getDepth1(vec4 finalColor) {
    // default mapping, vector
    float f_dist = length(v_Depth1_worldPosition - u_Depth1_origin);
    float f_depth = (f_dist - u_Depth1_near) / (u_Depth1_far - u_Depth1_near);
    vec3 f_depthColor = mix(u_Depth1_colorB, u_Depth1_colorA, 1.0 - clamp(f_depth, 0., 1.));

    vec4 output = vec4(f_depthColor, u_Depth1_alpha);

    return lamina_blend_multiply(output, finalColor, finalColor.a);
}

vec4 getDepth2(vec4 finalColor) {
    // default mapping, vector
    float f_dist = length(v_Depth2_worldPosition - u_Depth2_origin);
    float f_depth = (f_dist - u_Depth2_near) / (u_Depth2_far - u_Depth2_near);
    vec3 f_depthColor = mix(u_Depth2_colorB, u_Depth2_colorA, 1.0 - clamp(f_depth, 0., 1.));

    vec4 output = vec4(f_depthColor, u_Depth2_alpha);

    return lamina_blend_multiply(output, finalColor, finalColor.a);
}

vec4 getNoise1(vec4 finalColor) {
    float f_n = lamina_noise_worley((v_Noise1_position - u_Noise1_offset) - u_Noise1_scale);

    float f_step1 = 0.;
    float f_step2 = 0.2;
    float f_step3 = 0.6;
    float f_step4 = 1.;

    vec3 output = mix(u_Noise1_colorA, u_Noise1_colorB, smoothstep(f_step1, f_step2, f_n));
    output = mix(output, u_Noise1_colorC, smoothstep(f_step2, f_step3, f_n));
    output = mix(output, u_Noise1_colorD, smoothstep(f_step3, f_step4, f_n));

    return lamina_blend_softlight(output, finalColor, u_Noise1_alpha);
}

void main() {
    vec4 lamina_finalColor = vec4(u_lamina_color, u_lamina_alpha);

    // Color1
    lamina_finalColor = getColor1(lamina_finalColor);
    // Depth 1
    lamina_finalColor = getDepth1(lamina_finalColor);
    // Depth 2
    lamina_finalColor = getDepth2(lamina_finalColor);
    // Noise 1
    lamina_finalColor = getNoise1(lamina_finalColor);

    gl_FragColor = lamina_finalColor;
}
```