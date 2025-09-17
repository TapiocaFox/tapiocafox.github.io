const n=`// Author: TapiocaFox
// Title: Adhesive

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979
#define radius 0.75

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    float r = radius;
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
// Author: TapiocaFox
// Title: Balls

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
            float u_time_ch = u_time+(.5*sin(u_time+3.*float(i+1)))-float(3-j)*t_delay;
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
}`,e=`// Author: TapiocaFox
// Title: Radiant

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932
#define size_shrink 2.
#define size_shrink_mouse 1.
#define freq_polar 5.
#define freq_rotate 0.4
#define t_delay .075
#define d_shift .2


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*2. -1.;
    st.x *= u_resolution.x/u_resolution.y;
    vec2 st_mouse = u_mouse/u_resolution.xy *2. - 1.;
    st_mouse.x *= u_resolution.x/u_resolution.y;
    
    float atan_mouse = atan(st_mouse.x, st_mouse.y);
    float shrink_mouse = 1./(size_shrink_mouse*distance(st_mouse, vec2(0.)));
    
    vec3 color = vec3(1.);
    
    for(int i=0; i<3; i++) {
        float x = u_time;
        float tremor = d_shift*mix(sin(x), mix(sin(5.*x), mix(sin(5.*x), sin(12.*x), .9), .5), .2);
        float u_time_ch = u_time+tremor*float(i);
        // float u_time_ch = u_time;
        
        float d = distance(st, vec2(0.));
        mat2 rot;
        float r = sin(freq_rotate*PI*(d-u_time))-atan_mouse;
        rot[0] = vec2(cos(r), -sin(r));    
        rot[1] = vec2(sin(r), cos(r));
        vec2 st_new = rot*st;

        // d -= 1.*tremor;
        float pct = sin(freq_polar*atan(st_new.x, st_new.y))*sin((size_shrink)*PI*(shrink_mouse*d-u_time_ch))*.5+.5;
        pct = mix(0., pct, .5*random(st_new)+.5);
        color[i] = pct;
    }
	
    
    gl_FragColor = vec4(color,1.0);
}`;export{n as a,t as b,e as s};
