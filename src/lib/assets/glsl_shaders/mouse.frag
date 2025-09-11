// Author:
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
}