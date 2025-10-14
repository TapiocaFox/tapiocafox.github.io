#version 300 es

// Author: TapiocaFox
// Title:  Colored Mesh

precision highp float;
uniform vec3 uColor;
in  vec3 vPos, vNor;
out vec4 fragColor;

void main() {
   vec3 nor = normalize(vNor);
   vec3 c = uColor * (.1 + max(0., dot(vec3(.5),nor)));
   fragColor = vec4(c, 1.);
}