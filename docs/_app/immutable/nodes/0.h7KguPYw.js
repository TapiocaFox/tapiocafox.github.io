import"../chunks/DsnmJJEf.js";import{f as m,e as y,a,$ as u,t as h,s as n,c,r as x,n as g,d as z}from"../chunks/7KmB_8Bl.js";import{h as b}from"../chunks/0qSW_X5u.js";import{s as w}from"../chunks/CPipPcHU.js";import{s as C}from"../chunks/DliB0WGa.js";import{s as v}from"../chunks/DKwsPZ7O.js";import{T as P}from"../chunks/DpRD8hgM.js";import{d as I}from"../chunks/Dt_FDJKa.js";const T=!0,B=Object.freeze(Object.defineProperty({__proto__:null,prerender:T},Symbol.toStringTag,{value:"Module"})),k=""+new URL("../assets/favicon.BNVdPBgQ.ico",import.meta.url).href,F=`// Author: TapiocaFox
// Title: Fiber

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979
#define gap 0.1
#define half_stroke_size 0.0075
#define deg_r 0.4125
#define size_unit 1200.*1.
#define time_ratio_distort 0.25
#define time_ratio_noise 0.25
#define time_delay .5
#define time_fade_in .5
// #define opacity 0.25

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


vec3 mod289(vec3 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
	return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    // vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    // vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

float calc_bg(vec2 st) {
    vec2 mod_st = mod(st, gap);
    vec2 pct_st = smoothstep(gap-half_stroke_size, gap, mod_st) + smoothstep(-half_stroke_size, 0., -mod_st);
    return max(pct_st.x, pct_st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/size_unit*2.-1.;

    mat2 rot;
    rot[0] = vec2(cos(deg_r), -sin(deg_r));    
    rot[1] = vec2(sin(deg_r), cos(deg_r));
    
    st = st*rot;

    float pct_noise = .795*snoise(vec3(.25*st-vec2(.05*u_time, .025*u_time), time_ratio_noise*u_time))+.33;
	
    st.x -= sin(3.*st.x-PI*time_ratio_distort*u_time);      
    st.x -= sin(3.*st.y-PI*time_ratio_distort*u_time);    
    st.y -= sin(3.*st.y+PI*time_ratio_distort*u_time);
    st.y -= sin(3.*st.x+PI*time_ratio_distort*u_time);
    
    vec4 color = vec4(0., 0., 0., .0375);
    // color = vec4(0.298, 0.318, 0.427, .35);
    // color = vec4(0., 0., 0., .5);
    // color = vec3(abs(.25*sin(st.x+.95*PI*u_time)+.75),abs(.25*sin(st.y+.75*PI*u_time)+.75),abs(.25*sin(.5*PI*u_time)+.75));
    
    float pct = calc_bg(st);
    
    color = mix(vec4(0., 0., 0., 0.), color, pct);
    color = mix(vec4(0., 0., 0., 0.), color, pct_noise);
    color = mix(vec4(0., 0., 0., 0.), color, step(time_delay, u_time)*smoothstep(time_delay, time_delay+time_fade_in, u_time));

    gl_FragColor = color;
    // gl_FragColor = vec4(1.,1,.1,.1.);
}`;var j=m('<link rel="icon"/>'),D=m('<!> <nav id="main-nav"><a href="/">&gt; <span>Tapioca</span><span>Fox</span></a>  <a href="/projects">[Projects]</a> <a href="/artworks">[Artworks]</a> <a href="/patio">[Patio]</a></nav> <!>',1);function M(_,d){var o=D();b(f=>{var s=j();u.title="TapiocaFox",h(()=>C(s,"href",k)),a(f,s)});var t=y(o);P(t,{mode:"background",show_code_block:!1,get vertex_shader(){return I},get fragment_shader(){return F}});var e=n(t,2),r=c(e),i=n(c(r));v(i,"",{},{"font-weight":"bold",color:"var(--fox-secondary-color)"});var p=n(i);v(p,"",{},{"font-weight":"bold",color:"var(--fox-primary-color)"}),x(r),g(6),x(e);var l=n(e,2);w(l,()=>d.children??z),a(_,o)}export{M as component,B as universal};
