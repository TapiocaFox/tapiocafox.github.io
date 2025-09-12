// Author:
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

float line(vec2 st) {
    vec2 mod_st = mod(st, gap);
    vec2 pct_st = smoothstep(gap-half_stroke_size, gap, mod_st) + smoothstep(-half_stroke_size, 0., -mod_st);
    return max(pct_st.x, pct_st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy *2. - 1.;
    vec2 st_mouse = u_mouse/u_resolution.xy *2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec3 color_point = vec3(0., 1., 0.);
    vec3 color_line = vec3(0.5, 0.5, 0.5);
    
	float pct = point(st, st_mouse);
    float pct_line = line(st);
    
    vec3 color = mix(vec3(1.), color_line, pct_line);
    color = mix(color, color_point, pct);
    gl_FragColor = vec4(color,1.0);
}