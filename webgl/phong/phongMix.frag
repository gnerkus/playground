#ifdef GL_ES
precision mediump float;
#endif

varying vec3 normalInterp;
varying vec3 vertPos;
varying vec3 v_normal;

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

void main() {
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

    vec3 diffuseColor = mix(u_firstColor, u_secondColor, v_normal.x);

    gl_FragColor = vec4(u_ambientK * u_ambientColor +
        u_diffuseK * lambertian * diffuseColor +
        u_specularK * specular * u_specularColor, 1.0);
}
