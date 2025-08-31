import"../chunks/DsnmJJEf.js";import"../chunks/B9ZERAFZ.js";import{f as s,b as f,a as m,s as n,e as c}from"../chunks/B3wgZHys.js";import{H as u}from"../chunks/D2TSHr8c.js";import{G as e}from"../chunks/niBwFHvJ.js";const v=`#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float u_time;

void main() {
	gl_FragColor = vec4(pow(sin((u_time+PI)*3.), 2.0),pow(cos(u_time*3.), 2.0),0.0,1.0);
}`,d=`// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
// by nikos papadopoulos, 4rknova / 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

#define AA 4.

#define CI vec3(.3,.5,.6)
#define CO vec3(0.0745, 0.0862, 0.1058)
#define CM vec3(.0)
#define CE vec3(.8,.7,.5)

float metaball(vec2 p, float r)
{
	return r / dot(p, p);
}

vec3 samplef(in vec2 uv)
{
	float t0 = sin(u_time * 1.9) * .46;
	float t1 = sin(u_time * 2.4) * .49;
	float t2 = cos(u_time * 1.4) * .57;

	float r = metaball(uv + vec2(t0, t2), .33) *
			  metaball(uv - vec2(t0, t1), .27) *
			  metaball(uv + vec2(t1, t2), .59);

	vec3 c = (r > .4 && r < .7)
			  ? (vec3(step(.1, r*r*r)) * CE)
			  : (r < .9 ? (r < .7 ? CO: CM) : CI);

	return c;
}

void main() {
    vec2 uv = (gl_FragCoord.xy / u_resolution.xy * 2. - 1.)
            * vec2(u_resolution.x / u_resolution.y, 1.0) * 1.25;

    vec3 col = vec3(0.0);

    float e = 1.0 / min(u_resolution.y , u_resolution.x);
    for (float i = -AA; i < AA; ++i) {
        for (float j = -AA; j < AA; ++j) {
            col += samplef(uv + vec2(i, j) * (e/AA)) / (4.0*AA*AA);
        }
    }

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;var p=s('<!> <p class="annotation">Personal practice of GLSL. Try it in <a href="/glsl/editor">editor</a>.</p> <!> <!> <!> <p class="annotation">The third one is <a href="https://www.shadertoy.com/view/XsXGRS" target="_blank">The Blob</a> from shadertoy. (Using it to see if GLSL uniforms in three.js and shadertoy are interchangable.)</p>',1);function b(i){var t=p(),o=f(t);u(o,{text:"GLSL shader"});var r=n(o,4);e(r,{});var a=n(r,2);e(a,{get fragment_shader(){return v}});var l=n(a,2);e(l,{get fragment_shader(){return d}}),c(2),m(i,t)}export{b as component};
