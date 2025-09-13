import"../chunks/DsnmJJEf.js";import"../chunks/BT3W6beP.js";import{f,e as p,t as v,a as g,s as n,c as h,n as m,r as x}from"../chunks/Q6qDtJCQ.js";import{s as y}from"../chunks/-KVrhg4G.js";import{H as k}from"../chunks/WpVhzMs_.js";import{G as e,e as b}from"../chunks/vCRCUJ9A.js";import{a as I,b as P}from"../chunks/DKQ5tbJx.js";const z=`// Author: TapiocaFox
// Title: Mouse

#ifdef GL_ES
precision mediump float;
#endif

#define radius 0.033
#define gap 0.1
#define half_stroke_size 0.005


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float point(vec2 st, vec2 center) {
    float dist = distance(st, center);
    return 1.-smoothstep(radius-.005, radius+.005, dist);
}

float grid(vec2 st) {
    vec2 mod_st = mod(st, gap);
    vec2 pct_st = smoothstep(gap-half_stroke_size, gap, mod_st) + smoothstep(-half_stroke_size, 0., -mod_st);
    return max(pct_st.x, pct_st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy *2. - 1.;
    vec2 st_mouse = u_mouse/u_resolution.xy *2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec3 color_point = vec3(0., 1., 0.);
    vec3 color_grid = vec3(0.5, 0.5, 0.5);
    
	float pct = point(st, st_mouse);
    float pct_grid = grid(st);
    
    vec3 color = mix(vec3(1.), color_grid, pct_grid);
    color = mix(color, color_point, pct);
    gl_FragColor = vec4(color,1.0);
}`,F=`// Author: TapiocaFox
// Title: Fiber

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979
#define gap 0.1
#define half_stroke_size 0.0075
#define deg_r 0.2

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float calc_bg(vec2 st) {
    vec2 mod_st = mod(st, gap);
    vec2 pct_st = smoothstep(gap-half_stroke_size, gap, mod_st) + smoothstep(-half_stroke_size, 0., -mod_st);
    return max(pct_st.x, pct_st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*2.-1.;
    st.x *= u_resolution.x/u_resolution.y;

    vec2 st_mouse = u_mouse / u_resolution.xy * 2. - 1.;
    
    mat2 rot;
    rot[0] = vec2(cos(deg_r), -sin(deg_r));    
    rot[1] = vec2(sin(deg_r), cos(deg_r));
    
    st = st*rot;
    st -= .5*st_mouse;
	
    st.x -= sin(3.*st.x-PI*u_time);      
    st.x -= sin(3.*st.y-PI*u_time);    
    st.y -= sin(3.*st.y+PI*u_time);
    st.y -= sin(3.*st.x+PI*u_time);
    
    vec3 color = vec3(0.);
    color = vec3(abs(.25*sin(st.x+.95*PI*u_time)+.75),abs(.25*sin(st.y+.75*PI*u_time)+.75),abs(.25*sin(.5*PI*u_time)+.75));
    
    float pct = calc_bg(st);
    
    color = mix(vec3(0.), color, pct);

    gl_FragColor = vec4(color,1.0);
}`,C=`// Author: TapiocaFox
// Title: Radiant

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932
#define size_shrink 2.
#define size_shrink_mouse 1.
#define freq_polar 4.
#define freq_rotate 0.4
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
        color[i] = pct;
    }

    
    gl_FragColor = vec4(color,1.0);
}`;var G=f('<!> <p class="annotation">These are my personal practice of GLSL. You can try it yourself in <img class="inline-glyph" alt="Edit"/><a href="/glsl/editor">the editor</a>.</p> <!>  <!> <!> <!> <!> <!> <p class="annotation compact">Some of them are interactable with the mouse. I like to "vibe code" shaders with my <a href="https://music.apple.com/us/playlist/psychedelic/pl.u-r2yBAdYCAMeYoe" target="_blank">music playlist</a>.</p>',1);function B(u){var o=G(),s=p(o);k(s,{text:"GLSL shader"});var t=n(s,2),l=n(h(t));m(2),x(t);var i=n(t,2);e(i,{});var r=n(i,2);e(r,{get fragment_shader(){return I}});var a=n(r,2);e(a,{get fragment_shader(){return z}});var _=n(a,2);e(_,{get fragment_shader(){return P}});var c=n(_,2);e(c,{get fragment_shader(){return F}});var d=n(c,2);e(d,{get fragment_shader(){return C}}),m(2),v(()=>y(l,"src",b)),g(u,o)}export{B as component};
