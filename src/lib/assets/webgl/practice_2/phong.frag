#version 300 es

// Author: TapiocaFox
// Title:  Phong Reflection

precision highp float;

#define PI 3.1415926535897932384
#define MAX_SPHERES 64
#define MAX_LIGHTS 64

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

uniform int NS;
uniform int NL;
uniform vec4 uS[MAX_SPHERES],uSpecular[MAX_SPHERES];
uniform vec3 uViewPoint,uC[MAX_SPHERES],uL[MAX_LIGHTS],uLC[MAX_LIGHTS],uAmbient[MAX_LIGHTS],uDiffuse[MAX_LIGHTS];

vec2 raySphere(vec3 V, vec3 W, vec4 S) {
   V -= S.xyz;
   float b = dot(V, W);
   float d = b * b - dot(V, V) + S.w * S.w;
   if (d < 0.)
      return vec2(1001.,1000.);
   return vec2(-b - sqrt(d), -b + sqrt(d));
}

vec3 phong(vec3 N, vec3 L, vec3 W,vec3 diffuse, vec4 specular) {
    vec3 shade = vec3(0.);
    shade += diffuse * max(0., dot(L,N)); // Diffuse.
    vec3 reflection = 2.*N*dot(N,L)-L;
    shade += specular.xyz * pow(max(0., dot(-reflection, W)), specular.w); // Specular.
    return shade;
}

vec3 shadeSphere(vec4 S, vec3 P, vec3 W,vec3 ambient,vec3 diffuse,vec4 specular) {
   vec3 N = (P - S.xyz) / S.w;
   vec3 shade = ambient;
   for (int l = 0 ; l < NL ; l++)
      shade += uLC[l] * phong(N,uL[l],W,diffuse,specular);
   return shade;
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
             F = vec4(shadeSphere(uS[i], P, W,uAmbient[i],uDiffuse[i],uSpecular[i]), 1.);
        }
    }
    
    fragColor = vec4(sqrt(F.rgb), F.a);
    fragColor = mix(vec4(.0,.0,.0,1.),fragColor, F.a);
}