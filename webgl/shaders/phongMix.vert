attribute vec3 position;
attribute vec3 normal;

attribute mat4 modelViewMatrix;
attribute mat4 projectionMatrix;
attribute mat4 modelMatrix;
attribute mat4 viewMatrix;
attribute mat3 normalMatrix;

varying vec3 normalInterp;
varying vec3 vertPos;

uniform float u_ambientK;   // Ambient reflection coefficient
uniform float u_diffuseK;   // Diffuse reflection coefficient
uniform float u_specularK;   // Specular reflection coefficient
uniform float u_shininess; // Shininess
// Material color
uniform vec3 u_ambientColor;
// mix the first and second colors to get the diffuse color
uniform vec3 u_specularColor;
uniform vec3 u_lightPos; // Light position
uniform vec3 u_firstColor;
uniform vec3 u_secondColor;

varying vec4 v_color; //color

void main() {
    //calculate the vertex position as expected in a perpective renderer
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // 1. the vector of the vertex normal
}