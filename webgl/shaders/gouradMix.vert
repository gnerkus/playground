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
    vec4 vertPos4 = modelViewMatrix * vec4(position, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = vec3(viewMatrix * vec4(normal, 0.0));
    gl_Position = projectionMatrix * vertPos4;

    vec3 N = normalize(normalInterp);
    vec3 L = normalize(u_lightPos - vertPos);

    // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);
    float specular = 0.0;
    if(lambertian > 0.0) {
        vec3 R = reflect(-L, N);      // Reflected light vector
        vec3 V = normalize(-vertPos); // Vector to viewer
    // Compute the specular term
        float specAngle = max(dot(R, V), 0.0);
        specular = pow(specAngle, u_shininess);
    }

    vec3 diffuseColor = mix(u_firstColor, u_secondColor, normal.x);

    v_color = vec4(u_ambientK * u_ambientColor +
        u_diffuseK * lambertian * diffuseColor +
        u_specularK * specular * u_specularColor, 1.0);
}