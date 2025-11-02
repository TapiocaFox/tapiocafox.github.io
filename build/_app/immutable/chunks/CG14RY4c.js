const n=`#version 300 es

// Author: TapiocaFox
// Title: Radiant

precision highp float;

#define PI 3.1415926535897932
#define SIZE_SHRINK 2.
#define SIZE_SHRINK_MOUSE 1.
#define FREQ_POLAR 5.
#define FREQ_ROTATE 0.4
#define DISTANCE_TREMOR .2

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec2 st = vPos.xy;
    st.x *= uResolution.x/uResolution.y;
    vec2 st_mouse = uMouse/uResolution.xy *2. - 1.;
    st_mouse.x *= uResolution.x/uResolution.y;
    
    float atan_mouse = atan(st_mouse.x, st_mouse.y);
    float shrink_mouse = 1./(SIZE_SHRINK_MOUSE*distance(st_mouse, vec2(0.)));
    
    vec3 color = vec3(1.);
    
    for(int i=0; i<3; i++) {
        float x = .75*uTime;
        float tremor = DISTANCE_TREMOR*mix(sin(x), mix(sin(5.*x), mix(sin(5.*x), sin(12.*x), .9), .5), .2);
        float uTimeChannel = .75*uTime+tremor*float(i);
        // float uTimeChannel = uTime;
        
        float d = distance(st, vec2(0.));
        mat2 rot;
        float r = sin(FREQ_ROTATE*PI*(d-.75*uTime))-atan_mouse;
        rot[0] = vec2(cos(r), -sin(r));    
        rot[1] = vec2(sin(r), cos(r));
        vec2 st_new = rot*st;

        // d -= 1.*tremor;
        float pct = sin(FREQ_POLAR*atan(st_new.x, st_new.y))*sin((SIZE_SHRINK)*PI*(shrink_mouse*d-uTimeChannel))*.5+.5;
        pct = mix(0., pct, .5*random(st_new)+.5);
        color[i] = pct;
    }
	
    
    fragColor = vec4(color,1.0);
}`,e=`#version 300 es

// Author: TapiocaFox
// Title:  Reflective Refractive Spheres
// Snoise implementation is from: https://stegu.github.io/webgl-noise/webdemo/

precision highp float;

#define MAX_SPHERES 64
#define MAX_LIGHTS 64
#define PI 3.141592653589793238
#define SPEED_SIN 10.
#define SCALE_SIN .015
#define LOWER_BOUND_SIN .8
#define SIZE_SHRINK_MOUSE 1.

uniform int NS;
uniform int NL;
uniform vec2 uMouse, uR[MAX_SPHERES];
uniform vec4 uS[MAX_SPHERES];
uniform vec3 uC[MAX_SPHERES],uL[MAX_LIGHTS],uLC[MAX_LIGHTS];

uniform float uTime;
uniform vec3 uViewPoint;

in  vec3 vPos;
out vec4 fragColor;

vec3 colorRayEnd = vec3(.125);

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+10.0)*x);
}

float permute(float x) {
     return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
  {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
  }
						
// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
  {
  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                       -0.447213595499958); // -1 + 4 * G4

// First corner
  vec4 i  = floor(v + dot(v, vec4(F4)) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C.xxxx
  //  x1 = x0 - i1  + 1.0 * C.xxxx
  //  x2 = x0 - i2  + 2.0 * C.xxxx
  //  x3 = x0 - i3  + 3.0 * C.xxxx
  //  x4 = x0 - 1.0 + 4.0 * C.xxxx
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

// Permutations
  i = mod289(i); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.57 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.57 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 60.1 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }

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

vec3 phong(vec3 N, vec3 L, vec3 W,vec3 diffuse, vec4 specular) {
    vec3 shade = vec3(0.);
    shade += diffuse * max(0., dot(L,N)); // Diffuse.
    vec3 reflection = 2.*N*dot(N,L)-L;
    shade += specular.xyz * pow(max(0., dot(-reflection, W)), specular.w); // Specular.
    return shade;
}

vec3 shadeSphereDirectly(int i, vec3 P, vec3 W) {
    vec4 S = uS[i];
    vec3 C = uC[i];
    vec3 N = (P - S.xyz) / S.w;
    vec2 R = uR[i];
    
    vec3 shade = colorRayEnd;

    vec3 step = vec3(1.3, 1.7, 2.1);
    // vec3 step = vec3(0., 0., 0.);
    float shift = float(5*i);
    float n = snoise(vec4(P, shift+0.3*uTime));
    n += 0.5 * snoise(vec4(P* 2.0 - step, shift+0.3*uTime));
    n += 0.25 * snoise(vec4(P* 4.0 - 2.0 * step, shift+0.3*uTime));
    n += 0.125 * snoise(vec4(P* 8.0 - 3.0 * step, shift+0.3*uTime));
    n += 0.0625 * snoise(vec4(P* 16.0 - 4.0 * step, shift+0.3*uTime));
    n += 0.03125 * snoise(vec4(P* 32.0 - 5.0 * step, shift+0.3*uTime));
    shade = shade+max(min(.5*n, .25), -.75);
    // shade += n;
    
    // shade *= sin(20. * N.y - PI*uTime);
    shade *= (1.-LOWER_BOUND_SIN)*(.5 + .5 * sin(1./SCALE_SIN * N.y - SPEED_SIN*PI*uTime*float(2 * (i & 1) - 1)))+LOWER_BOUND_SIN;
    // shade *= 1.;
    
    // Direct light source.
    for (int l = 0 ; l < NL ; l++)
        if (! inShadow(P, uL[l])) {
            // shade += uLC[l] * max(0., dot(N, uL[l])); // No phong.
            shade += R.x * uLC[l] * phong(N,uL[l],W,C,vec4(vec3(.33), 30));
        }
    
    return shade;
}

vec3 shadeSphere(int i, vec3 P, vec3 W) {
    vec4 S = uS[i];
    vec3 C = uC[i];
    vec3 N = (P - S.xyz) / S.w;
    vec2 R = uR[i];
    
    vec3 directShade = shadeSphereDirectly(i,P,W);

    // Glow from other spheres.
    vec3 reflectiveShade = vec3(0.);
    float t = 100.;
    vec3 WR = reflect(W, N);
    for (int l = 0 ; l < NS ; l++) {
        vec2 tt = raySphere(P, WR, uS[l]);
        if (tt.x < tt.y && tt.x > 0. && tt.x < t) {
            t = tt.x;
            vec3 PGlow = P + t * WR;
            vec3 color = shadeSphereDirectly(l,PGlow,WR);
            // vec3 NGlow = (PGlow-uS[l].xyz)/uS[l].w;
            // F = color * max(0., dot(-WR, NGlow));
            reflectiveShade = color;
        }
    }

    // Refraction from other spheres.
    vec3 refractiveShade = vec3(0.);
    t = 100.;
    WR = refract(W, N, R.y);
    vec2 tt = raySphere(P, WR, S);
    P = P + tt.x * WR;
    N = (P - S.xyz) / S.w;
    WR = refract(W, N, 1./R.y);
    for (int l = 0 ; l < NS ; l++) {
        vec2 tt = raySphere(P, WR, uS[l]);
        if (tt.x < tt.y && tt.x > 0. && tt.x < t) {
            t = tt.x;
            vec3 PGlow = P + t * WR;
            vec3 color = (1.-R.x)*shadeSphereDirectly(l,PGlow,WR);
            // vec3 NGlow = (PGlow-uS[l].xyz)/uS[l].w;
            // F = color * max(0., dot(-WR, NGlow));
            refractiveShade = color;
        }
    }

    return directShade+reflectiveShade+refractiveShade;
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
            F = vec4(shadeSphere(i,P,W),1.);
        }
    }
    
    // fragColor = vec4(pow(F.rgb, vec3(1.0/2.2)), F.a);
    fragColor = vec4(F.rgb, F.a);

    vec4 colorBg = vec4(0.);
    colorBg = vec4(.5*sin(PI*(.25*vPos.x-uTime))+.5,.5*sin(PI*(.4*vPos.y-uTime))+.5,.5*sin(PI*uTime)+.5, 1.);
    
    float pctNoiseW = snoise(vec4(.8*SIZE_SHRINK_MOUSE*vPos.xy-vec2(.33*uTime), 0.7*uTime, 0.));
    float pctNoiseB = 2.*snoise(vec4(.9*SIZE_SHRINK_MOUSE*vPos.xy-vec2(.33*uTime), 0.5*uTime, 0.));
    
    colorBg = mix(colorBg, vec4(1.), .25*pctNoiseW);    
    colorBg = mix(colorBg, vec4(0., 0., 0., 1.), pctNoiseB);
    colorBg = mix(vec4(0.,0.,0.,1.),colorBg,.15);

    fragColor = mix(vec4(0.,0.,0.,1.),fragColor,F.a);
    // fragColor = mix(colorBg,fragColor,F.a);
}`,t=`// Author: TapiocaFox
// Title:  Reflective Refractive Spheres

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onpointerleave, onclick, resizeObserver;

const PI = 3.141592653589793;
const NS = 4;
const NL = 3;

// Math.
const normalize = v => {
   let s = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
   return [ v[0]/s, v[1]/s, v[2]/s ];
}

export const title = 'Reflective Refractive Spheres';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    let enlarge = false;
    
    // Set status title.
    foxGL.reportStatus('Description', \`Click to enlarge the white sphere.\`, 'green');
    foxGL.reportStatus('enlarge', \`Enlarged: \${enlarge}\`, enlarge?'blue':'red');

    foxGL.getAssetById('hl_activated').then(result => activatedSound = result);
    foxGL.getAssetById('hl_deactivated').then(result => deactivatedSound = result);

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    // Initial uniform values.
    gl.uniform1i(gl.getUniformLocation(program, 'NS'), NS);
    gl.uniform1i(gl.getUniformLocation(program, 'NL'), NL);
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    gl.uniform3f(gl.getUniformLocation(program, 'uViewPoint'), 0, 0, 3);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);

    // Render per animation frame.
    function animate() {
        if(destroyed) return;
        requestAnimationFrame(animate);
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        const RATIO_TIME = 0.66;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);

        const radianRotation = 0.25*PI*Math.sin(RATIO_TIME*uTime);
        
        const sinRot = Math.sin(radianRotation);
        const cosRot = Math.cos(radianRotation);

        const sinThird = Math.sin(2*RATIO_TIME*uTime);
        const cosThird = Math.cos(RATIO_TIME*uTime);
        const sinFourth = Math.sin(2*(RATIO_TIME*uTime-.33*PI));
        const cosFourth = Math.cos(RATIO_TIME*uTime-.33*PI);

        // Spheres.
        const thridSphere = [usePointer?2*(uMouseX/canvas.width)-1:.7*cosThird,
                            usePointer?2*(uMouseY/canvas.height)-1:.7*sinThird,
                            .1,enlarge?.275:.225];
        gl.uniform4fv(gl.getUniformLocation(program, 'uS'), [ 
            [-.4*sinRot,0,-.4*cosRot,.35],
            [.4*sinRot,0,.4*cosRot,.35],
            thridSphere,
            [.7*cosFourth,.7*sinFourth,.1,.225]
        ].flat());
        // Spheres' colors.
        gl.uniform3fv(gl.getUniformLocation(program, 'uC'), [ 
            [1,.5,.5],
            [.65,.65,1.],
            [1,1,1],
            [.5,0.,0.]
        ].flat());
        // Spheres' opacity and eta.
        gl.uniform2fv(gl.getUniformLocation(program, 'uR'), [ 
        [1., 1.],
        [.5, 1.15],
        [1.,1.],
        [1.,1.]
        ].flat());
        // Lights.
        gl.uniform3fv(gl.getUniformLocation(program, 'uL'), [ 
            normalize([1,1,1]),
            normalize([-1,-1,-.5]),
            normalize([0,-1,0])
        ].flat());
        // Lights' colors.
        gl.uniform3fv(gl.getUniformLocation(program, 'uLC'), [
            [.6,.8,1],
            [.2,.15,.1],
            [.5,0,0]
        ].flat());
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        foxGL.reportFrame();
    }
    
    let usePointer = false;
    let uMouseX = 0;
    let uMouseY = 0;
    
    let activatedSound = null;
    let deactivatedSound = null;
    
    // Declare listeners.
    onpointermove = async event => {
        usePointer = true;
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    };
    
    onclick = async event => {
        enlarge = !enlarge;
        if(enlarge && activatedSound) {
            activatedSound.currentTime = 0;
            activatedSound.play();
        }
        else if(deactivatedSound) {
            deactivatedSound.currentTime = 0;
            deactivatedSound.play();
        }
        foxGL.reportStatus('enlarge', \`Enlarged: \${enlarge}\`, enlarge?'blue':'red');
    };
    
    onpointerleave = async event => {
        usePointer = false;
    };
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    });

    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('click', onclick);
    canvas.addEventListener('pointerleave', onpointerleave);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(resizeObserver) resizeObserver.disconnect();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onclick) canvas.removeEventListener('click', onclick);
    if(onpointerleave) canvas.removeEventListener('pointerleave', onpointerleave);
};`,o=""+new URL("../assets/activated.Bse8Nsx6.wav",import.meta.url).href,i=""+new URL("../assets/deactivated.COA-aso_.wav",import.meta.url).href,r=`#version 300 es

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
vec3 colorGlitter2 = vec3(1., 1., 1.);

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
    color += (1.-clip)*colorGlitter2*gg*glitter(vPos-vec3(0.,SPEED_Y_GLITTER*uTime, uTime+100.));
    fragColor = vec4(color, 1.);
}`,a=`// Author: TapiocaFox
// Title:  Lava Lamp

import { getAudioBufferByAssetId, playAudioBuffer} from 'utils';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onpointerenter, onpointerleave, onclick, resizeObserver;
let audioCtx = new AudioContext();

export const title = 'Lava Lamp';
export const description = 'Click to appeal to the alien authority.';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    // Set status title.
    foxGL.reportStatus('Tips', 'Click to appeal to the alien authority.', 'green');

    const ambientAudioBuffer = await getAudioBufferByAssetId(foxGL, audioCtx, 'hl_alien_blipper');
    const appealAudioBuffer = await getAudioBufferByAssetId(foxGL, audioCtx, 'hl_alienappeal');
    audioCtx.suspend();
    await playAudioBuffer(audioCtx, ambientAudioBuffer, 0, true);

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);

    // Render per animation frame.
    function animate() {
        if(destroyed) return;
        requestAnimationFrame(animate);
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        foxGL.reportFrame();
    }

    // Declare listeners.
    onpointermove = async event => {
        await audioCtx.resume();
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    };
    
    onclick = async event => {
        await playAudioBuffer(audioCtx, appealAudioBuffer);
    };
    
    onpointerenter = async event => {
        await audioCtx.resume();
    };
    
    onpointerleave = async event => {
        await audioCtx.suspend();
    };
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    });
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerenter', onpointerenter);
    canvas.addEventListener('pointerleave', onpointerleave);
    canvas.addEventListener('click', onclick);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    audioCtx.close();
    if(resizeObserver) resizeObserver.disconnect();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onpointerenter) canvas.removeEventListener('pointerenter', onpointerenter);
    if(onpointerleave) canvas.removeEventListener('pointerleave', onpointerleave);
    if(onclick) canvas.removeEventListener('click', onclick);
};`,s=""+new URL("../assets/alien_blipper.DjjNZq0-.wav",import.meta.url).href,c=""+new URL("../assets/alienappeal.B5YF_wGI.wav",import.meta.url).href;export{e as a,i as b,t as c,c as d,s as e,a as f,o as h,r as l,n as r};
