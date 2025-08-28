import"../chunks/DsnmJJEf.js";import"../chunks/UZBDKW3R.js";import{f as s,b as m,a as f,s as o}from"../chunks/DZnnTQCO.js";import{H as p}from"../chunks/DBAKjFB5.js";import{G as e}from"../chunks/KvbYOa_T.js";const d=`#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float u_time;

void main() {
	gl_FragColor = vec4(pow(sin((u_time+PI)*3.), 2.0),pow(cos(u_time*3.), 2.0),0.0,1.0);
}`;var l=s('<!> <p class="annotation">Personal practice of GLSL. Try it in <a href="/glsl/editor">editor</a>.</p> <!> <!>',1);function h(t){var r=l(),n=m(r);p(n,{text:"GLSL shader"});var a=o(n,4);e(a,{});var i=o(a,2);e(i,{get fragment_shader(){return d}}),f(t,r)}export{h as component};
