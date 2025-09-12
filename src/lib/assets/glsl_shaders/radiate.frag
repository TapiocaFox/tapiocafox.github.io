// Author: TapiocaFox
// Title: Radiant

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932
#define size_shrink 2.
#define freq_polar 4.
#define freq_rotate 0.3
#define t_delay .075
#define d_shift .2


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*2. -1.;
    st.x *= u_resolution.x/u_resolution.y;
    vec2 st_mouse = u_mouse/u_resolution.xy *2. - 1.;
    float atan_mouse = atan(st_mouse.x, st_mouse.y);
    
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
        float pct = sin(freq_polar*atan(st_new.x, st_new.y))*sin(size_shrink*PI*(d-u_time_ch))*.5+.5;
        color[i] = pct;
    }

    
    gl_FragColor = vec4(color,1.0);
}