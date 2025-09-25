const o=`#version 300 es

// Author: TapiocaFox
// Title: Mouse

precision highp float;

#define RADIUS_POINTER 0.033
#define GAP_GRID 0.1
#define SIZE_HALF_STROKE 0.005

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float point(vec2 st, vec2 center) {
    float dist = distance(st, center);
    return 1.-smoothstep(RADIUS_POINTER-.005, RADIUS_POINTER+.005, dist);
}

float grid(vec2 st) {
    vec2 mod_st = mod(st, GAP_GRID);
    vec2 pct_st = smoothstep(GAP_GRID-SIZE_HALF_STROKE, GAP_GRID, mod_st) + smoothstep(-SIZE_HALF_STROKE, 0., -mod_st);
    return max(pct_st.x, pct_st.y);
}

void main() {
    vec2 st = vPos.xy;
    vec2 stMouse = uMouse/uResolution.xy *2. - 1.;
    st.x *= uResolution.x/uResolution.y;
    stMouse.x *= uResolution.x/uResolution.y;

    vec3 colorPointer = vec3(0., 1., 0.);
    vec3 colorGrid = vec3(0.5, 0.5, 0.5);
    
	float pct = point(st, stMouse);
    float pctGrid = grid(st);
    
    vec3 color = mix(vec3(1.), colorGrid, pctGrid);
    color = mix(color, colorPointer, pct);
    fragColor = vec4(color,1.0);
}`;export{o as m};
