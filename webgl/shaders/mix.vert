varying vec3 v_normal;

void main() {
    //calculate the vertex position as expected in a perpective renderer
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // 1. the vector of the vertex normal
    v_normal = normal;
}