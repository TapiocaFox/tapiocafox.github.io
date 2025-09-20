#version 300 es
precision highp float;
uniform float uTime;
uniform vec3 uViewPoint;

uniform vec4 uS[2];
uniform vec3 uC[2];

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

vec3 L1 = vec3(1.,1.,1.) / 1.732;
vec3 L2 = vec3(-1.,-1.,-.5) / 1.5;

vec3 shadeSphere(vec4 S, vec3 P, vec3 C) {
   vec3 N = (P - S.xyz) / S.w;
   return C * (.1 + max(0., dot(N, L1))
                  + max(0., dot(N, L2)));
}

void main() {
   vec4 F = vec4(0.);
   vec3 V = uViewPoint;
   vec3 W = normalize(vPos-V);
   float t = 100.;

   for (int i = 0 ; i < 2 ; i++) {
      vec2 tt = raySphere(V, W, uS[i]);
      if (tt.x < tt.y && tt.x > 0. && tt.x < t) {
         t = tt.x;
	 vec3 P = V + t * W;
         F = vec4(shadeSphere(uS[i],P,uC[i]),1.);
      }
   }

   fragColor = vec4(sqrt(F.rgb), F.a);
}