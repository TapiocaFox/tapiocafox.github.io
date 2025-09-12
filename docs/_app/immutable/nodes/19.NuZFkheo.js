import"../chunks/DsnmJJEf.js";import"../chunks/BT3W6beP.js";import{f as p,e as d,t as f,a as v,s as t,c as g,n as l,r as h}from"../chunks/Q6qDtJCQ.js";import{s as x}from"../chunks/-KVrhg4G.js";import{H as y}from"../chunks/WpVhzMs_.js";import{G as n,e as b}from"../chunks/BaSm1sUF.js";import{a as C,b as G}from"../chunks/CpuCMm-m.js";const L=`#ifdef GL_ES
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
}`,k=`// Author:
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
}`;var F=p('<!> <p class="annotation">Personal practice of GLSL. Try it in <img class="inline-icon" alt="Edit"/><a href="/glsl/editor">editor</a>.</p> <!>  <!> <!> <!> <!> <p class="annotation">My <a href="https://music.apple.com/us/playlist/psychedelic/pl.u-r2yBAdYCAMeYoe" target="_blank">Music</a> playlist to match the shader coding vibe.</p>',1);function H(m){var e=F(),s=d(e);y(s,{text:"GLSL shader"});var o=t(s,2),u=t(g(o));l(2),h(o);var r=t(o,2);n(r,{});var a=t(r,2);n(a,{get fragment_shader(){return C}});var i=t(a,2);n(i,{get fragment_shader(){return L}});var c=t(i,2);n(c,{get fragment_shader(){return k}});var _=t(c,2);n(_,{get fragment_shader(){return G}}),l(2),f(()=>x(u,"src",b)),v(m,e)}export{H as component};
