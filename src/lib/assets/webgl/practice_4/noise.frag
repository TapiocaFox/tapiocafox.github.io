#version 300 es

// Author: TapiocaFox
// Title:  Basic Noise

precision highp float;

#define PI 3.1415926535897932384

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

void main() {
   vec4 F = vec4(0.);
   float x = 2. * vPos.x;
   float y = 2. * vPos.y;
   float rr = x*x + y*y;
   if (rr < 1.) {
      float z = sqrt(1. - rr);
      float c = .1 + .5 * max(0., x+y+z);
      c *= .5 + noise(40. * vPos - vec3(uTime,0.,0.));
      F = vec4(c,c,c,1.);
   }
   fragColor = vec4(sqrt(F.rgb), F.a);
}