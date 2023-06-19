#ifdef GL_ES
precision mediump float;
#endif

varying float alpha;

void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}