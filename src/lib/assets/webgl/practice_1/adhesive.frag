#version 300 es

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
}