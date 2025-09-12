import"../chunks/DsnmJJEf.js";import"../chunks/BT3W6beP.js";import{f as d,e as f,t as v,a as g,s as t,c as h,n as l,r as x}from"../chunks/Q6qDtJCQ.js";import{s as y}from"../chunks/-KVrhg4G.js";import{H as b}from"../chunks/WpVhzMs_.js";import{G as n,e as I}from"../chunks/8IHZiSoD.js";import{a as P,b as k}from"../chunks/CpuCMm-m.js";const C=`#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float pct) {
    return smoothstep(pct-0.02, pct,st.y) - smoothstep(pct, pct+0.02,st.y);
    
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy * 2.0 - 1.0;
    st.x *= u_resolution.x/u_resolution.y;

    vec2 st_mouse = u_mouse / u_resolution.xy * 2.0 - 1.0;
    st.x -= st_mouse.x;
    
	float y = sin(PI*(st.x - u_time));
    
    float pct = plot(st, y);
    
    vec3 color = (1.0-pct)*y+pct*vec3(0.0, 1.0, 0.0);

    gl_FragColor = vec4(color,1.0);
}`,G=`// Author:
// Title:

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
}`,L=`// Author:
// Title:

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
    
    mat2 rot;
    rot[0] = vec2(cos(deg_r), -sin(deg_r));    
    rot[1] = vec2(sin(deg_r), cos(deg_r));
    
    st = st*rot;
    
    st -= 0.005*u_mouse;
	
    st.x -= sin(3.*st.x-PI*u_time);      
    st.x -= sin(3.*st.y-PI*u_time);    
    st.y -= sin(3.*st.y+PI*u_time);
    st.y -= sin(3.*st.x+PI*u_time);
    
    vec3 color = vec3(0.);
    color = vec3(abs(.25*sin(st.x+.95*PI*u_time)+.75),abs(.25*sin(st.y+.75*PI*u_time)+.75),abs(.25*sin(.5*PI*u_time)+.75));
    
    float pct = calc_bg(st);
    
    color = mix(vec3(0.), color, pct);

    gl_FragColor = vec4(color,1.0);
}`;var z=d('<!> <p class="annotation">These are my personal practice of GLSL. You can try it yourself in <img class="inline-glyph" alt="Edit"/><a href="/glsl/editor">the editor</a>.</p> <!>  <!> <!> <!> <!> <!> <p class="annotation compact">Some of them are interactable with the mouse. I like to "vibe code" shaders with my <a href="https://music.apple.com/us/playlist/psychedelic/pl.u-r2yBAdYCAMeYoe" target="_blank">music playlist</a>.</p>',1);function w(m){var o=z(),s=f(o);b(s,{text:"GLSL shader"});var e=t(s,2),u=t(h(e));l(2),x(e);var r=t(e,2);n(r,{});var i=t(r,2);n(i,{get fragment_shader(){return P}});var a=t(i,2);n(a,{get fragment_shader(){return C}});var c=t(a,2);n(c,{get fragment_shader(){return G}});var _=t(c,2);n(_,{get fragment_shader(){return k}});var p=t(_,2);n(p,{get fragment_shader(){return L}}),l(2),v(()=>y(u,"src",I)),g(m,o)}export{w as component};
