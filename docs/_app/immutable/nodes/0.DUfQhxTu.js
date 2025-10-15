import"../chunks/DsnmJJEf.js";import{p as C,f as z,e as b,t as h,a as A,b as F,$ as k,s as e,n as L,c as O,r as E,d as j,i as a,az as $}from"../chunks/UuebQw-N.js";import{h as G}from"../chunks/0Kc8yRKs.js";import{s as U}from"../chunks/BkXAHTL8.js";import{s as R}from"../chunks/Bczg0Zq0.js";import{s as o}from"../chunks/CK7EHw7e.js";import{s as H,a as Y}from"../chunks/BNnMBqfr.js";import{s as q}from"../chunks/BySu6l2F.js";import{T as B}from"../chunks/BvgZ7pZh.js";import{i as K}from"../chunks/CrW3Vyoh.js";const Z=!0,pe=Object.freeze(Object.defineProperty({__proto__:null,prerender:Z},Symbol.toStringTag,{value:"Module"})),X=()=>{const n=q;return{page:{subscribe:n.page.subscribe},navigating:{subscribe:n.navigating.subscribe},updated:n.updated}},Q={subscribe(n){return X().page.subscribe(n)}},V=""+new URL("../assets/favicon.BNVdPBgQ.ico",import.meta.url).href,W=`#version 300 es

// Author: TapiocaFox
// Title: Fiber Bakcground

precision highp float;

#define PI 3.14159265358979
#define GAP 0.1
#define SIZE_HALF_STROKE 0.0075
#define RADIAN_ROTATION 0.4125
#define PIXELS_PER_UNIT 1200.*1.

#define TIME_RATIO_DISTORT 0.25
#define TIME_RATIO_NOISE 0.25
#define TIME_DELAY .5
#define TIME_FADE_IN_DURATION .5

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

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

float calc_background(vec2 st) {
    vec2 stMod = mod(st, GAP);
    vec2 pctSt = smoothstep(GAP-SIZE_HALF_STROKE, GAP, stMod) + smoothstep(-SIZE_HALF_STROKE, 0., -stMod);
    return max(pctSt.x, pctSt.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/PIXELS_PER_UNIT*2.-1.;

    mat2 rot;
    rot[0] = vec2(cos(RADIAN_ROTATION), -sin(RADIAN_ROTATION));    
    rot[1] = vec2(sin(RADIAN_ROTATION), cos(RADIAN_ROTATION));
    
    st = st*rot;

    float pctNoise = .795*snoise(vec3(.25*st-vec2(.05*uTime, .025*uTime), TIME_RATIO_NOISE*uTime))+.33;
	
    st.x -= sin(3.*st.x-PI*TIME_RATIO_DISTORT*uTime);      
    st.x -= sin(3.*st.y-PI*TIME_RATIO_DISTORT*uTime);    
    st.y -= sin(3.*st.y+PI*TIME_RATIO_DISTORT*uTime);
    st.y -= sin(3.*st.x+PI*TIME_RATIO_DISTORT*uTime);
    
    vec4 color = vec4(0., 0., 0., .0375);
    // color = vec4(0.298, 0.318, 0.427, .35);
    // color = vec4(0., 0., 0., .5);
    // color = vec3(abs(.25*sin(st.x+.95*PI*uTime)+.75),abs(.25*sin(st.y+.75*PI*uTime)+.75),abs(.25*sin(.5*PI*uTime)+.75));
    
    float pct = calc_background(st);
    
    color = mix(vec4(0., 0., 0., 0.), color, pct);
    color = mix(vec4(0., 0., 0., 0.), color, pctNoise);
    color = mix(vec4(0., 0., 0., 0.), color, step(TIME_DELAY, uTime)*smoothstep(TIME_DELAY, TIME_DELAY+TIME_FADE_IN_DURATION, uTime));

    fragColor = color;
    // gl_FragColor = vec4(1.,1,.1,.1.);
}`;var J=z('<link rel="icon"/> <meta name="theme-color" content="var(--fox-background-color)"/>  <meta property="og:title" content="TapiocaFox"/> <meta property="og:description" content="Hi, I am TapiocaFox. This is the website of me sharing personal works and demos."/> <meta property="og:image"/> <meta property="og:type" content="website"/>',1),ee=z('<!> <nav id="main-nav"><a href="/">&gt; <span>Tapioca</span><span>Fox</span></a>  <a href="/projects">[Projects]</a> <a href="/webgl_editor">[FoxGL]</a> <a href="/artworks">[Artworks]</a> <a href="/patio">[Patio]</a></nav> <!>',1);function le(n,c){C(c,!0);const w=()=>Y(Q,"$page",D),[D,N]=H();let t=$(()=>w().url.pathname.split("/")[1]||"");var l=ee();G(x=>{var r=J();k.title="TapiocaFox";var s=b(r),p=e(s,8);L(2),h(()=>{R(s,"href",V),R(p,"content",K)}),A(x,r)});var m=b(l);B(m,{mode:"background",show_status_block:!1,get fragment_shader(){return W}});var i=e(m,2),v=O(i),_=e(O(v));o(_,"",{},{"font-weight":"bold",color:"var(--fox-secondary-color)"});var S=e(_);o(S,"",{},{"font-weight":"bold",color:"var(--fox-primary-color)"}),E(v);var d=e(v,2);let u;var T=e(d,2);let y;var f=e(T,2);let I;var P=e(f,2);let g;E(i);var M=e(i,2);U(M,()=>c.children??j),h((x,r,s,p)=>{u=o(d,"",u,x),y=o(T,"",y,r),I=o(f,"",I,s),g=o(P,"",g,p)},[()=>({color:a(t)=="projects"?"var(--page-selected-color)":"unset"}),()=>({color:a(t)=="webgl_editor"?"var(--page-selected-color)":"unset"}),()=>({color:a(t)=="artworks"?"var(--page-selected-color)":"unset"}),()=>({color:a(t)=="patio"?"var(--page-selected-color)":"unset"})]),A(n,l),F(),N()}export{le as component,pe as universal};
