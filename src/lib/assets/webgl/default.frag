#version 300 es

// Author: TapiocaFox
// Title:  Default

#ifdef GL_ES
precision highp float;
#endif

#define PI 3.1415926535897932384
#define half_stroke 0.015

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot_xy(vec3 stp, float y_at_x) {
    return smoothstep(y_at_x-half_stroke, y_at_x, stp.y) - smoothstep(y_at_x, y_at_x+half_stroke, stp.y);
}

void main() {
    float pct = plot_xy(vPos, sin(PI*(vPos.x-.5*u_time)));
    vec3 color = vec3(.5*vPos.x+.5, .5*vPos.y+.5, .5*sin(.5*PI*(-u_time))+.5);
    color = mix(color, vec3(1.), pct);
    fragColor = vec4(color, 1.);
}