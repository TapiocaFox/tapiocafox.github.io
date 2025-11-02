const n=`#version 300 es

// Author: TapiocaFox
// Title:  Forest

precision highp float;

#define PI 3.1415926535897932384
#define SIZE_HALF_STROKE 0.015
#define NUM_GRANULARITY 4
#define NUM_LAYERS 4
#define Y_LAYERS_TOP .0
#define Y_LAYERS_BOTTOM -.8
#define SIZE_LAYERS_GAP (Y_LAYERS_TOP-Y_LAYERS_BOTTOM)/float(NUM_LAYERS-1)
#define SCALE_DEGENERATE 2.

#define SIZE_THRESHOULD_GLITTER .5
#define SIZE_FADE_IN_GLITTER .1
#define SCALE_RECIPROCAL_GLITTER_XY 80.
#define SCALE_RECIPROCAL_GLITTER_Z .25
#define SPEED_GLITTER .05

#define SPEED_MOUNTAIN .05

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

vec4 colorMtGradientTop = vec4(173./256., 206./256., 236./256., 1.);
vec4 colorMtGradientBottom = vec4(17./256., 46./256., 86./256., 1.);
vec4 colorBGGradientTop = vec4(92./256.,142./256.,203./256.,1.);
vec4 colorBGGradientBottom = vec4(148./256.,0./256.,0./256.,1.);

vec3 colorGlitter = vec3(218./256.,227./256.,239./256.);

// Noise snippet from Prof. Perlin.
vec3  _s(vec3 i) { return cos(5.*(i+5.*cos(5.*(i.yzx+5.*cos(5.*(i.zxy+5.*cos(5.*i))))))); }
float _t(vec3 i, vec3 u, vec3 a) { return dot(normalize(_s(i + a)), u - a); }
float noise(vec3 p) {
   vec3 i = floor(p), u = p - i, v = 2.*mix(u*u, u*(2.-u)-.5, step(.5,u));
   return mix(mix(mix(_t(i, u, vec3(0.,0.,0.)), _t(i, u, vec3(1.,0.,0.)), v.x),
                  mix(_t(i, u, vec3(0.,1.,0.)), _t(i, u, vec3(1.,1.,0.)), v.x), v.y),
              mix(mix(_t(i, u, vec3(0.,0.,1.)), _t(i, u, vec3(1.,0.,1.)), v.x),
                  mix(_t(i, u, vec3(0.,1.,1.)), _t(i, u, vec3(1.,1.,1.)), v.x), v.y), v.z);
}

// 2D Noise snippet (based on Prof. Perlin's style)
vec2  _s2d(vec2 i) { 
    return cos(5. * (i + 5. * cos(5. * (i.yx + 5. * cos(5. * i))))); 
}
float _t2d(vec2 i, vec2 u, vec2 a) { 
    return dot(normalize(_s2d(i + a)), u - a); 
}
float noise_2d(vec2 p) {
    vec2 i = floor(p);
    vec2 u = p - i;
    vec2 v = 2. * mix(u * u, u * (2. - u) - .5, step(vec2(.5), u));

    return mix(
        mix(_t2d(i, u, vec2(0., 0.)), _t2d(i, u, vec2(1., 0.)), v.x),
        mix(_t2d(i, u, vec2(0., 1.)), _t2d(i, u, vec2(1., 1.)), v.x),
        v.y
    );
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float terrain(vec2 P) {
   float f = 0., s = 1.;
   for (int i = 0 ; i < NUM_GRANULARITY ; i++) {
      float t = noise_2d(s * P);
      f += abs(t) / s;
      s *= SCALE_DEGENERATE;
      P = vec2(.866*P.x + .5*P.y, -.5*P.x + .866*P.y);
   }
   return f;
}

vec4 plot_terrain(vec3 stp, float y_at_x) {
    vec4 result = (.25*random(stp.xy)+.75)*(1.-smoothstep(y_at_x-SIZE_HALF_STROKE, y_at_x, stp.y))*mix(colorMtGradientBottom, colorMtGradientTop, (stp.y+1.)/(y_at_x+1.));
    return result;
}

float glitter(vec3 P) {
    P.y -= .25 * .5 * (noise(.5*P)+1.);
    float g = smoothstep(SIZE_THRESHOULD_GLITTER,SIZE_THRESHOULD_GLITTER+SIZE_FADE_IN_GLITTER, noise(vec3(SCALE_RECIPROCAL_GLITTER_XY, SCALE_RECIPROCAL_GLITTER_XY, SCALE_RECIPROCAL_GLITTER_Z) * P));
    return g;
}

void main() {
    vec4 color_terrain = mix(colorBGGradientBottom, colorBGGradientTop, (vPos.y+1.)/2.);
    color_terrain.xyz = mix(color_terrain.xyz, colorGlitter, glitter(vPos-vec3(SPEED_GLITTER*uTime,SPEED_GLITTER*uTime, uTime)));
    color_terrain.xyz = mix(color_terrain.xyz, colorGlitter, glitter(vPos-vec3(-SPEED_GLITTER*uTime,SPEED_GLITTER*uTime, 20.+uTime)));
    for(int i=0;i<NUM_LAYERS;i++) {
        float pos = Y_LAYERS_TOP-float(i)*SIZE_LAYERS_GAP;
        vec4 my_terrain = plot_terrain(vPos, .75*terrain(vec2(vPos.x+SPEED_MOUNTAIN*float(i+1)*(uTime-2.*uMouse.x/uResolution.x),100.*float(i)))+pos);
        color_terrain = mix(color_terrain, my_terrain, my_terrain.w);
    }
    fragColor = color_terrain;
    
}`;export{n as f};
