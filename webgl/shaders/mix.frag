
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_firstColor;
uniform vec3 u_secondColor;
uniform float u_count;
uniform float u_index;

varying vec3 v_normal;

void main() {
    float mixFactorOne = u_index / u_count;
    float mixFactorTwo = (u_index + 1.0) / u_count;

    vec3 firstColor = mix(u_firstColor, u_secondColor, mixFactorOne);
    vec3 secondColor = mix(u_firstColor, u_secondColor, mixFactorTwo);

    gl_FragColor = vec4(mix(firstColor, secondColor, v_normal.x), 1.0);
}