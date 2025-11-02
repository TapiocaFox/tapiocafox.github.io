import"../chunks/DsnmJJEf.js";import{p as z,f as T,e as f,c as P,v as t,x as m,al as C,t as u,a as d,b as j,$ as q,s as e,n as U,w as M,r as N,az as Y,d as B}from"../chunks/8wfNHnlc.js";import{d as H}from"../chunks/D-MeLBsU.js";import{s as K}from"../chunks/BZt7ozeV.js";import{k as Z}from"../chunks/kaO3JiJY.js";import{h as X}from"../chunks/DZ4QJsDz.js";import{s as S}from"../chunks/d9TLXI1c.js";import{s as a}from"../chunks/CS34ykG-.js";import{p as D}from"../chunks/Ckzzh06f.js";import{T as Q}from"../chunks/De1n8GzK.js";import{t as V}from"../chunks/DnXzc5OT.js";const W=!0,fe=Object.freeze(Object.defineProperty({__proto__:null,prerender:W},Symbol.toStringTag,{value:"Module"})),$=""+new URL("../assets/favicon.BNVdPBgQ.ico",import.meta.url).href,J=`#version 300 es

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

// Noise snippet from Prof. Perlin.
vec3  _s(vec3 i) { return cos(5.*(i+5.*cos(5.*(i.yzx+5.*cos(5.*(i.zxy+5.*cos(5.*i))))))); }
float _t(vec3 i, vec3 u, vec3 a) { return dot(normalize(_s(i + a)), u - a); }
float noise(vec3 p) {
   vec3 i = floor(p), u = p - i, v = 2.*mix(u*u, u*(2.-u)-.5, step(.5,u));
   return mix(mix(mix(_t(i, u, vec3(0.,0.,0.)), _t(i, u, vec3(1.,0.,0.)), v.x),
                  mix(_t(i, u, vec3(0.,1.,0.)), _t(i, u, vec3(1.,1.,0.)), v.x), v.y),
              mix(mix(_t(i, u, vec3(0.,0.,1.)), _t(i, u, vec3(1.,0.,1.)), v.x),
                  mix(_t(i, u, vec3(0.,1.,1.)), _t(i, u, vec3(1.,1.,1.)), v.x), v.y), v.z);
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

    float pctNoise = .795*noise(vec3(.25*st-vec2(.05*uTime, .025*uTime), TIME_RATIO_NOISE*uTime))+.33;
	
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
}`;var ee=T('<link rel="icon"/> <meta name="theme-color" content="var(--fox-background-color)"/>  <meta property="og:title" content="TapiocaFox"/> <meta property="og:description" content="Hi, I am TapiocaFox. This is the website of me sharing personal works and demos."/> <meta property="og:image"/> <meta property="og:type" content="website"/>',1),oe=T('<a class="nav load slide-up svelte-12qhfyh" href="/projects">[Projects]</a> <a class="nav load adaptive-hide slide-up svelte-12qhfyh" href="/webgl_editor">[FoxGL]</a> <a class="nav load slide-up load-delay svelte-12qhfyh" href="/artworks">[Artworks]</a> <a class="nav load slide-up load-extra-delay svelte-12qhfyh" href="/patio">[Patio]</a>',1),te=T('<!> <nav id="main-nav"><a href="/">&gt; <span>Tapioca</span><span>Fox</span></a>  <!></nav> <!>',1);function ue(k,I){z(I,!0);let _=M(!0),s=M("var(--fox-primary-color)");const i=["var(--fox-primary-color)","LightGreen","Orchid","LightSeaGreen","DodgerBlue","DeepPink","Yellow"];let c=Y(()=>D.url.pathname.split("/")[1]||"");var h=te();X("12qhfyh",o=>{var r=ee();q.title="TapiocaFox";var n=f(r),v=e(n,8);U(2),u(()=>{S(n,"href",$),S(v,"content",V)}),d(o,r)});var g=f(h);Q(g,{mode:"background",show_status_block:!1,get fragment_shader(){return J}});var p=e(g,2),l=P(p);l.__click=async()=>{if(D.url.pathname==="/"){let o=Math.floor(Math.random()*i.length);for(;i[o]==t(s);)o=Math.floor(Math.random()*i.length);m(s,i[o],!0)}else m(s,"var(--fox-primary-color)");m(_,!1),await C(),m(_,!0)};var x=e(P(l));a(x,"",{},{"font-weight":"bold",color:"var(--fox-secondary-color)"});var w=e(x);let y;N(l);var F=e(l,2);Z(F,()=>t(_),o=>{var r=oe(),n=f(r);let v;var A=e(n,2);let O;var E=e(A,2);let R;var G=e(E,2);let b;u(()=>{v=a(n,"",v,{color:t(c)=="projects"?"var(--page-selected-color)":"unset"}),O=a(A,"",O,{color:t(c)=="webgl_editor"?"var(--page-selected-color)":"unset"}),R=a(E,"",R,{color:t(c)=="artworks"?"var(--page-selected-color)":"unset"}),b=a(G,"",b,{color:t(c)=="patio"?"var(--page-selected-color)":"unset"})}),d(o,r)}),N(p);var L=e(p,2);K(L,()=>I.children??B),u(()=>y=a(w,"",y,{"font-weight":"bold",color:t(s)})),d(k,h),j()}H(["click"]);export{ue as component,fe as universal};
