#ifdef GL_ES
precision mediump float;
#endif

vec3 lamina_blend_alpha(const in vec3 x, const in vec3 y, const in float opacity) {
    return y * opacity + x * (1.0 - opacity);
}

vec4 lamina_blend_alpha(const in vec4 x, const in vec4 y, const in float opacity) {
    float a = min(y.a, opacity);
    return vec4(lamina_blend_alpha(x.rgb, y.rgb, a), x.a);
}

vec4 lamina_blend_multiply(const in vec4 x, const in vec4 y, const in float opacity) {
    return vec4(x.xyz * y.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}

float lamina_blend_softlight(const in float x, const in float y) {
    return (y < 0.5) ? (2.0 * x * y + x * x * (1.0 - 2.0 * y)) : (sqrt(x) * (2.0 * y - 1.0) + 2.0 * x * (1.0 - y));
}

vec4 lamina_blend_softlight(const in vec4 x, const in vec4 y, const in float opacity) {
    vec4 z = vec4(lamina_blend_softlight(x.r, y.r), lamina_blend_softlight(x.g, y.g), lamina_blend_softlight(x.b, y.b), lamina_blend_softlight(x.a, y.a));
    return vec4(z.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}

vec3 lamina_dist(vec3 x, vec3 y, vec3 z, bool manhattanDistance) {
    return manhattanDistance ? abs(x) + abs(y) + abs(z) : (x * x + y * y + z * z);
}

vec3 lamina_permute(vec3 x) {
    return mod((34.0 * x + 1.0) * x, 289.0);
}

// From: https://github.com/Erkaman/glsl-worley
float lamina_noise_worley(vec3 P) {
    float jitter = 1.;
    bool manhattanDistance = false;

    float K = 0.142857142857; // 1/7
    float Ko = 0.428571428571; // 1/2-K/2
    float K2 = 0.020408163265306; // 1/(7*7)
    float Kz = 0.166666666667; // 1/6
    float Kzo = 0.416666666667; // 1/2-1/6*2

    vec3 Pi = mod(floor(P), 289.0);
    vec3 Pf = fract(P) - 0.5;

    vec3 Pfx = Pf.x + vec3(1.0, 0.0, -1.0);
    vec3 Pfy = Pf.y + vec3(1.0, 0.0, -1.0);
    vec3 Pfz = Pf.z + vec3(1.0, 0.0, -1.0);

    vec3 p = lamina_permute(Pi.x + vec3(-1.0, 0.0, 1.0));
    vec3 p1 = lamina_permute(p + Pi.y - 1.0);
    vec3 p2 = lamina_permute(p + Pi.y);
    vec3 p3 = lamina_permute(p + Pi.y + 1.0);

    vec3 p11 = lamina_permute(p1 + Pi.z - 1.0);
    vec3 p12 = lamina_permute(p1 + Pi.z);
    vec3 p13 = lamina_permute(p1 + Pi.z + 1.0);

    vec3 p21 = lamina_permute(p2 + Pi.z - 1.0);
    vec3 p22 = lamina_permute(p2 + Pi.z);
    vec3 p23 = lamina_permute(p2 + Pi.z + 1.0);

    vec3 p31 = lamina_permute(p3 + Pi.z - 1.0);
    vec3 p32 = lamina_permute(p3 + Pi.z);
    vec3 p33 = lamina_permute(p3 + Pi.z + 1.0);

    vec3 ox11 = fract(p11 * K) - Ko;
    vec3 oy11 = mod(floor(p11 * K), 7.0) * K - Ko;
    vec3 oz11 = floor(p11 * K2) * Kz - Kzo; // p11 < 289 guaranteed

    vec3 ox12 = fract(p12 * K) - Ko;
    vec3 oy12 = mod(floor(p12 * K), 7.0) * K - Ko;
    vec3 oz12 = floor(p12 * K2) * Kz - Kzo;

    vec3 ox13 = fract(p13 * K) - Ko;
    vec3 oy13 = mod(floor(p13 * K), 7.0) * K - Ko;
    vec3 oz13 = floor(p13 * K2) * Kz - Kzo;

    vec3 ox21 = fract(p21 * K) - Ko;
    vec3 oy21 = mod(floor(p21 * K), 7.0) * K - Ko;
    vec3 oz21 = floor(p21 * K2) * Kz - Kzo;

    vec3 ox22 = fract(p22 * K) - Ko;
    vec3 oy22 = mod(floor(p22 * K), 7.0) * K - Ko;
    vec3 oz22 = floor(p22 * K2) * Kz - Kzo;

    vec3 ox23 = fract(p23 * K) - Ko;
    vec3 oy23 = mod(floor(p23 * K), 7.0) * K - Ko;
    vec3 oz23 = floor(p23 * K2) * Kz - Kzo;

    vec3 ox31 = fract(p31 * K) - Ko;
    vec3 oy31 = mod(floor(p31 * K), 7.0) * K - Ko;
    vec3 oz31 = floor(p31 * K2) * Kz - Kzo;

    vec3 ox32 = fract(p32 * K) - Ko;
    vec3 oy32 = mod(floor(p32 * K), 7.0) * K - Ko;
    vec3 oz32 = floor(p32 * K2) * Kz - Kzo;

    vec3 ox33 = fract(p33 * K) - Ko;
    vec3 oy33 = mod(floor(p33 * K), 7.0) * K - Ko;
    vec3 oz33 = floor(p33 * K2) * Kz - Kzo;

    vec3 dx11 = Pfx + jitter * ox11;
    vec3 dy11 = Pfy.x + jitter * oy11;
    vec3 dz11 = Pfz.x + jitter * oz11;

    vec3 dx12 = Pfx + jitter * ox12;
    vec3 dy12 = Pfy.x + jitter * oy12;
    vec3 dz12 = Pfz.y + jitter * oz12;

    vec3 dx13 = Pfx + jitter * ox13;
    vec3 dy13 = Pfy.x + jitter * oy13;
    vec3 dz13 = Pfz.z + jitter * oz13;

    vec3 dx21 = Pfx + jitter * ox21;
    vec3 dy21 = Pfy.y + jitter * oy21;
    vec3 dz21 = Pfz.x + jitter * oz21;

    vec3 dx22 = Pfx + jitter * ox22;
    vec3 dy22 = Pfy.y + jitter * oy22;
    vec3 dz22 = Pfz.y + jitter * oz22;

    vec3 dx23 = Pfx + jitter * ox23;
    vec3 dy23 = Pfy.y + jitter * oy23;
    vec3 dz23 = Pfz.z + jitter * oz23;

    vec3 dx31 = Pfx + jitter * ox31;
    vec3 dy31 = Pfy.z + jitter * oy31;
    vec3 dz31 = Pfz.x + jitter * oz31;

    vec3 dx32 = Pfx + jitter * ox32;
    vec3 dy32 = Pfy.z + jitter * oy32;
    vec3 dz32 = Pfz.y + jitter * oz32;

    vec3 dx33 = Pfx + jitter * ox33;
    vec3 dy33 = Pfy.z + jitter * oy33;
    vec3 dz33 = Pfz.z + jitter * oz33;

    vec3 d11 = lamina_dist(dx11, dy11, dz11, manhattanDistance);
    vec3 d12 = lamina_dist(dx12, dy12, dz12, manhattanDistance);
    vec3 d13 = lamina_dist(dx13, dy13, dz13, manhattanDistance);
    vec3 d21 = lamina_dist(dx21, dy21, dz21, manhattanDistance);
    vec3 d22 = lamina_dist(dx22, dy22, dz22, manhattanDistance);
    vec3 d23 = lamina_dist(dx23, dy23, dz23, manhattanDistance);
    vec3 d31 = lamina_dist(dx31, dy31, dz31, manhattanDistance);
    vec3 d32 = lamina_dist(dx32, dy32, dz32, manhattanDistance);
    vec3 d33 = lamina_dist(dx33, dy33, dz33, manhattanDistance);

    vec3 d1a = min(d11, d12);
    d12 = max(d11, d12);
    d11 = min(d1a, d13); // Smallest now not in d12 or d13
    d13 = max(d1a, d13);
    d12 = min(d12, d13); // 2nd smallest now not in d13
    vec3 d2a = min(d21, d22);
    d22 = max(d21, d22);
    d21 = min(d2a, d23); // Smallest now not in d22 or d23
    d23 = max(d2a, d23);
    d22 = min(d22, d23); // 2nd smallest now not in d23
    vec3 d3a = min(d31, d32);
    d32 = max(d31, d32);
    d31 = min(d3a, d33); // Smallest now not in d32 or d33
    d33 = max(d3a, d33);
    d32 = min(d32, d33); // 2nd smallest now not in d33
    vec3 da = min(d11, d21);
    d21 = max(d11, d21);
    d11 = min(da, d31); // Smallest now in d11
    d31 = max(da, d31); // 2nd smallest now not in d31
    d11.xy = (d11.x < d11.y) ? d11.xy : d11.yx;
    d11.xz = (d11.x < d11.z) ? d11.xz : d11.zx; // d11.x now smallest
    d12 = min(d12, d21); // 2nd smallest now not in d21
    d12 = min(d12, d22); // nor in d22
    d12 = min(d12, d31); // nor in d31
    d12 = min(d12, d32); // nor in d32
    d11.yz = min(d11.yz, d12.xy); // nor in d12.yz
    d11.y = min(d11.y, d12.z); // Only two more to go
    d11.y = min(d11.y, d11.z); // Done! (Phew!)

    vec2 F = sqrt(d11.xy);
    return F.x; // F1, F2

}

uniform vec3 u_lamina_color;
uniform float u_lamina_alpha;

uniform vec3 u_Color1_color;
uniform float u_Color1_alpha;

uniform float u_Depth1_alpha;
uniform float u_Depth1_near;
uniform float u_Depth1_far;
uniform vec3 u_Depth1_origin;
uniform vec3 u_Depth1_colorA;
uniform vec3 u_Depth1_colorB;

varying vec3 v_Depth1_worldPosition;
varying vec3 v_Depth1_position;

uniform vec3 u_Noise1_offset;
uniform float u_Noise1_scale;

uniform vec3 u_Noise1_colorA;
uniform vec3 u_Noise1_colorB;
uniform vec3 u_Noise1_colorC;
uniform vec3 u_Noise1_colorD;

uniform float u_Noise1_alpha;

varying vec3 v_Noise1_position;

vec4 getColor1(vec4 finalColor) {
    vec4 outputColor = vec4(u_Color1_color, u_Color1_alpha);
    // blend for normal mode
    return lamina_blend_alpha(outputColor, finalColor, finalColor.a);
}

vec4 getDepth1(vec4 finalColor) {
    // default mapping, vector
    float f_dist = length(v_Depth1_worldPosition - u_Depth1_origin);
    float f_depth = (f_dist - u_Depth1_near) / (u_Depth1_far - u_Depth1_near);
    vec3 f_depthColor = mix(u_Depth1_colorB, u_Depth1_colorA, 1.0 - clamp(f_depth, 0., 1.));

    vec4 outputColor = vec4(f_depthColor, u_Depth1_alpha);

    return lamina_blend_multiply(outputColor, finalColor, finalColor.a);
}

vec4 getNoise1(vec4 finalColor) {
    float f_n = lamina_noise_worley((v_Noise1_position - u_Noise1_offset) - u_Noise1_scale);

    float f_step1 = 0.;
    float f_step2 = 0.2;
    float f_step3 = 0.6;
    float f_step4 = 1.;

    vec3 outputMix = mix(u_Noise1_colorA, u_Noise1_colorB, smoothstep(f_step1, f_step2, f_n));
    outputMix = mix(outputMix, u_Noise1_colorC, smoothstep(f_step2, f_step3, f_n));
    outputMix = mix(outputMix, u_Noise1_colorD, smoothstep(f_step3, f_step4, f_n));
    vec4 outputColor = vec4(outputMix, u_Noise1_alpha);

    return lamina_blend_softlight(outputColor, finalColor, finalColor.a);
}

void main() {
    vec4 lamina_finalColor = vec4(u_lamina_color, u_lamina_alpha);

    // Color1
    lamina_finalColor = getColor1(lamina_finalColor);
    // Depth 1
    lamina_finalColor = getDepth1(lamina_finalColor);
    // Noise 1
    lamina_finalColor = getNoise1(lamina_finalColor);

    gl_FragColor = lamina_finalColor;
}