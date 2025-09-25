#version 300 es

// Author: TapiocaFox
// Title: Sin

precision highp float;


#define PI 3.14159265358979
#define RATIO_SPEED .5

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float plot(vec2 st, float pct) {
    return smoothstep(pct-0.02, pct,st.y) - smoothstep(pct, pct+0.02,st.y);
    
}

void main() {
    vec2 st = vPos.xy;
    st.x *= uResolution.x/uResolution.y;

    vec2 st_mouse = uMouse / uResolution.xy * 2.0 - 1.0;
    st_mouse.x *= uResolution.x/uResolution.y;
    st.x -= st_mouse.x;
    
	float y = sin(PI*(st.x - uTime*RATIO_SPEED));
    
    float pct = plot(st, y);
    
    vec3 color = (1.0-pct)*y+pct*vec3(0.0, 1.0, 0.0);

    fragColor = vec4(color,1.0);
}