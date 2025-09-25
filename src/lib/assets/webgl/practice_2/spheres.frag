#version 300 es

// Author: TapiocaFox
// Title:  Perlin Spheres

precision highp float;
uniform float uTime;
uniform vec3 uViewPoint;

#define MAX_SPHERES 64
#define MAX_LIGHTS 64

uniform int NS;
uniform int NL;
uniform vec4 uS[MAX_SPHERES];
uniform vec3 uC[MAX_SPHERES],uL[MAX_LIGHTS],uLC[MAX_LIGHTS];

in  vec3 vPos;
out vec4 fragColor;

vec2 raySphere(vec3 V, vec3 W, vec4 S) {
   V -= S.xyz;
   float b = dot(V, W);
   float d = b * b - dot(V, V) + S.w * S.w;
   if (d < 0.)
      return vec2(1001.,1000.);
   return vec2(-b - sqrt(d), -b + sqrt(d));
}

bool inShadow(vec3 P, vec3 L) {
   for (int i = 0 ; i < NS ; i++) {
      vec2 tt = raySphere(P, L, uS[i]);
      if (tt.x < tt.y && tt.x > 0.)
         return true;
   }
   return false;
}

vec3 shadeSphere(vec4 S, vec3 P, vec3 C) {
   vec3 N = (P - S.xyz) / S.w;

   vec3 shade = vec3(.1);

   // shade *= .5 + .5 * sin(20. * N.y);

   for (int l = 0 ; l < NL ; l++)
      if (! inShadow(P, uL[l]))
         shade += uLC[l] * max(0., dot(N, uL[l]));
   return C * shade;
}

void main() {
   vec4 F = vec4(0.);
   vec3 V = uViewPoint;
   vec3 W = normalize(vPos-V);
   float t = 100.;

   for (int i = 0 ; i < NS ; i++) {
      vec2 tt = raySphere(V, W, uS[i]);
      if (tt.x < tt.y && tt.x > 0. && tt.x < t) {
         t = tt.x;
	 vec3 P = V + t * W;
         F = vec4(shadeSphere(uS[i],P,uC[i]),1.);
      }
   }

   fragColor = vec4(sqrt(F.rgb), F.a);
   fragColor = mix(vec4(0.,0.,0.,1.),fragColor, F.a);
}