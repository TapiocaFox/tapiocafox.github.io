import"../chunks/DsnmJJEf.js";import{p as V,aJ as G,f as _,e as h,a as m,b as X,s,k as Y,i as e,j as K,aA as I,c as l,r as a,g as A}from"../chunks/ug66gb1C.js";import{i as L}from"../chunks/CkVXaSfc.js";import{e as O,i as F}from"../chunks/9Fe9rX9w.js";import{C as J}from"../chunks/BwVEZHM4.js";import{H as Q}from"../chunks/DSCYYZAn.js";import{d as p,e as N,T as f,a as ee}from"../chunks/BkMuzGZz.js";import{m as D}from"../chunks/8p4Ra2kK.js";import{a as ne,b as te,r as oe}from"../chunks/K1sOCa-h.js";import{g as ie}from"../chunks/ci-W82wf.js";const re=`#version 300 es

// Author: TapiocaFox
// Title:  Reflective Spheres

in  vec3 position;
out vec3 vPos;

void main() {
    gl_Position = vec4(position, 1.);
    vPos = position;
}`,se=`#version 300 es

// Author: TapiocaFox
// Title:  Reflective Spheres
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
uniform vec2 uMouse;
uniform vec4 uS[MAX_SPHERES];
uniform vec3 uC[MAX_SPHERES],uL[MAX_LIGHTS],uLC[MAX_LIGHTS];

uniform float uTime;
uniform vec3 uViewPoint;

in  vec3 vPos;
out vec4 fragColor;

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

vec3 shadeSphereDirectly(int i, vec3 P) {
    vec4 S = uS[i];
    vec3 C = uC[i];
    vec3 N = (P - S.xyz) / S.w;
    
    vec3 shade = vec3(.1);

    vec3 step = vec3(1.3, 1.7, 2.1);
    // vec3 step = vec3(0., 0., 0.);
    float shift = float(5*i);
    float n = snoise(vec4(P, shift+0.3*uTime));
    n += 0.5 * snoise(vec4(P* 2.0 - step, shift+0.3*uTime));
    n += 0.25 * snoise(vec4(P* 4.0 - 2.0 * step, shift+0.3*uTime));
    n += 0.125 * snoise(vec4(P* 8.0 - 3.0 * step, shift+0.3*uTime));
    n += 0.0625 * snoise(vec4(P* 16.0 - 4.0 * step, shift+0.3*uTime));
    n += 0.03125 * snoise(vec4(P* 32.0 - 5.0 * step, shift+0.3*uTime));
    shade += max(n, -.5);
    
    // shade *= sin(20. * N.y - PI*uTime);
    shade *= (1.-LOWER_BOUND_SIN)*(.5 + .5 * sin(1./SCALE_SIN * N.y - SPEED_SIN*PI*uTime*float(2 * (i & 1) - 1)))+LOWER_BOUND_SIN;
    // shade *= 1.;
    // Direct light source.
    for (int l = 0 ; l < NL ; l++)
        if (! inShadow(P, uL[l]))
            shade += uLC[l] * max(0., dot(N, uL[l]));
    
    return C * shade;
}

vec3 shadeSphere(int i, vec3 P, vec3 W) {
    vec4 S = uS[i];
    vec3 C = uC[i];
    vec3 N = (P - S.xyz) / S.w;
    
    vec3 directShade = shadeSphereDirectly(i,P);

    // Glow from other spheres.
    vec3 reflectiveShade = vec3(0.);
    float t = 100.;
    vec3 WR = reflect(W, N);
    for (int l = 0 ; l < NS ; l++) {
        vec2 tt = raySphere(P, WR, uS[l]);
        if (tt.x < tt.y && tt.x > 0. && tt.x < t) {
            t = tt.x;
            vec3 PGlow = P + t * WR;
            vec3 color = shadeSphereDirectly(l,PGlow);
            // vec3 NGlow = (PGlow-uS[l].xyz)/uS[l].w;
            // F = color * max(0., dot(-WR, NGlow));
            reflectiveShade = color;
        }
    }

    return directShade+reflectiveShade;
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
    
    fragColor = vec4(pow(F.rgb, vec3(1.0/2.2)), F.a);

    vec4 colorBg = vec4(0.);
    colorBg = vec4(.5*sin(PI*(.25*vPos.x-uTime))+.5,.5*sin(PI*(.4*vPos.y-uTime))+.5,.5*sin(PI*uTime)+.5, 1.);
    
    float pctNoiseW = snoise(vec4(.8*SIZE_SHRINK_MOUSE*vPos.xy-vec2(.33*uTime), 0.7*uTime, 0.));
    float pctNoiseB = 2.*snoise(vec4(.9*SIZE_SHRINK_MOUSE*vPos.xy-vec2(.33*uTime), 0.5*uTime, 0.));
    
    colorBg = mix(colorBg, vec4(1.), .25*pctNoiseW);    
    colorBg = mix(colorBg, vec4(0., 0., 0., 1.), pctNoiseB);
    colorBg = mix(vec4(0.,0.,0.,1.),colorBg,.15);

    fragColor = mix(vec4(0.,0.,0.,1.),fragColor,F.a);
    // fragColor = mix(colorBg,fragColor,F.a);
}`,ae=`// Author: TapiocaFox
// Title:  Reflective Spheres

// Reference to foxGL (Only exposed APIs):
// export interface TapiocaFoxGLContext {
//     gl: WebGL2RenderingContext,
//     canvas: HTMLCanvasElement,
//     program: WebGLProgram,
//     startTime: number,
//     lastRenderTime: number,
//     devicePixelRatio: number,
//     onStart: (start: () => void) => void,
//     onStop: (stop: () => void) => void,
//     render: () => void,
//     reportStatus: (key: string, status: string) => void,
// }

// console.log('JavaScript entered.');

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;
let destroyed = false;

const NS = 4;
const NL = 3;

const PI = 3.141592653589793;
// const NL = 0;

let usePointer = false;
let enlarge = false;
let uMouse_x = 0;
let uMouse_y = 0;

// Declare listeners.
const onpointermove = async event => {
    usePointer = true;
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    uMouse_x = devicePixelRatio*(event.clientX-canvasRect.left);
    uMouse_y = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouse_x, uMouse_y);
    foxGL.reportStatus('uMouse', \`uMouse: (\${uMouse_x.toFixed(1)}, \${uMouse_y.toFixed(1)})\`);
};

const onclick = async event => {
    enlarge = !enlarge;
    foxGL.reportStatus('enlarge', \`Enlarged: \${enlarge}\`);
};

const pointerleave = async event => {
    usePointer = false;
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
});

// Math.
const normalize = v => {
   let s = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
   return [ v[0]/s, v[1]/s, v[2]/s ];
}

// Render per animation frame.
function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    const RATIO_TIME = 0.66;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);

    const deg = 0.25*PI*Math.sin(RATIO_TIME*uTime);
    const s = Math.sin(deg);
    const s_thrid = Math.sin(2*RATIO_TIME*uTime);
    const c_thrid = Math.cos(RATIO_TIME*uTime);
    const s_fourth = Math.sin(2*(RATIO_TIME*uTime-.33*PI));
    const c_fourth = Math.cos(RATIO_TIME*uTime-.33*PI);
    const c = Math.cos(deg);

    // Spheres.
    const thridSphere = [.7*c_thrid,.7*s_thrid,.1,.225];
    if(usePointer) {
        thridSphere[0] = 2*(uMouse_x/canvas.width)-1;
        thridSphere[1] = 2*(uMouse_y/canvas.height)-1;
    }
    if(enlarge) {
        thridSphere[3] = .275;
    }
    else {
        thridSphere[3] = .225;
    }
    gl.uniform4fv(gl.getUniformLocation(program, 'uS'), [ -.4*s,0,-.4*c,.35,
                              .4*s,0,.4*c,.35,
                               thridSphere,
                              .7*c_fourth,.7*s_fourth,.1,.225].flat());
    // Spheres' colors.
    let thridSphereC = [.5,1,.5];
    if(enlarge) {
        thridSphereC = [1,1,1];
    }
    else {
        thridSphereC = [1,1,1];
        // thridSphereC = [.5,1,.5];
    }
    gl.uniform3fv(gl.getUniformLocation(program, 'uC'), [ 1,.2,.2,
                             .25,.5,1,
                              thridSphereC,
                             0.2,0.,0.].flat());
    // Lights.
    gl.uniform3fv(gl.getUniformLocation(program, 'uL'), [ normalize([1,1,1]),
                             normalize([-1,-1,-.5]),
                             normalize([0,-1,0])
			   ].flat());

    // Lights' colors.
    gl.uniform3fv(gl.getUniformLocation(program, 'uLC'), [ .5,.7,1,
                              .2,.15,.1,
			      .5,0,0 ]);
    foxGL.render();
}

// Register listeners on start.
foxGL.onStart(async () => {
    foxGL.setStatusTitle('Reflective Spheres');
    foxGL.reportStatus('Description', \`Click to enlarge the white sphere.\`);
    foxGL.reportStatus('enlarge', \`Enlarged: \${enlarge}\`);
    gl.uniform1i(gl.getUniformLocation(program, 'NS'), NS);
    gl.uniform1i(gl.getUniformLocation(program, 'NL'), NL);
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    gl.uniform3f(gl.getUniformLocation(program, 'uViewPoint'), 0, 0, 3);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('click', onclick);
    canvas.addEventListener('pointerleave', pointerleave);
    window.addEventListener('resize', onresize);
    animate();
});

// Deregister listeners on stop.
foxGL.onStop(async () => {
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('click', onclick);
    canvas.removeEventListener('pointerleave', pointerleave);
    window.removeEventListener('resize', onresize);
});

// console.log('JavaScript exited.');`,T=`// Author: TapiocaFox
// Title:  Frame Skip Renderer

// Reference to foxGL (Only exposed APIs):
// export interface TapiocaFoxGLContext {
//     gl: WebGL2RenderingContext,
//     canvas: HTMLCanvasElement,
//     program: WebGLProgram,
//     startTime: number,
//     lastRenderTime: number,
//     devicePixelRatio: number,
//     onStart: (start: () => void) => void,
//     onStop: (stop: () => void) => void,
//     render: () => void,
//     reportStatus: (key: string, status: string) => void,
// }

// console.log('JavaScript entered.');

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;
let destroyed = false;
let firstFrameRendered = false;
let frameCount = 0;
let skippedFrameCount = 0;
const frameSkip = 3;
const frameSkipSkip = 5;
let doNotSkip = false;

// Declare listeners.
const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const uMouse_x = devicePixelRatio*(event.clientX-canvasRect.left);
    const uMouse_y = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouse_x, uMouse_y);
    foxGL.reportStatus('uMouse', \`uMouse: (\${uMouse_x.toFixed(1)}, \${uMouse_y.toFixed(1)})\`);
    doNotSkip = true;
};

const onpointerleave = async event => {
    doNotSkip = false;
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    firstFrameRendered = false;
    animate();
});

// Render per animation frame.
function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    frameCount++;
    if(!doNotSkip && firstFrameRendered && frameCount%frameSkip!=0) {
        skippedFrameCount++;
        if(skippedFrameCount%frameSkipSkip==0) return;
    }
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
    foxGL.render();
    firstFrameRendered = true;
}

// Register listeners on start.
foxGL.onStart(async () => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.setStatusTitle('Frame Skip Renderer');
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerleave', onpointerleave);
    window.addEventListener('resize', onresize);
});

// Deregister listeners on stop.
foxGL.onStop(async () => {
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('pointerleave', onpointerleave);
    window.removeEventListener('resize', onresize);
});

// console.log('JavaScript exited.');`,k=`// Author: TapiocaFox
// Title:  Passive Renderer

// Reference to foxGL (Only exposed APIs):
// export interface TapiocaFoxGLContext {
//     gl: WebGL2RenderingContext,
//     canvas: HTMLCanvasElement,
//     program: WebGLProgram,
//     startTime: number,
//     lastRenderTime: number,
//     devicePixelRatio: number,
//     onStart: (start: () => void) => void,
//     onStop: (stop: () => void) => void,
//     render: () => void,
//     reportStatus: (key: string, status: string) => void,
// }

// console.log('JavaScript entered.');

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;
let destroyed = false;
let animateOrNot = false;
let firstFrameRendered = false;

// Declare listeners.
const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const uMouse_x = devicePixelRatio*(event.clientX-canvasRect.left);
    const uMouse_y = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouse_x, uMouse_y);
    foxGL.reportStatus('uMouse', \`uMouse: (\${uMouse_x.toFixed(1)}, \${uMouse_y.toFixed(1)})\`);
    if(!animateOrNot) {
        animateOrNot = true;
        animate();
    }
};

const onpointerleave = async event => {
    animateOrNot = false;
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    firstFrameRendered = false;
    animate();
});

// Render per animation frame.
function animate() {
    if(destroyed) return;
    if(firstFrameRendered && !animateOrNot) return;
    requestAnimationFrame(animate);
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
    foxGL.render();
    firstFrameRendered = true;
}

// Register listeners on start.
foxGL.onStart(async () => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.setStatusTitle('Passive Renderer');
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerleave', onpointerleave);
    window.addEventListener('resize', onresize);
});

// Deregister listeners on stop.
foxGL.onStop(async () => {
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('pointerleave', onpointerleave);
    window.removeEventListener('resize', onresize);
});

// console.log('JavaScript exited.');`,ce=`#version 300 es

// Author: TapiocaFox
// Title: Colorful Snoise
// Snoise implementation is from: https://stegu.github.io/webgl-noise/webdemo/

precision highp float;

#define PI 3.14159265358979
#define SIZE_SHRINK_MOUSE 1.

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

vec3 mod289(vec3 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
	return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    // vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    // vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    vec2 st = vPos.xy;
    st.x *= uResolution.x/uResolution.y;
    
    vec2 stMouse = uMouse/uResolution.xy *2. - 1.;
    stMouse.x *= uResolution.x/uResolution.y;
    
    float atanMouse = atan(stMouse.x, stMouse.y);
    float shrinkMouse = 1./(SIZE_SHRINK_MOUSE*distance(stMouse, vec2(0.)));

    vec3 color = vec3(0.);
    color = vec3(.5*sin(PI*(.25*st.x-uTime))+.5,.5*sin(PI*(.4*st.y-uTime))+.5,.5*sin(PI*uTime)+.5);
    
    float pctNoiseW = snoise(vec3(.8*shrinkMouse*st-vec2(.33*uTime), 0.7*uTime));
    float pctNoiseB = 2.*snoise(vec3(.9*shrinkMouse*st-vec2(.33*uTime), 0.5*uTime));
    
    color = mix(color, vec3(1.), pctNoiseW);    
    color = mix(color, vec3(0.), pctNoiseB);

    fragColor = vec4(color,1.0);
}`,H=`#version 300 es

// Author: TapiocaFox
// Title: Sin

precision highp float;


#define PI 3.14159265358979
#define RATIO_SPEED .5

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float plot(vec2 st, float pct) {
    return smoothstep(pct-0.02, pct,st.y) - smoothstep(pct, pct+0.02,st.y);
    
}

void main() {
    vec2 st = vPos.xy;
    st.x *= uResolution.x/uResolution.y;

    vec2 st_mouse = uMouse / uResolution.xy * 2.0 - 1.0;
    st_mouse.x *= uResolution.x/uResolution.y;
    st.x -= st_mouse.x;
    
	float y = sin(PI*(st.x - uTime*RATIO_SPEED));
    
    float pct = plot(st, y);
    
    vec3 color = (1.0-pct)*y+pct*vec3(0.0, 1.0, 0.0);

    fragColor = vec4(color,1.0);
}`,ve=`#version 300 es

// Author: TapiocaFox
// Title: Fiber

precision highp float;

#define PI 3.14159265358979
#define GAP 0.1
#define SIZE_HALF_STROKE 0.02
#define DEG_ROTATION 0.2
#define RATIO_TIME 0.66

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float calcBackground(vec2 st) {
    vec2 stMod = mod(st, GAP);
    vec2 pctSt = smoothstep(GAP-SIZE_HALF_STROKE, GAP, stMod) + smoothstep(-SIZE_HALF_STROKE, 0., -stMod);
    return max(pctSt.x, pctSt.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy*2.-1.;
    st.x *= uResolution.x/uResolution.y;

    vec2 stMouse = uMouse / uResolution.xy * 2. - 1.;
    stMouse.x *= uResolution.x/uResolution.y;
    
    mat2 rot;
    rot[0] = vec2(cos(DEG_ROTATION), -sin(DEG_ROTATION));    
    rot[1] = vec2(sin(DEG_ROTATION), cos(DEG_ROTATION));
    
    st = st*rot;
    st -= .5*stMouse;
	
    st.x -= sin(3.*st.x-.5*PI*RATIO_TIME*uTime);      
    st.x -= sin(3.*st.y-.5*PI*RATIO_TIME*uTime);    
    st.y -= sin(3.*st.y+.5*PI*RATIO_TIME*uTime);
    st.y -= sin(3.*st.x+.5*PI*RATIO_TIME*uTime);
    
    vec3 color = vec3(0.);
    color = vec3(abs(.25*sin(st.x+.95*PI*RATIO_TIME*uTime)+.75),abs(.25*sin(st.y+.75*PI*RATIO_TIME*uTime)+.75),abs(.25*sin(.5*PI*RATIO_TIME*uTime)+.75));
    
    float pct = calcBackground(st);
    
    color = mix(vec3(0.), color, pct);

    fragColor = vec4(color,1.0);
}`,le=`#version 300 es

// Author: TapiocaFox
// Title: Array

precision highp float;

#define SIZE_HALF_WIDTH .025
#define SIZE_EDGE .005
#define SIZE_HALF_INTERVAL .05
#define PI 3.14159265358979
#define DEG_BASE -.005
#define SCALE_ROTATION_DEGREE .5
#define SCALE_DEGREE -0.01
#define RATIO_ROTATION_INTERVAL 0.25
#define RATIO_TIME 0.66

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

vec3 rot3d(vec3 stp, float alpha, float beta, float gamma) {
    mat3 rot;
    rot[0] = vec3(cos(alpha)*cos(beta), cos(alpha)*sin(beta)*sin(gamma)-sin(alpha)*cos(gamma), cos(alpha)*sin(beta)*cos(gamma)+sin(alpha)*sin(gamma));
    rot[1] = vec3(sin(alpha)*cos(beta), sin(alpha)*sin(beta)*sin(gamma)+cos(alpha)*cos(gamma), sin(alpha)*sin(beta)*cos(gamma)-cos(alpha)*sin(gamma));
    rot[2] = vec3(-sin(beta), cos(beta)*sin(gamma), cos(beta)*cos(gamma));
    return rot*stp;
}

void main() {
    vec2 st = vPos.xy;
    st.x *= uResolution.x/uResolution.y;
    
    float degree = SCALE_DEGREE*sin(RATIO_ROTATION_INTERVAL*RATIO_TIME*uTime)+DEG_BASE;
    mat2 rot2d;
    rot2d[0] = vec2(cos(degree), -sin(degree));    
    rot2d[1] = vec2(sin(degree), cos(degree));
    
    st = rot2d*st;
    
    vec3 color = vec3(0.);
    color = vec3(.5*sin(PI*(.25*st.x-RATIO_TIME*uTime))+.5,.5*sin(PI*(.4*st.y-RATIO_TIME*uTime))+.5,.5*sin(PI*RATIO_TIME*uTime)+.5);
    
    vec2 stBlock = st;
    stBlock = mod(stBlock-SIZE_HALF_INTERVAL, 2.*SIZE_HALF_INTERVAL)-SIZE_HALF_INTERVAL;
    
    stBlock = rot3d(vec3(stBlock, 0.), SCALE_ROTATION_DEGREE*PI*color.x-PI*.12, SCALE_ROTATION_DEGREE*PI*color.y-PI*.2, SCALE_ROTATION_DEGREE*PI*color.z-PI*.2).st;
    
    vec2 z_stBlock = smoothstep(-SIZE_HALF_WIDTH-SIZE_EDGE, -SIZE_HALF_WIDTH+SIZE_EDGE, stBlock)
        -smoothstep(-SIZE_HALF_WIDTH+SIZE_EDGE, -SIZE_HALF_WIDTH-SIZE_EDGE, -stBlock);
    float z_block = min(z_stBlock.x, z_stBlock.y);
    
    fragColor = vec4(mix(vec3(0.), color, z_block),1.0);
}`,ue="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20fill='%23000000'%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M12,2%20C14.1421954,2%2015.8910789,3.68396847%2015.9951047,5.80035966%20L16,6%20L16.0009007,6.17102423%20C16.8482841,6.47083722%2017.5208107,7.14059603%2017.8243776,7.98619771%20C18.3775427,7.93308996%2018.8969141,7.68887231%2019.2928932,7.29289322%20C19.7003708,6.88541564%2019.9471452,6.3472755%2019.9924253,5.77695139%20L20,5.58578644%20L20,5%20L20.0067277,4.88337887%20C20.0644928,4.38604019%2020.4871642,4%2021,4%20C21.5128358,4%2021.9355072,4.38604019%2021.9932723,4.88337887%20L22,5%20L22,5.58578644%20L21.9938294,5.81921837%20C21.9363787,6.90490079%2021.479744,7.93446953%2020.7071068,8.70710678%20C19.9777124,9.43650119%2019.0193415,9.88427517%2018.0009458,9.98044661%20L18,12%20L21,12%20C21.5522847,12%2022,12.4477153%2022,13%20C22,13.5522847%2021.5522847,14%2021,14%20L18,14%20L18.0009458,16.0195534%20C19.0193415,16.1157248%2019.9777124,16.5634988%2020.7071068,17.2928932%20C21.479744,18.0655305%2021.9363787,19.0950992%2021.9938294,20.1807816%20L22,20.4142136%20L22,21%20C22,21.5522847%2021.5522847,22%2021,22%20C20.4871642,22%2020.0644928,21.6139598%2020.0067277,21.1166211%20L20,21%20L20,20.4142136%20C20,19.7739243%2019.7456461,19.1598596%2019.2928932,18.7071068%20C18.8854156,18.2996292%2018.3472755,18.0528548%2017.7769514,18.0075747%20L17.6572765,18.0037085%20C16.8325575,20.3321558%2014.6110517,22%2012,22%20C9.38894833,22%207.16744253,20.3321558%206.34272355,18.0037085%20L6.22304861,18.0075747%20C5.6527245,18.0528548%205.11458436,18.2996292%204.70710678,18.7071068%20C4.2996292,19.1145844%204.05285477,19.6527245%204.00757466,20.2230486%20L4,20.4142136%20L4,21%20L3.99327227,21.1166211%20C3.93550716,21.6139598%203.51283584,22%203,22%20C2.48716416,22%202.06449284,21.6139598%202.00672773,21.1166211%20L2,21%20L2,20.4142136%20L2.00617059,20.1807816%20C2.06362127,19.0950992%202.52025597,18.0655305%203.29289322,17.2928932%20C4.02252654,16.5632599%204.98128639,16.1154315%206.00005498,16.019459%20L6,14%20L3,14%20C2.44771525,14%202,13.5522847%202,13%20C2,12.4477153%202.44771525,12%203,12%20L6,12%20L6.00005498,9.980541%20C4.98128639,9.88456847%204.02252654,9.4367401%203.29289322,8.70710678%20C2.52025597,7.93446953%202.06362127,6.90490079%202.00617059,5.81921837%20L2,5.58578644%20L2,5%20C2,4.44771525%202.44771525,4%203,4%20C3.51283584,4%203.93550716,4.38604019%203.99327227,4.88337887%20L4,5%20L4,5.58578644%20C4,6.22607568%204.25435391,6.84014035%204.70710678,7.29289322%20C5.10308588,7.68887231%205.62245732,7.93308996%206.1748463,7.98811167%20C6.47930745,7.14026687%207.15223954,6.47031582%208.00008893,6.17067428%20L8,6%20C8,3.790861%209.790861,2%2012,2%20Z%20M15,8%20L9,8%20C8.48716416,8%208.06449284,8.38604019%208.00672773,8.88337887%20L8,9%20L8,16%20C8,18.209139%209.790861,20%2012,20%20C14.1421954,20%2015.8910789,18.3160315%2015.9951047,16.1996403%20L16,16%20L16,9%20C16,8.48716416%2015.6139598,8.06449284%2015.1166211,8.00672773%20L15,8%20Z%20M12,4%20C10.9456382,4%2010.0818349,4.81587779%2010.0054857,5.85073766%20L10,6%20L14,6%20C14,4.99835629%2013.2636703,4.16869161%2012.3027743,4.0227694%20L12.1492623,4.00548574%20L12,4%20Z'/%3e%3c/svg%3e";var me=_('<h3>Debug</h3> <p class="annotation">WebGL2 shaders for debugging.</p> <div class="flex_grid gallery"><div class="item shader_item svelte-ahq8ot"><!></div> <div class="item shader_item svelte-ahq8ot"><!></div></div> <h3>Debug (Preview mode)</h3> <p class="annotation">WebGL2 shaders for debugging.</p> <div class="flex_grid gallery"><div class="item shader_item svelte-ahq8ot"><!></div> <div class="item shader_item svelte-ahq8ot"><!></div> <div class="item shader_item svelte-ahq8ot"><!></div></div>',1),de=_('<div class="item shader_item svelte-ahq8ot"><!></div>'),xe=_('<h3>Practice One</h3> <p class="annotation">Abstract fragment shader patterns animated over time. Some of them are interactive with mouse position. (Part of assignment one.)</p> <div class="flex_grid gallery"></div>',1),pe=_('<div class="item shader_item svelte-ahq8ot"><!></div>'),fe=_('<h3>Practice Two</h3> <p class="annotation">Raytracing of spheres.  Some of them are interactive with mouse position and clicks. (Part of assignment two.)</p> <div class="flex_grid gallery"></div>',1),ge=_("<!> <!>  <!> <!> <!>",1);function Pe(B,W){V(W,!0);let i=K("all"),E=G([{vert:p,frag:ne,categories:["distortion"]},{frag:te,categories:[]},{frag:ve,js:T,categories:["distortion"]},{frag:le,js:T,categories:[]},{frag:oe,categories:["noise"]}]),C=G([{vert:re,frag:se,js:ae,categories:["noise"]}]);var P=ge(),w=h(P);Q(w,{text:"Graphics"});var M=s(w,2);{let t=I(()=>[null,null,null,ue,N,N]);J(M,{names:["All categories","Noise","Distortion","Debug","Editor"],get inline_icons(){return e(t)},values:["all","noise","distortion","debug","editor"],dividers:["debug"],get selected_value(){return e(i)},callback:n=>{n=="editor"?ie("/webgl_editor"):Y(i,n,!0)}})}var b=s(M,2);{var Z=t=>{var n=me(),c=s(h(n),4),d=l(c),o=l(d);f(o,{get vertex_shader(){return p},get fragment_shader(){return D},get javascript(){return k}}),a(d);var u=s(d,2),S=l(u);f(S,{get vertex_shader(){return p},get fragment_shader(){return H},get javascript(){return T}}),a(u),a(c);var g=s(c,6),r=l(g),v=l(r);f(v,{get vertex_shader(){return p},get fragment_shader(){return D},get javascript(){return k},mode:"preview"}),a(r);var x=s(r,2),R=l(x);f(R,{get vertex_shader(){return p},get fragment_shader(){return H},get javascript(){return T},mode:"preview"}),a(x);var y=s(x,2),q=l(y);f(q,{get vertex_shader(){return p},get fragment_shader(){return ce},get javascript(){return T},mode:"preview"}),a(y),a(g),m(t,n)};L(b,t=>{e(i)=="debug"&&t(Z)})}var z=s(b,2);{var j=t=>{var n=xe(),c=s(h(n),4);O(c,21,()=>E,F,(d,o)=>{var u=A(),S=h(u);{var g=r=>{var v=de(),x=l(v);{let R=I(()=>e(o).vert?e(o).vert:p),y=I(()=>e(o).js?e(o).js:ee);f(x,{get vertex_shader(){return e(R)},get fragment_shader(){return e(o).frag},get javascript(){return e(y)}})}a(v),m(r,v)};L(S,r=>{(e(i)=="all"||e(o).categories.includes(e(i)))&&r(g)})}m(d,u)}),a(c),m(t,n)};L(z,t=>{E.filter(n=>e(i)=="all"||n.categories.includes(e(i))).length>0&&t(j)})}var U=s(z,2);{var $=t=>{var n=fe(),c=s(h(n),4);O(c,21,()=>C,F,(d,o)=>{var u=A(),S=h(u);{var g=r=>{var v=pe(),x=l(v);f(x,{get vertex_shader(){return e(o).vert},get fragment_shader(){return e(o).frag},get javascript(){return e(o).js}}),a(v),m(r,v)};L(S,r=>{(e(i)=="all"||e(o).categories.includes(e(i)))&&r(g)})}m(d,u)}),a(c),m(t,n)};L(U,t=>{C.filter(n=>e(i)=="all"||n.categories.includes(e(i))).length>0&&t($)})}m(B,P),X()}export{Pe as component};
