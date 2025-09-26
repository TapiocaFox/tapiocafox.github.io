#version 300 es

// Author: TapiocaFox
// Title: Fiber

precision highp float;

#define PI 3.14159265358979
#define GAP 0.1
#define SIZE_HALF_STROKE 0.02
#define DEG_ROTATION 0.2
#define RATIO_TIME 0.66

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float calc_background(vec2 st) {
    vec2 stMod = mod(st, GAP);
    vec2 pctSt = smoothstep(GAP-SIZE_HALF_STROKE, GAP, stMod) + smoothstep(-SIZE_HALF_STROKE, 0., -stMod);
    return max(pctSt.x, pctSt.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy*2.-1.;
    st.x *= uResolution.x/uResolution.y;

    vec2 stMouse = uMouse / uResolution.xy * 2. - 1.;
    stMouse.x *= uResolution.x/uResolution.y;
    
    mat2 rot;
    rot[0] = vec2(cos(DEG_ROTATION), -sin(DEG_ROTATION));    
    rot[1] = vec2(sin(DEG_ROTATION), cos(DEG_ROTATION));
    
    st = st*rot;
    st -= .5*stMouse;
	
    st.x -= sin(3.*st.x-.5*PI*RATIO_TIME*uTime);      
    st.x -= sin(3.*st.y-.5*PI*RATIO_TIME*uTime);    
    st.y -= sin(3.*st.y+.5*PI*RATIO_TIME*uTime);
    st.y -= sin(3.*st.x+.5*PI*RATIO_TIME*uTime);
    
    vec3 color = vec3(0.);
    color = vec3(abs(.25*sin(st.x+.95*PI*RATIO_TIME*uTime)+.75),abs(.25*sin(st.y+.75*PI*RATIO_TIME*uTime)+.75),abs(.25*sin(.5*PI*RATIO_TIME*uTime)+.75));
    
    float pct = calc_background(st);
    
    color = mix(vec3(0.), color, pct);

    fragColor = vec4(color,1.0);
}