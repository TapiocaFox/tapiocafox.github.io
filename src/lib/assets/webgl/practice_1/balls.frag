#version 300 es

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
}