#version 300 es

// Author: TapiocaFox
// Title:  Default Vertex Shader

in  vec3 position;
out vec3 vPos;

void main() {
    gl_Position = vec4(position, 1.);
    vPos = position;
}