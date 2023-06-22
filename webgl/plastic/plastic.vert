#ifdef GL_ES
precision mediump float;
#endif

varying vec3 v_Depth1_worldPosition;
varying vec3 v_Depth1_position;
varying vec3 v_Noise1_position;

void getDepth1() {
    v_Depth1_worldPosition = (vec4(position, 1.0) * modelMatrix).xyz;
    v_Depth1_position = position;
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
    getNoise1();

    gl_Position = projectionMatrix * modelViewMatrix * vec4(lamina_finalPosition, 1.0);
}