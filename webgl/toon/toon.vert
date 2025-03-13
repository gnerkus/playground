// position vector for each vertex
varying vec3 v_position;
// normal vector for each vector
varying vec3 v_normal;

varying vec2 vUv;

// ========= BUILT-IN UNIFORMS & ATTRIBUTES ==========================//
// Reference: https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
// = object.matrixWorld
// the model's position matrix
// The model's position matrix
// A transformation matrix that translates, scales and/or rotates the model to place it
// in the world at a location/orientation they belong to.
uniform mat4 modelMatrix;
// = camera.matrixWorldInverse * object.matrixWorld
uniform mat4 modelViewMatrix;
// = camera.projectionMatrix
uniform mat4 projectionMatrix;
// = camera.matrixWorldInverse
uniform mat4 viewMatrix;
// = inverse transpose of modelViewMatrix
uniform mat3 normalMatrix;
// = camera position in world space
uniform vec3 cameraPosition;

// default vertex attributes provided by BufferGeometry
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

void main() {
    vUv = uv;
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