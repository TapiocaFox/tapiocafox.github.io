#version 300 es

// Author: Ken Perlin
// Title:  Quadric Surface (System)

#define SIZE_VOLUME_GRID 0.1

precision highp float;
uniform float uTime;
uniform vec3 uViewPoint;
uniform mat4 uQ[3];

in  vec3 vPos;
out vec4 fragColor;

vec3 firstGridColor = vec3(1.,1.,1.);
vec3 secondGridColor = vec3(.95,.95,.95);

vec3 light = normalize(vec3(1.,1.,1.));
vec3 lightColor = vec3(.9,.9,1.);
vec3 light2 = normalize(vec3(-1.,-1.,0.));
vec3 lightColor2 = vec3(1.,.6,.6);
vec4 sepcular = vec4(1.,1.,1.,20.);

vec3 rayEq(vec3 V, vec3 W, mat4 Q) {

   float A = Q[0].x, B = Q[1].x+Q[0].y, C = Q[2].x+Q[0].z, D = Q[3].x+Q[0].w,
                     E = Q[1].y       , F = Q[2].y+Q[1].z, G = Q[3].y+Q[1].w,
                                        H = Q[2].z       , I = Q[3].z+Q[2].w,
                                                           J = Q[3].w       ;

   float a = A * W.x * W.x +
             B * W.x * W.y +
             C * W.z * W.x +
             E * W.y * W.y +
             F * W.y * W.z +
             H * W.z * W.z ;

   float b = 2. * A * V.x * W.x +
                  B * (W.x * V.y + V.y * W.x) +
                  C * (V.z * W.x + V.x * W.z) +
                  D * W.x +
             2. * E * V.y * W.y +
                  F * (V.y * W.z + V.z * W.y) +
                  G * W.y +
             2. * H * V.z * W.z +
                  I * W.z;

   float c = A * V.x * V.x +
             B * V.x * V.y +
             C * V.z * V.x +
             D * V.x       +
             E * V.y * V.y +
             F * V.y * V.z +
             G * V.y       +
             H * V.z * V.z +
             I * V.z       +
             J;

   return vec3(a,b,c);
}

vec2 findRoots(vec3 eq) {
    float a = eq.x, b = eq.y, c = eq.z;
    vec2 t = vec2(-1.);
    float discr = b * b - 4. * a * c;
    if (discr >= 0.)
        t = vec2(-b - sqrt(discr), -b + sqrt(discr)) / (2. * a);
    return t;
}

vec3 normalQ(mat4 Q, vec3 P) {
   float A = Q[0].x, B = Q[1].x+Q[0].y, C = Q[2].x+Q[0].z, D = Q[3].x+Q[0].w,
                     E = Q[1].y       , F = Q[2].y+Q[1].z, G = Q[3].y+Q[1].w,
                                        H = Q[2].z       , I = Q[3].z+Q[2].w,
                                                           J = Q[3].w       ;

   return normalize(vec3(2. * A * P.x + C * P.z + B * P.y + D,
                         2. * E * P.y + F * P.z + B * P.x + G,
                         2. * H * P.z + F * P.y + C * P.x + I));
}

vec3 phong(vec3 N, vec3 L, vec3 W,vec3 diffuse, vec4 specular) {
    vec3 shade = vec3(0.);
    shade += diffuse * max(0., dot(L,N)); // Diffuse.
    vec3 reflection = 2.*N*dot(N,L)-L;
    shade += specular.xyz * pow(max(0., dot(-reflection, W)), specular.w); // Specular.
    return shade;
}

vec3 colorAtPoint(vec3 P) {
    int zeroOrOne = int(mod(floor(P.x/SIZE_VOLUME_GRID)+floor(P.y/SIZE_VOLUME_GRID)+floor(P.z/SIZE_VOLUME_GRID), 2.));
    return (zeroOrOne==0)?firstGridColor:secondGridColor;
}

void main() {
    fragColor = vec4(0.);
    
    vec3 V = uViewPoint;
    vec3 W = normalize(vPos-V);
    
    vec3 color1 = vec3(0.);
    vec2 tI1 = vec2(-1.,1000.);
    for (int i = 0 ; i < 3 ; i++) {
        vec2 tQ = findRoots(rayEq(V, W, uQ[i]));
        if (tQ.x > tI1.x) {
            vec3 P = V + tQ.x * W;
            vec3 PC = colorAtPoint(P);
            vec3 N = normalQ(uQ[i], P);
            // color1 = vec3(.025 + PC*max(0., dot(N, light)));
            // color1 = phong(N,light,W,PC,sepcular);
            color1 = lightColor*phong(N,light,W,PC,vec4(mix(PC,vec3(1.),.1), 20.));
            color1 += lightColor2*phong(N,light2,W,PC,vec4(mix(PC,vec3(1.),.1), 20.));
            tI1.x = tQ.x;
        }
        if (tQ.y < tI1.y)
            tI1.y = tQ.y;
    }
    
    if (tI1.x > 0. && tI1.x < tI1.y)
        fragColor = vec4(sqrt(color1), 1.);
    // else
    //     fragColor = vec4(0.0,0.0,0.,1.);
/*
   vec3 color2 = vec3(0.);
   vec2 tI2 = vec2(-1.,1000.);
   for (int i = 3 ; i < 6 ; i++) {
      vec2 tQ = findRoots(rayEq(V, W, uQ[i]));
      if (tQ.x > tI2.x) {
         vec3 N = normalQ(uQ[i], V + tQ.x * W);
         color2 = vec3(.1 + max(0., dot(N, vec3(.5))));
	 tI2.x = tQ.x;
      }
      if (tQ.y < tI2.y)
         tI2.y = tQ.y;
   }


   if (tI2.x > 0. && tI2.x < tI2.y && tI2.x < tI1.x)
      fragColor = vec4(sqrt(color2), 1.);
*/
}