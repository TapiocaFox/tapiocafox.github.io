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
}`;export{o as a,n as b,e as r};
