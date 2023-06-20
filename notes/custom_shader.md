# Environment

## Color

- color: `new THREE.Color('#f0aed2').convertSRGBToLinear()`,

## Depth
### Depth 1
near: 0,
far: 300,
origin: [10, 10, 10],
colorA: new THREE.Color('blue').convertSRGBToLinear(),
colorB: new THREE.Color('#00aaff').convertSRGBToLinear(),
alpha: 0.5,
mode: 'multiply',
### Depth 2

## Uniforms

```js
const uniforms = {
    u_Color_1_color: new THREE.Color('#f0aed2').convertSRGBToLinear(),
    u_Color_1_alpha: 1,
}
```

### Shaders

_fragment_

```c
uniform vec3 u_color;
uniform float u_alpha;

void main() {
    return vec4(u_color, u_alpha);
}
```
