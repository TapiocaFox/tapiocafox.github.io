#version 300 es

// Author: TapiocaFox
// Title:  Lava Lamp

precision highp float;

#define PI 3.1415926535897932384
#define SCALE_RECIPROCAL .85
#define GRADIENT_START_BLOB .2
#define GRADIENT_END_BLOB 1.25
#define STRECH_Y_RECIPROCAL .9
#define CLIP_THRESHOLD .2
#define CLIP_HIGHLIGHT_THRESHOLD .21
#define SPEED_Y .6
#define SPEED_Z -.1
#define NUM_GRANULARITY 4
#define SCALE_DEGENERATE 1.5

#define GRADIENT_START_GLITTER 1.
#define GRADIENT_END_GLITTER -.25
#define SIZE_THRESHOULD_GLITTER .45
#define SIZE_FADE_IN_GLITTER .1
#define SCALE_RECIPROCAL_GLITTER_XY 80.
#define SCALE_RECIPROCAL_GLITTER_Z .25
#define SPEED_Y_GLITTER .2


in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

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

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float turbulence(vec3 P) {
   float f = 0., s = 1.;
   for (int i = 0 ; i < NUM_GRANULARITY ; i++) {
      float t = noise(s * P);
      f += abs(t) / s;
      s *= SCALE_DEGENERATE;
      P = vec3(.866*P.x + .5*P.z, P.y + 100., -.5*P.x + .866*P.z);
   }
   return f;
}

float glitter(vec3 P) {
    // float f = 0.;
    P.y -= .25 * .5 * (noise(.5*P)+1.);
    float g = smoothstep(SIZE_THRESHOULD_GLITTER,SIZE_THRESHOULD_GLITTER+SIZE_FADE_IN_GLITTER, noise(vec3(SCALE_RECIPROCAL_GLITTER_XY, SCALE_RECIPROCAL_GLITTER_XY, SCALE_RECIPROCAL_GLITTER_Z) * P));
    return g;
}

// vec3 colorBlob = vec3(.5, .5, 0.);
vec3 colorBlobStart = vec3(.8, .75, 0.);
vec3 colorBlobEnd = vec3(1., 0.35, 0.078);
vec3 colorBG = vec3(0.1, 0.1, 0.0);
vec3 colorGlitter = vec3(.0, 1., 1.);

void main() {
    float g = .5*(vPos.y+1.);
    float gb = (GRADIENT_END_BLOB-GRADIENT_START_BLOB)*g+GRADIENT_START_BLOB;
    float t = gb*turbulence(SCALE_RECIPROCAL*vec3(vPos.x, STRECH_Y_RECIPROCAL*vPos.y-SPEED_Y*uTime, -SPEED_Z*uTime));
    float clip = step(CLIP_THRESHOLD, t);
    float tc = clip*.5*(.5-t);
    vec3 colorBlob = mix(colorBlobStart, colorBlobEnd , g);
    colorBlob = mix(colorBlobEnd, colorBlob, .5*random(vec2(vPos.x, vPos.y-SPEED_Y*uTime))+.5);
    vec3 color = vec3(tc)+colorBlob*clip;
    color += (1.-clip)*colorBG;
    float gg = (GRADIENT_END_GLITTER-GRADIENT_START_GLITTER)*g+GRADIENT_START_GLITTER;
    color += (1.-clip)*colorGlitter*gg*glitter(vPos-vec3(0.,SPEED_Y_GLITTER*uTime, uTime));
    fragColor = vec4(color, 1.);
}