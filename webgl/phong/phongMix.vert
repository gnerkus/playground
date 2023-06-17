#ifdef GL_ES
precision mediump float;
#endif

varying vec3 normalInterp;
varying vec3 vertPos;

varying vec3 v_normal;

void main() {
    v_normal = normal;
    vec4 vertPos4 = modelViewMatrix * vec4(position, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = vec3(viewMatrix * vec4(normal, 0.0));
    gl_Position = projectionMatrix * vertPos4;
}