/**
the more the vertex faces the camera, the more transparent it appears.

We'll need:
1. the vector of the vertex normal
2. the vector from the vertex position towards the camera
3. the angle between those vectors
*/

// = inverse transpose of modelViewMatrix
// attribute vec3 normal;
// attribute vec3 position;
// = camera position in world space
// uniform vec3 cameraPosition;
// camera's projection matrix
// uniform mat4 projectionMatrix;
// camera's modelview matrix
// uniform mat4 modelViewMatrix;

// These will be passed on to the fragment shader
varying vec3 v_normal;
varying float alpha;

varying vec3 v_toCamera;

void main() {
    //calculate the vertex position as expected in a perpective renderer
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // 1. the vector of the vertex normal
    v_normal = normal;
    // 2. the vector from the vertex position towards the camera
    v_toCamera = normalize(cameraPosition - normal);
    
    // 3. now find the dot poduct
    // faceing the camera is 1 and perpendicular is 0 so for this effect you want to minus it from 1
    // note that alpha is the varying float passed between the vertex and fragment shader
    alpha =  1.0 - dot(v_normal, v_toCamera);
}