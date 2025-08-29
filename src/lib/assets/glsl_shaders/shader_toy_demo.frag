// Author:
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
}