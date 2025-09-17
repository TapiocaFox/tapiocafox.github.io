import"../chunks/DsnmJJEf.js";import{p as z,ax as k,f as x,e as v,a as i,b as C,s as u,x as I,o as e,y as P,r as d,n as w,g as F,c as T}from"../chunks/CoFMkNzq.js";import{i as A}from"../chunks/BYZrFled.js";import{e as S,i as G}from"../chunks/BPXvCmXZ.js";import{C as D}from"../chunks/DP8naOEI.js";import{H as L}from"../chunks/B4_N9QIG.js";import{G as j}from"../chunks/B-f6z6dR.js";import{d as E}from"../chunks/faFa0ZRN.js";import{a as q,b as B,s as M}from"../chunks/CjiA10hm.js";import{g as N}from"../chunks/CI2G2_CZ.js";const O=`// Author: TapiocaFox
// Title: Mouse

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
    st_mouse.x *= u_resolution.x/u_resolution.y;

    vec3 color_point = vec3(0., 1., 0.);
    vec3 color_grid = vec3(0.5, 0.5, 0.5);
    
	float pct = point(st, st_mouse);
    float pct_grid = grid(st);
    
    vec3 color = mix(vec3(1.), color_grid, pct_grid);
    color = mix(color, color_point, pct);
    gl_FragColor = vec4(color,1.0);
}`,H=`// Author: TapiocaFox
// Title: Fiber

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979
#define gap 0.1
#define half_stroke_size 0.0075
#define deg_r 0.2

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float calc_bg(vec2 st) {
    vec2 mod_st = mod(st, gap);
    vec2 pct_st = smoothstep(gap-half_stroke_size, gap, mod_st) + smoothstep(-half_stroke_size, 0., -mod_st);
    return max(pct_st.x, pct_st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*2.-1.;
    st.x *= u_resolution.x/u_resolution.y;

    vec2 st_mouse = u_mouse / u_resolution.xy * 2. - 1.;
    st_mouse.x *= u_resolution.x/u_resolution.y;
    
    mat2 rot;
    rot[0] = vec2(cos(deg_r), -sin(deg_r));    
    rot[1] = vec2(sin(deg_r), cos(deg_r));
    
    st = st*rot;
    st -= .5*st_mouse;
	
    st.x -= sin(3.*st.x-PI*u_time);      
    st.x -= sin(3.*st.y-PI*u_time);    
    st.y -= sin(3.*st.y+PI*u_time);
    st.y -= sin(3.*st.x+PI*u_time);
    
    vec3 color = vec3(0.);
    color = vec3(abs(.25*sin(st.x+.95*PI*u_time)+.75),abs(.25*sin(st.y+.75*PI*u_time)+.75),abs(.25*sin(.5*PI*u_time)+.75));
    
    float pct = calc_bg(st);
    
    color = mix(vec3(0.), color, pct);

    gl_FragColor = vec4(color,1.0);
}`,Y=`// Author: TapiocaFox
// Title: Array

#ifdef GL_ES
precision mediump float;
#endif

#define size_half_width .025
#define size_edge .005
#define size_half_interval .05
#define PI 3.14159265358979
#define rot_base -.005
#define scale_rot .5
#define scale_deg_r -0.01
#define ratio_rot_interval 0.25



uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 rot3d(vec3 stp, float alpha, float beta, float gamma) {
    mat3 rot;
    rot[0] = vec3(cos(alpha)*cos(beta), cos(alpha)*sin(beta)*sin(gamma)-sin(alpha)*cos(gamma), cos(alpha)*sin(beta)*cos(gamma)+sin(alpha)*sin(gamma));
    rot[1] = vec3(sin(alpha)*cos(beta), sin(alpha)*sin(beta)*sin(gamma)+cos(alpha)*cos(gamma), sin(alpha)*sin(beta)*cos(gamma)-cos(alpha)*sin(gamma));
    rot[2] = vec3(-sin(beta), cos(beta)*sin(gamma), cos(beta)*cos(gamma));
    return rot*stp;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*2.-1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    float deg_r = scale_deg_r*sin(ratio_rot_interval*u_time)+rot_base;
    mat2 rot2d;
    rot2d[0] = vec2(cos(deg_r), -sin(deg_r));    
    rot2d[1] = vec2(sin(deg_r), cos(deg_r));
    
    st = rot2d*st;
    
    vec3 color = vec3(0.);
    color = vec3(.5*sin(PI*(.25*st.x-u_time))+.5,.5*sin(PI*(.4*st.y-u_time))+.5,.5*sin(PI*u_time)+.5);
    
    vec2 st_block = st;
    st_block = mod(st_block-size_half_interval, 2.*size_half_interval)-size_half_interval;
    
    st_block = rot3d(vec3(st_block, 0.), scale_rot*PI*color.x-PI*.12, scale_rot*PI*color.y-PI*.2, scale_rot*PI*color.z-PI*.2).st;
    
    vec2 z_st_block = smoothstep(-size_half_width-size_edge, -size_half_width+size_edge, st_block)
        -smoothstep(-size_half_width+size_edge, -size_half_width-size_edge, -st_block);
    float z_block = min(z_st_block.x, z_st_block.y);
    
    
    gl_FragColor = vec4(mix(vec3(0.), color, z_block),1.0);
}`,W=`// Author: TapiocaFox
// Title: Colorful Snoise
// Snoise implementation is from: https://stegu.github.io/webgl-noise/webdemo/

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979
#define size_shrink_mouse 1.

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

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*2.-1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec2 st_mouse = u_mouse/u_resolution.xy *2. - 1.;
    st_mouse.x *= u_resolution.x/u_resolution.y;
    
    float atan_mouse = atan(st_mouse.x, st_mouse.y);
    float shrink_mouse = 1./(size_shrink_mouse*distance(st_mouse, vec2(0.)));

    vec3 color = vec3(0.);
    color = vec3(.5*sin(PI*(.25*st.x-u_time))+.5,.5*sin(PI*(.4*st.y-u_time))+.5,.5*sin(PI*u_time)+.5);
    
    float pct_noise_w = snoise(vec3(.8*shrink_mouse*st-vec2(.33*u_time), 0.7*u_time));
    float pct_noise_b = 2.*snoise(vec3(.9*shrink_mouse*st-vec2(.33*u_time), 0.5*u_time));
    
    color = mix(color, vec3(1.), pct_noise_w);    
    color = mix(color, vec3(0.), pct_noise_b);

    gl_FragColor = vec4(color,1.0);
}`;var J=x('<div class="item shader_item svelte-1xj01x5"><!></div>'),K=x('<!> <!> <h3>Practice One</h3> <p class="annotation">Abstract patterns animated over time. (Part of Assignment One.)</p> <div class="flex_grid gallery"></div>    <p class="annotation compact">Some of them are interactable with the mouse. I like to "vibe code" shaders with my <a href="https://music.apple.com/us/playlist/psychedelic/pl.u-r2yBAdYCAMeYoe" target="_blank">music playlist</a>.</p>',1);function te(p,f){z(f,!0);let n=P("all"),g=k([{shader:E,categories:[]},{shader:q,categories:["distortion"]},{shader:O,categories:[]},{shader:B,categories:[]},{shader:H,categories:["distortion"]},{shader:Y,categories:[]},{shader:M,categories:["noise"]},{shader:W,categories:["noise"]}]);var r=K(),a=v(r);L(a,{text:"GLSL shader"});var c=u(a,2);D(c,{names:["All categories","Editor","Noise","Distortion"],values:["all","editor","noise","distortion"],get selected_value(){return e(n)},callback:o=>{o=="editor"?N("/glsl/editor"):I(n,o,!0)}});var l=u(c,6);S(l,21,()=>g,G,(o,_)=>{var m=F(),h=v(m);{var y=t=>{var s=J(),b=T(s);j(b,{get fragment_shader(){return e(_).shader}}),d(s),i(t,s)};A(h,t=>{(e(n)=="all"||e(_).categories.includes(e(n)))&&t(y)})}i(o,m)}),d(l),w(2),i(p,r),C()}export{te as component};
