#version 300 es

// Author: TapiocaFox
// Title: Default

#ifdef GL_ES
precision highp float;
#endif

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;    
    vec3 color = vec3(0.);
    color = vec3(st.x,st.y,abs(sin(u_time)));

    fragColor = vec4(color,1.0);
}