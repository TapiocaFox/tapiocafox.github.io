#version 300 es

// Author: TapiocaFox
// Title:  Default

#ifdef GL_ES
precision highp float;
#endif

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec3 stp = .5*vPos+.5;
    fragColor = vec4(stp, 1.);
}