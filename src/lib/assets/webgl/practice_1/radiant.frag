#version 300 es

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
}