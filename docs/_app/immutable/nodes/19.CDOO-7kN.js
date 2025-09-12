import"../chunks/DsnmJJEf.js";import"../chunks/D8hk22ri.js";import{f as m,b as u,t as f,a as p,s as n,c as v,e as g,r as h}from"../chunks/BMnbXWX4.js";import{s as x}from"../chunks/CSaArZZj.js";import{H as C}from"../chunks/DQxZnCW_.js";import{G as t}from"../chunks/BxPDYzUk.js";import{a as y,s as L}from"../chunks/CX3tc_CR.js";const w=`// Author:
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
}`,b=`
// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

#define p_radius 0.2
#define t_delay 0.05
#define num_balls 10
#define PI 3.1415926535897932


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 l_directional = normalize(vec3(1., 1., 2.));
vec3 l_ambient = vec3(0.7,0.78,0.92);

void main() {
	vec4 color;
    for(int i=0; i<num_balls; i++) {
        vec2 st = gl_FragCoord.xy/u_resolution*2.-1.;
    	st.x *= u_resolution.x/u_resolution.y;
        
        for(int j=0; j<3; j++) {
            float u_time_ch = u_time+float(j)*t_delay;

            vec2 st_ch = st;
            st_ch.x -= sin(.5*u_time_ch+float(i));    
            st_ch.y -= sin(2.*u_time_ch+float(i));

            float z = sqrt(p_radius*p_radius-st_ch.x*st_ch.x-st_ch.y*st_ch.y);

            vec3 stp = vec3(st_ch, z);

            if(z>0.) {
                float diffuse = dot(normalize(stp), l_directional);
                color[j] = l_ambient[j]+diffuse;
                color[3] = 1.;
            }
        }
    }
	gl_FragColor = color;
}`,G="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";var k=m('<!> <p class="annotation">Personal practice of GLSL. Try it in <img class="inline-icon" alt="Edit"/><a href="/glsl/editor">editor</a>.</p> <!>  <!> <!> <!> <!>',1);function E(l){var o=k(),r=u(o);C(r,{text:"GLSL shader"});var e=n(r,2),_=n(v(e));g(2),h(e);var i=n(e,2);t(i,{});var s=n(i,2);t(s,{get fragment_shader(){return y}});var a=n(s,2);t(a,{get fragment_shader(){return L}});var c=n(a,2);t(c,{get fragment_shader(){return w}});var d=n(c,2);t(d,{get fragment_shader(){return b}}),f(()=>x(_,"src",G)),p(l,o)}export{E as component};
