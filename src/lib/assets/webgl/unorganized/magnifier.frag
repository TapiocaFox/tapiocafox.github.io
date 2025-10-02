#version 300 es

// Author: TapiocaFox
// Title: Bump Magnifier Distortion

precision highp float;

#define RADIUS_POINTER 0.033
#define GAP_GRID 0.1
#define SIZE_HALF_STROKE 0.005
#define SIZE_BUMP_RADIUS 0.35
#define SIZE_BUMP_HEIGHT .1
#define SIZE_BUMP_HEIGHT_R .08
#define SIZE_BUMP_HEIGHT_G .1
#define SIZE_BUMP_HEIGHT_B .12

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float bump_derivative(float x) {
    float x_sqr_minus_one = min(x*x-1.,-.001); // min to prevent divided by zero.
    // float x_sqr_minus_one = x*x-1.; // min to prevent divide by zero.
    return step(-1.,-abs(x))*-2.*x*exp(1./x_sqr_minus_one)/(x_sqr_minus_one*x_sqr_minus_one);
}

float point(vec2 st, vec2 center) {
    float dist = distance(st, center);
    return 1.-smoothstep(RADIUS_POINTER-.005, RADIUS_POINTER+.005, dist);
}

float grid(vec2 st) {
    vec2 mod_st = mod(st, GAP_GRID);
    vec2 pct_st = smoothstep(GAP_GRID-SIZE_HALF_STROKE, GAP_GRID, mod_st) + smoothstep(-SIZE_HALF_STROKE, 0., -mod_st);
    return max(pct_st.x, pct_st.y);
}

vec2 magnify(vec2 st, vec2 center, float height, float radius) { // Magnifier distortion.
    float dist = distance(st, center);
    float derivative = bump_derivative(dist/radius);
    vec2 direction = normalize(st-center);
    return st+height*derivative*direction;
}

void main() {
    vec2 st = vPos.xy;
    vec2 stMouse = uMouse/uResolution.xy *2. - 1.;
    st.x *= uResolution.x/uResolution.y;
    stMouse.x *= uResolution.x/uResolution.y;

    vec2 stMagnifiedR = magnify(st, stMouse, SIZE_BUMP_HEIGHT_R, SIZE_BUMP_RADIUS);
    vec2 stMagnifiedG = magnify(st, stMouse, SIZE_BUMP_HEIGHT_G, SIZE_BUMP_RADIUS);
    vec2 stMagnifiedB = magnify(st, stMouse, SIZE_BUMP_HEIGHT_B, SIZE_BUMP_RADIUS);

    vec3 colorPointer = vec3(0., 1., 0.);
    vec3 colorGrid = vec3(0.5, 0.5, 0.5);
    // vec3 colorGrid = vec3(0.0, 0.0, 0.0);
    
	float pct = point(st, stMouse);
    float pctGridR = grid(stMagnifiedR);
    float pctGridG = grid(stMagnifiedG);
    float pctGridB = grid(stMagnifiedB);

    float dist = distance(st, stMouse);
    
    vec3 color = vec3(mix(1., colorGrid.x, pctGridR), mix(1., colorGrid.y, pctGridG), mix(1., colorGrid.z, pctGridB));
    color = mix(color, colorPointer, pct);
    fragColor = vec4(color,1.0);
}