const n=`#version 300 es

// Author: TapiocaFox
// Title: Balls

precision highp float;

#define P_RADIUS 0.2
#define TIME_DELAY 0.05
#define NUM_BALLS 16
#define PI 3.1415926535897932
#define RATIO_TIME 0.66

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

vec3 lightDirectional = normalize(vec3(1., 1., 2.));
vec3 lightAmbient = vec3(0.7,0.78,0.92);

void main() {
	vec4 color = vec4(0., 0., 0., 1.);
    for(int i=0; i<NUM_BALLS; i++) {
        vec2 st = vPos.xy;
    	st.x *= uResolution.x/uResolution.y;
        
        for(int j=0; j<3; j++) {
            float uTimeInChannel = RATIO_TIME*uTime+(.5*sin(RATIO_TIME*uTime+3.*float(i+1)))-float(3-j)*TIME_DELAY;
        	// float uTimeInChannel = uTime-float(j)*TIME_DELAY;

            vec2 stInChannel = st;
            stInChannel.x -= sin(.5*uTimeInChannel+float(i));    
            stInChannel.y -= sin(2.*uTimeInChannel+float(i));

            float z = sqrt(P_RADIUS*P_RADIUS-stInChannel.x*stInChannel.x-stInChannel.y*stInChannel.y);

            vec3 stp = vec3(stInChannel, z);

            if(z>0.) {
                float diffuse = dot(normalize(stp), lightDirectional);
                color[j] = lightAmbient[j]+diffuse;
                color[3] = 1.;
            }
        }
    }
	fragColor = color;
}`,e=`#version 300 es

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
}`,o=`#version 300 es

// Author: TapiocaFox
// Title: Adhesive

precision highp float;

#define PI 3.14159265358979
#define RADIUS 0.75
#define RATIO_TIME 0.66

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

void main() {
    vec2 st = vPos.xy;
    st.x *= uResolution.x/uResolution.y;
    
    float r = RADIUS;
    vec3 light = vec3(1., 1., 2.);
    
    st.x += sin(5.*st.x+PI*RATIO_TIME*uTime);      
    st.x += sin(5.*st.y-PI*RATIO_TIME*uTime);    
    st.y += sin(5.*st.y+PI*RATIO_TIME*uTime);
    st.y += sin(5.*st.x+PI*RATIO_TIME*uTime);    


    float z = sqrt(r*r - st.x*st.x - st.y*st.y);
    
    vec3 stp = vec3(st, z);
    
    if(stp.p>0.) {
    	vec3 color = vec3(0.);
    	color = vec3(st.x,st.y,abs(sin(RATIO_TIME*uTime)));
        float diffuse = step(abs(sin(RATIO_TIME*uTime)),dot(stp, light));
        fragColor = vec4(vec3(diffuse)+color,1.0);
    }
    else {
        fragColor = vec4(0.,0.,0.,1.0);
    }
}`,t=`#version 300 es

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
}`,i=`// Author: TapiocaFox
// Title:  Lava Lamp

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onpointerenter, onpointerleave, onclick, resizeObserver;

let alienSound = null;
let alienAppealSound = null;

export const title = 'Lava Lamp';
export const description = 'Click to appeal to the alien authority.';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    // Set status title.
    foxGL.reportStatus('Tips', 'Click to appeal to the alien authority.', 'green');
    
    foxGL.getAssetById('hl_alien_blipper').then(result => {result.loop = true; alienSound=result;});
    foxGL.getAssetById('hl_alienappeal').then(result => {alienAppealSound=result;});

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
        foxGL.render();
    }

    // Declare listeners.
    onpointermove = async event => {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    };
    
    onclick = async event => {
        alienAppealSound.currentTime = 0;
        alienAppealSound?.play();
    };
    
    onpointerenter = async event => {
        alienSound?.play();
    };
    
    onpointerleave = async event => {
        alienSound?.pause();
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
    if(resizeObserver) resizeObserver.disconnect();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onpointerenter) canvas.removeEventListener('pointerenter', onpointerenter);
    if(onpointerleave) canvas.removeEventListener('pointerleave', onpointerleave);
    if(onclick) canvas.removeEventListener('click', onclick);
};`,a=""+new URL("../assets/alien_blipper.DjjNZq0-.wav",import.meta.url).href,s=""+new URL("../assets/alienappeal.B5YF_wGI.wav",import.meta.url).href;export{o as a,n as b,a as c,i as d,s as h,t as l,e as r};
