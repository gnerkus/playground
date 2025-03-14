// position vector for each vertex
varying vec3 v_position;
// normal vector for each vector
varying vec3 v_normal;

void main() {
    v_position = position;
    v_normal = normalize(normalMatrix * normal);

     /**
        Calculate final vertex position

        1. Add the w dimension to each vertex position with vec4()
        2. Multiply the vertex positions by the model-view and projection matrices to perform the following transformations:
            2.1 local space -> world space (model matrix)
            2.2 world space -> view space (view matrix: each coordinate is seen from camera's point of view)
            2.3 view space -> clip space (projection matrix: determines which vertices end up on the screen; adds perspective
    */
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // alternatively
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
}