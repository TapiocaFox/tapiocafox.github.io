#version 300 es

// Author: TapiocaFox
// Title:  Reflective Spheres

in  vec3 position;
out vec3 vPos;

void main() {
    gl_Position = vec4(position, 1.);
    vPos = position;
}