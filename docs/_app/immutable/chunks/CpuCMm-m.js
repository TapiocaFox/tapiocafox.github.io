const n=`// Author:
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
}`,t=`
// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

#define p_radius 0.2
#define t_delay 0.05
#define num_balls 16
#define PI 3.1415926535897932


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 l_directional = normalize(vec3(1., 1., 2.));
vec3 l_ambient = vec3(0.7,0.78,0.92);

void main() {
	vec4 color = vec4(0., 0., 0., 1.);
    for(int i=0; i<num_balls; i++) {
        vec2 st = gl_FragCoord.xy/u_resolution*2.-1.;
    	st.x *= u_resolution.x/u_resolution.y;
        
        for(int j=0; j<3; j++) {
            float u_time_ch = u_time+(.5*sin(u_time+3.*float(i+1)))-float(j)*t_delay;
        	// float u_time_ch = u_time-float(j)*t_delay;


            vec2 st_ch = st;
            st_ch.x -= sin(.5*u_time_ch+float(i));    
            st_ch.y -= sin(2.*u_time_ch+float(i));

            float z = sqrt(p_radius*p_radius-st_ch.x*st_ch.x-st_ch.y*st_ch.y);

            vec3 stp = vec3(st_ch, z);

            if(z>0.) {
                float diffuse = dot(normalize(stp), l_directional);
                color[j] = l_ambient[j]+diffuse;
                color[3] = 1.;
            }
        }
    }
	gl_FragColor = color;
}`;export{n as a,t as b};
