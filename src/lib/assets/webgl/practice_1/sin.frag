#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979
#define ratio_speed .5

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
    st_mouse.x *= u_resolution.x/u_resolution.y;
    st.x -= st_mouse.x;
    
	float y = sin(PI*(st.x - u_time*ratio_speed));
    
    float pct = plot(st, y);
    
    vec3 color = (1.0-pct)*y+pct*vec3(0.0, 1.0, 0.0);

    gl_FragColor = vec4(color,1.0);
}