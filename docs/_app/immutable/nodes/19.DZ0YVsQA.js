import"../chunks/DsnmJJEf.js";import"../chunks/BT3W6beP.js";import{f as p,e as v,t as h,a as g,s as n,c as x,n as m,r as y}from"../chunks/Q6qDtJCQ.js";import{s as b}from"../chunks/-KVrhg4G.js";import{H as z}from"../chunks/WpVhzMs_.js";import{G as e,e as k}from"../chunks/CIcozKOY.js";import{a as I,b as P}from"../chunks/BC6LL0MR.js";const F=`// Author: TapiocaFox
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
    st_mouse.x *= u_resolution.x/u_resolution.y;
    
    vec3 color_point = vec3(0., 1., 0.);
    vec3 color_grid = vec3(0.5, 0.5, 0.5);
    
	float pct = point(st, st_mouse);
    float pct_grid = grid(st);
    
    vec3 color = mix(vec3(1.), color_grid, pct_grid);
    color = mix(color, color_point, pct);
    gl_FragColor = vec4(color,1.0);
}`,w=`// Author: TapiocaFox
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
    st_mouse.x *= u_resolution.x/u_resolution.y;
    
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
        color[i] = pct;
    }

    
    gl_FragColor = vec4(color,1.0);
}`,T=`// Author: TapiocaFox
// Title: Array

#ifdef GL_ES
precision mediump float;
#endif

#define size_half_width .025
#define size_edge .005
#define size_half_interval .05
#define PI 3.14159265358979
#define scale_rot .5
#define scale_distort 0.025


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 rot3d(vec3 stp, float alpha, float beta, float gamma) {
    mat3 rot;
    rot[0] = vec3(cos(alpha)*cos(beta), cos(alpha)*sin(beta)*sin(gamma)-sin(alpha)*cos(gamma), cos(alpha)*sin(beta)*cos(gamma)+sin(alpha)*sin(gamma));
    rot[1] = vec3(sin(alpha)*cos(beta), sin(alpha)*sin(beta)*sin(gamma)+cos(alpha)*cos(gamma), sin(alpha)*sin(beta)*cos(gamma)-cos(alpha)*sin(gamma));
    rot[2] = vec3(-sin(beta), cos(beta)*sin(gamma), cos(beta)*cos(gamma));
    return rot*stp;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*2.-1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    
    
    vec3 color = vec3(0.);
    color = vec3(.5*sin(PI*(.25*st.x-u_time))+.5,.5*sin(PI*(.4*st.y-u_time))+.5,.5*sin(PI*u_time)+.5);
    
    st.y += scale_distort*sin(color.x);    
    st.x += scale_distort*sin(color.z);

    
    vec2 st_block = st;
    st_block = mod(st_block-size_half_interval, 2.*size_half_interval)-size_half_interval;
    
    st_block = rot3d(vec3(st_block, 0.), scale_rot*PI*color.x-PI*.12, scale_rot*PI*color.y-PI*.2, scale_rot*PI*color.z-PI*.2).st;
    
    vec2 z_st_block = smoothstep(-size_half_width-size_edge, -size_half_width+size_edge, st_block)
        -smoothstep(-size_half_width+size_edge, -size_half_width-size_edge, -st_block);
    float z_block = min(z_st_block.x, z_st_block.y);
    
    
    gl_FragColor = vec4(mix(vec3(0.), color, z_block),1.0);
}`;var G=p('<!> <p class="annotation">These are my personal practice of GLSL. You can try it yourself in <img class="inline-glyph" alt="Edit"/><a href="/glsl/editor">the editor</a>.</p> <!>  <!> <!> <!> <!> <!> <!> <p class="annotation compact">Some of them are interactable with the mouse. I like to "vibe code" shaders with my <a href="https://music.apple.com/us/playlist/psychedelic/pl.u-r2yBAdYCAMeYoe" target="_blank">music playlist</a>.</p>',1);function H(u){var o=G(),s=v(o);z(s,{text:"GLSL shader"});var t=n(s,2),d=n(x(t));m(2),y(t);var i=n(t,2);e(i,{});var a=n(i,2);e(a,{get fragment_shader(){return I}});var r=n(a,2);e(r,{get fragment_shader(){return F}});var _=n(r,2);e(_,{get fragment_shader(){return P}});var c=n(_,2);e(c,{get fragment_shader(){return w}});var l=n(c,2);e(l,{get fragment_shader(){return C}});var f=n(l,2);e(f,{get fragment_shader(){return T}}),m(2),h(()=>b(d,"src",k)),g(u,o)}export{H as component};
