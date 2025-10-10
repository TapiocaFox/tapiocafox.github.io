#version 300 es

// Author: TapiocaFox
// Title:  Match The Texture

#define SIZE_VOLUME_GRID 0.1
#define SIZE_MAX_SYSTEMS 16

precision highp float;
uniform float uTime;
uniform vec3 uViewPoint;
uniform mat4 uQ[3*SIZE_MAX_SYSTEMS];
uniform int uF[SIZE_MAX_SYSTEMS];
uniform int uS[SIZE_MAX_SYSTEMS];
uniform int uNumQ;
uniform float uSizeGrid;

in  vec3 vPos;
out vec4 fragColor;

vec3 firstGridColor = vec3(.8,.8,.8);
vec3 secondGridColor = vec3(.7,.7,.7);

vec3 light = normalize(vec3(1.,1.,1.));
vec3 lightColor = vec3(.95,.95,1.);
vec3 light2 = normalize(vec3(-1.,-1.,0.));
vec3 lightColor2 = vec3(.9,.5,.5);
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

float fractal(vec3 P) {
    float f = 0., s = 1.;
    for (int i = 0 ; i < 9 ; i++) {
        f += noise(s * P) / s;
        s *= 2.;
        P = vec3(.866*P.x + .5*P.z, P.y + 100., -.5*P.x + .866*P.z);
    }
    return f;
}

float turbulence(vec3 P) {
    float f = 0., s = 1.;
    for (int i = 0 ; i < 4 ; i++) {
        f += abs(noise(s * P)) / s;
        s *= 2.;
        P = vec3(.866*P.x + .5*P.z, P.y + 100., -.5*P.x + .866*P.z);
    }
    return f;
}

vec3 marble(vec3 pos, int seed) {
    pos.z += float(seed);
    float v = turbulence(pos);
    float s = sqrt(.5 + .5 * sin(((.5*sin(float(seed))+.5)*17.+3.) * pos.y + 8. * v));
    return vec3(.8,.7,.5) * vec3(s,s*s,s*s*s);
}

vec3 wood(vec3 pos) {
   pos.y += .5 * turbulence(.4*pos);
   vec3 c = vec3(.7,.4,.1) *
            mix(1.5, .1,
	        .5 + .25 * turbulence(vec3(.5,40.,40.) * pos+2.*sin(pos))
                   + .25 * turbulence(vec3(40.,40.,.5) * pos+2.*sin(pos)));
   c *= .3 + .7 * pow(abs(sin(10. * pos.y)), .4);
   return c;
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

    fragColor = vec4(wood(vPos), 1.);
    float minX = 1000.;
    for (int n = 0; n < uNumQ; n++) {
        vec2 tI1 = vec2(-1.,1000.);
        for (int i = 3*n ; i < 3*n+3 ; i++) {
            vec2 tQ = findRoots(rayEq(V, W, uQ[i]));
            if (tQ.x > tI1.x) {
                vec3 P = V + tQ.x * W;
                vec3 PC = (uF[n]==0)?colorAtPoint(P):marble(mod(P-1., uSizeGrid), uS[n]);
                vec3 N = normalQ(uQ[i], P);
                
                color1 = lightColor*phong(N,light,W,PC,vec4(mix(PC,vec3(1.),.1), 20.));
                color1 += lightColor2*phong(N,light2,W,PC,vec4(mix(PC,vec3(1.),.1), 20.));
                    
                tI1.x = tQ.x;
            }
            if (tQ.y < tI1.y)
                tI1.y = tQ.y;
        }
        if (tI1.x > 0. && tI1.x < tI1.y && tI1.x < minX) {
            fragColor = vec4(sqrt(color1), 1.);
            minX = tI1.x;
        }
    }
}