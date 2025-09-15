import"../chunks/DsnmJJEf.js";import"../chunks/Bvo1SZU0.js";import{f as C,e as M,t as I,a as T,c as o,s as e,r as t,n as j}from"../chunks/5P0DxIqm.js";import{s as n}from"../chunks/C7wQ__Zc.js";import{s as i}from"../chunks/SZkX4o5f.js";import{E as G}from"../chunks/Do1eGo3c.js";import{s as H}from"../chunks/FdPFTxOh.js";import{g as F}from"../chunks/Dh8Z0_-g.js";import{G as S}from"../chunks/tWvufU6L.js";const V=""+new URL("../assets/profile.DSZnngLP.png",import.meta.url).href,D=""+new URL("../assets/spiral_2.MDrUTnHe.png",import.meta.url).href,P="data:image/svg+xml,%3c?xml%20version='1.0'%20?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20xmlns='http://www.w3.org/2000/svg'%3e%3ctitle/%3e%3cg%20id='Complete'%3e%3cg%20id='mail'%3e%3cg%3e%3cpolyline%20fill='none'%20points='4%208.2%2012%2014.1%2020%208.2'%20stroke='%23000000'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='2'/%3e%3crect%20fill='none'%20height='14'%20rx='2'%20ry='2'%20stroke='%23000000'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='2'%20width='18'%20x='3'%20y='6.5'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e",R="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M9%2017H15M9%2013H15M9%209H10M13%203H8.2C7.0799%203%206.51984%203%206.09202%203.21799C5.71569%203.40973%205.40973%203.71569%205.21799%204.09202C5%204.51984%205%205.0799%205%206.2V17.8C5%2018.9201%205%2019.4802%205.21799%2019.908C5.40973%2020.2843%205.71569%2020.5903%206.09202%2020.782C6.51984%2021%207.0799%2021%208.2%2021H15.8C16.9201%2021%2017.4802%2021%2017.908%2020.782C18.2843%2020.5903%2018.5903%2020.2843%2018.782%2019.908C19%2019.4802%2019%2018.9201%2019%2017.8V9M13%203L19%209M13%203V7.4C13%207.96005%2013%208.24008%2013.109%208.45399C13.2049%208.64215%2013.3578%208.79513%2013.546%208.89101C13.7599%209%2014.0399%209%2014.6%209H19'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e",L="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20fill='%23000000'%20width='800px'%20height='800px'%20viewBox='-2%20-2%2024%2024'%20xmlns='http://www.w3.org/2000/svg'%20preserveAspectRatio='xMinYMin'%20class='jam%20jam-linkedin-square'%3e%3cpath%20d='M15%2011.13v3.697h-2.143v-3.45c0-.866-.31-1.457-1.086-1.457-.592%200-.945.398-1.1.784-.056.138-.071.33-.071.522v3.601H8.456s.029-5.842%200-6.447H10.6v.913l-.014.021h.014v-.02c.285-.44.793-1.066%201.932-1.066%201.41%200%202.468.922%202.468%202.902zM6.213%205.271C5.48%205.271%205%205.753%205%206.385c0%20.62.466%201.115%201.185%201.115h.014c.748%200%201.213-.496%201.213-1.115-.014-.632-.465-1.114-1.199-1.114zm-1.086%209.556h2.144V8.38H5.127v6.447z'/%3e%3cpath%20d='M4%202a2%202%200%200%200-2%202v12a2%202%200%200%200%202%202h12a2%202%200%200%200%202-2V4a2%202%200%200%200-2-2H4zm0-2h12a4%204%200%200%201%204%204v12a4%204%200%200%201-4%204H4a4%204%200%200%201-4-4V4a4%204%200%200%201%204-4z'/%3e%3c/svg%3e",q=`// Author: TapiocaFox
// Title: Fiber

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979
#define gap 0.1
#define half_stroke_size 0.0075
#define deg_r 0.4
#define size_unit 1200.
#define time_ratio_distort 0.25
#define time_ratio_noise 0.25
#define time_delay 2.
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

    float pct_noise = snoise(vec3(.25*st-vec2(.05*u_time, .025*u_time), time_ratio_noise*u_time))+.25;
	
    st.x -= sin(3.*st.x-PI*time_ratio_distort*u_time);      
    st.x -= sin(3.*st.y-PI*time_ratio_distort*u_time);    
    st.y -= sin(3.*st.y+PI*time_ratio_distort*u_time);
    st.y -= sin(3.*st.x+PI*time_ratio_distort*u_time);
    
    vec4 color = vec4(0., 0., 0., .035);
    // color = vec4(0., 0., 0., .5);
    // color = vec3(abs(.25*sin(st.x+.95*PI*u_time)+.75),abs(.25*sin(st.y+.75*PI*u_time)+.75),abs(.25*sin(.5*PI*u_time)+.75));
    
    float pct = calc_bg(st);
    
    color = mix(vec4(0., 0., 0., 0.), color, pct);
    color = mix(vec4(0., 0., 0., 0.), color, pct_noise);
    color = mix(vec4(0., 0., 0., 0.), color, step(time_delay, u_time)*smoothstep(time_delay, time_delay+time_fade_in, u_time));

    gl_FragColor = color;
    // gl_FragColor = vec4(1.,1,.1,.1.);
}`;var U=C('<!> <div class="align-with-nav"><h1>TapiocaFox 🦊</h1> <div class="icon-description-layout"><div class="icon fade-in"><img alt="Profile"/></div> <div class="description"><div><h3>Yves Chen</h3> <p class="bold-annotation"><img class="inline-glyph" alt="GitHub"/> <a href="https://github.com/TapiocaFox" target="_blank">TapiocaFox</a><br/> <img class="inline-glyph" alt="Email"/> <a href="mailto:contact@tapiocafox.com?subject=Email%20From%20tapiocafox.com">contact@tapiocafox.com</a><br/> <img class="inline-glyph" alt="Resume"/> <a href="https://drive.google.com/file/d/1q949zLDJBIJn8srw5MWjQ9UIJE_ksLM7/view" target="_blank">Resume</a> <img class="inline-glyph" alt="LinkedIn"/> <a href="https://www.linkedin.com/in/yves-chen-991949161/" target="_blank">LinkedIn</a><br/></p> <p class="annotation">*I am the one on the left.</p></div></div></div> <hr class="dashed fade-in load-delay"/> <p class="compact fade-in load-delay">Hi, I am TapiocaFox. I’m the creator of the retro game management software <a href="https://github.com/TapiocaFox/Daijishou" target="_blank">Daijishō</a> (~1M downloads). This is the website of me sharing personal works and demos. I enjoy building frameworks that can interact efficiently and easy to understand.</p>  <img alt="Spiral 1" class="sqaure_item fade-in load-delay svelte-r3rnwu"/> <img alt="Spiral 2" class="sqaure_item fade-in load-delay svelte-r3rnwu"/> <!></div>',1);function Z(w){var l=U(),m=M(l);S(m,{mode:"background",show_code_block:!1,get fragment_shader(){return q}});var v=e(m,2),d=o(v);i(d,"",{},{"margin-block-end":"0.3em"});var a=e(d,2),s=o(a),p=o(s);i(p,"",{},{"border-radius":"var(--sharper-radius)",margin:"1rem 0",width:"125px",height:"125px"}),t(s);var x=e(s,2),_=o(x),g=o(_);i(g,"",{},{"margin-block-end":"0.0em"});var r=e(g,2),h=o(r),f=e(h,5),y=e(f,5),b=e(y,4);j(3),t(r);var z=e(r,2);i(z,"",{},{"margin-block-start":"0.0em"}),t(_),t(x),t(a);var c=e(a,6);i(c,"",{},{float:"left"});var u=e(c,2),k=e(u,2);G(k,{}),t(v),I(()=>{n(p,"src",V),n(h,"src",F),n(f,"src",P),n(y,"src",R),n(b,"src",L),n(c,"src",H),n(u,"src",D)}),T(w,l)}export{Z as component};
