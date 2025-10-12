#version 300 es

// Author: TapiocaFox
// Title:  Simple Mesh

precision highp float;

in  vec3 vPos, vNor;
out vec4 fragColor;

void main() {
   fragColor = vec4(vPos, 1.);
}