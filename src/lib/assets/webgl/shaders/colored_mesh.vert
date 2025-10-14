#version 300 es

// Author: TapiocaFox
// Title:  Colored Mesh

uniform mat4 uMF, uMI;
in  vec3 aPos, aNor;
out vec3 vPos, vNor;

void main() {
   vec4 pos = uMF * vec4(aPos, 1.);
   vec4 nor = vec4(aNor, 0.) * uMI;
   gl_Position = pos * vec4(1.,1.,-.1,1.);
   vPos = pos.xyz;
   vNor = nor.xyz;
}