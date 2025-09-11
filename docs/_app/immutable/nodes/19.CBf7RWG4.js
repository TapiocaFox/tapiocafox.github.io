import"../chunks/DsnmJJEf.js";import"../chunks/D8hk22ri.js";import{f as l,b as u,t as p,a as f,s as e,c as g,e as v,r as _}from"../chunks/BMnbXWX4.js";import{s as h}from"../chunks/CSaArZZj.js";import{H as x}from"../chunks/DQxZnCW_.js";import{G as t}from"../chunks/C5n9svqR.js";import{a as C,s as L}from"../chunks/CX3tc_CR.js";const w=`// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

#define radius 0.033

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float point(vec2 st, vec2 center) {
    float dist = distance(st, center);
    return 1.-smoothstep(radius-.005, radius+.005, dist);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy *2. - 1.;
    vec2 st_mouse = u_mouse/u_resolution.xy *2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
	float pct = point(st, st_mouse);
    gl_FragColor = vec4(mix(vec3(1.), vec3(0., 1., 0.), pct),1.0);
}`,G="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";var V=l('<!> <p class="annotation">Personal practice of GLSL. Try it in <img class="inline-icon" alt="Edit"/><a href="/glsl/editor">editor</a>.</p> <!>  <!> <!> <!>',1);function E(c){var n=V(),r=u(n);x(r,{text:"GLSL shader"});var o=e(r,2),d=e(g(o));v(2),_(o);var s=e(o,2);t(s,{});var i=e(s,2);t(i,{get fragment_shader(){return C}});var a=e(i,2);t(a,{get fragment_shader(){return L}});var m=e(a,2);t(m,{get fragment_shader(){return w}}),p(()=>h(d,"src",G)),f(c,n)}export{E as component};
