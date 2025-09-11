// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    float r = 0.5;
    vec3 light = vec3(1., 1., 2.);
    
    st.x += sin(5.*st.x+PI*u_time);      
    st.x += sin(5.*st.y-PI*u_time);    
    st.y += sin(5.*st.y+PI*u_time);
    st.y += sin(5.*st.x+PI*u_time);    


    float z = sqrt(r*r - st.x*st.x - st.y*st.y);
    
    vec3 stp = vec3(st, z);
    
    if(stp.p>0.) {
    	vec3 color = vec3(0.);
    	color = vec3(st.x,st.y,abs(sin(u_time)));
        float diffuse = step(abs(sin(u_time)),dot(stp, light));
        gl_FragColor = vec4(vec3(diffuse)+color,1.0);
    }
    else {
        gl_FragColor = vec4(0.,0.,0.,1.0);
    }
}