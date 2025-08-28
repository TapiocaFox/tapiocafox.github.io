#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float u_time;

void main() {
	gl_FragColor = vec4(pow(sin((u_time+PI)*3.), 2.0),pow(cos(u_time*3.), 2.0),0.0,1.0);
}