import"../chunks/DsnmJJEf.js";import"../chunks/BT3W6beP.js";import{f as u,e as p,t as f,a as d,s as t,c as v,n as g,r as h}from"../chunks/Q6qDtJCQ.js";import{s as x}from"../chunks/-KVrhg4G.js";import{H as y}from"../chunks/WpVhzMs_.js";import{G as n,e as G}from"../chunks/jprGjouH.js";import{a as L,b}from"../chunks/Bx3kpcER.js";const C=`#ifdef GL_ES
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
}`;var F=u('<!> <p class="annotation">Personal practice of GLSL. Try it in <img class="inline-icon" alt="Edit"/><a href="/glsl/editor">editor</a>.</p> <!>  <!> <!> <!> <!>',1);function T(l){var e=F(),r=p(e);y(r,{text:"GLSL shader"});var o=t(r,2),m=t(v(o));g(2),h(o);var s=t(o,2);n(s,{});var i=t(s,2);n(i,{get fragment_shader(){return L}});var a=t(i,2);n(a,{get fragment_shader(){return C}});var c=t(a,2);n(c,{get fragment_shader(){return k}});var _=t(c,2);n(_,{get fragment_shader(){return b}}),f(()=>x(m,"src",G)),d(l,e)}export{T as component};
