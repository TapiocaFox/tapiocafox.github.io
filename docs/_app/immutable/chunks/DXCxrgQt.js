import"./DsnmJJEf.js";import{o as vt,a as pt}from"./DV4HuBXD.js";import{p as xt,aH as M,ac as wt,f as K,e as V,t as N,a as C,b as _t,i as T,k as p,j as I,at as bt,c as F,n as yt,r as D,s as G,g as St,aA as Rt,a_ as Lt}from"./DuvEInI2.js";import{d as Pt,s as W}from"./7z5teZwa.js";import{p as w,i as at}from"./CjISyPlu.js";import{e as Tt,i as At}from"./C1OkaSYx.js";import{s as Et}from"./VGIlh5vR.js";import{s as Y}from"./DbemgwNU.js";import{s as st}from"./Dqri1z1Q.js";import{b as X}from"./CDnwwIrz.js";import{P as kt}from"./CpjGdiVG.js";import{g as Mt}from"./DhYJdPgx.js";import{w as Ft}from"./CIU2_X1e.js";const Dt=`#version 300 es

// Author: TapiocaFox
// Title:  Default Vertex Shader

in  vec3 aPos;
out vec3 vPos;

void main() {
    gl_Position = vec4(aPos, 1.);
    vPos = aPos;
}`,Gt=`#version 300 es

// Author: TapiocaFox
// Title:  Default Fragment Shader

precision highp float;

#define PI 3.1415926535897932384
#define SIZE_HALF_STROKE 0.015

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float plot_xy(vec3 stp, float y_at_x) {
    return smoothstep(y_at_x-SIZE_HALF_STROKE, y_at_x, stp.y) - smoothstep(y_at_x, y_at_x+SIZE_HALF_STROKE, stp.y);
}

void main() {
    float pct = plot_xy(vPos, sin(PI*(vPos.x-.5*uTime)));
    vec3 color = vec3(.5*vPos.x+.5, .5*vPos.y+.5, .5*sin(.5*PI*(-uTime))+.5);
    color = mix(color, vec3(1.), pct);
    fragColor = vec4(color, 1.);
}`,Ot=`// Author: TapiocaFox
// Title:  Default Renderer

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, resizeObserver;

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;

    // Set status title.
    foxGL.setStatusTitle('Default Renderer');

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);

    // Render per animation frame.
    function animate() {
        if(destroyed) return;
        requestAnimationFrame(animate);
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
        foxGL.render();
    }
    
    // Declare listeners.
    onpointermove = async event => {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    };
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    });
        
    // Register listeners on start.
    canvas.addEventListener('pointermove', onpointermove);
    resizeObserver.observe(canvas);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(resizeObserver) resizeObserver.disconnect();
};`,Ut="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";function Ct(){const u=new Map,c=new Set;function f(e,s){for(const a of c)a(e,s)}function _(e){if(!e)return"unknown module";for(const[s,a]of u.entries())if(a.url===e||e.includes(a.url))return s;return"unknown module"}function b(e){const s=_(e.filename);f(s,e.error??e.message)}function R(e){let s="unknown module";if(e.reason instanceof Error&&e.reason.stack){const a=e.reason.stack;for(const A of u.values())if(a.includes(A.url)){s=_(A.url);break}}f(s,e.reason)}return window.addEventListener("error",b),window.addEventListener("unhandledrejection",R),{register(e,s){const a=u.get(e);a?.url&&URL.revokeObjectURL(a.url);const A=s.replace(/import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g,(d,S)=>{const g=u.get(S);return g?d.replace(S,g.url):d}),B=new Blob([A],{type:"application/javascript"}),y=URL.createObjectURL(B);return u.set(e,{code:s,url:y,exports:null}),y},async import(e){const s=u.get(e);if(!s)throw new Error(`Module "${e}" not found`);try{const a=await import(s.url);return s.exports=a,a}catch(a){throw f(e,a),a}},async replace(e,s){this.register(e,s),await this.reloadAll()},async reloadAll(){for(const[e,s]of u.entries())try{const a=await import(s.url);s.exports=a}catch(a){f(e,a),console.error(`Failed to reload module "${e}":`,a)}},clear(){for(const e of u.values())URL.revokeObjectURL(e.url);u.clear(),c.clear(),window.removeEventListener("error",b),window.removeEventListener("unhandledrejection",R)},addUncaughtErrorListener(e){c.add(e)},removeUncaughtErrorListener(e){c.delete(e)}}}const re="fgl",It=Ft(null);function Bt(u,c,f,_,b){It.set({name:"",timestamp:0,img:"",vert:c(),frag:f(),js:_(),assets:b()}),Mt("/webgl_editor")}var jt=K("<br/><span> </span>",1),Ht=K('<div><h3> </h3> <p class="annotation"> <!></p></div>'),zt=K('<button><img class="inline-glyph" alt="Edit"/>Edit</button> <!> <canvas></canvas>',1);function oe(u,c){xt(c,!0);let f=w(c,"vertex_shader",27,()=>M(Dt)),_=w(c,"fragment_shader",27,()=>M(Gt)),b=w(c,"javascript",27,()=>M(Ot)),R=w(c,"assets",27,()=>M({})),e=w(c,"mode",3,"default"),s=w(c,"size",3,250),a=w(c,"show_status_block",3,!0),A=w(c,"background_color",3,"transparent"),B=w(c,"onglinit",3,async function(i){return!0}),y=w(c,"onerror",3,async function(i,P){console.trace(P)});var d,S,g;let O=I(!1),L=I(!1),Z=I(0),j=I("Rendering Status"),H=M({});const it=.5,U=32;let v;const q=(i,P)=>{console.log("module:",i,`
error:`,P),y()("js",{module:i,error:P})};wt(()=>{f(),_(),b(),R(),v&&(v.newProgram(),v.setShadersScriptAndAssets(f(),_(),b(),R()),v.refreshShadersAndScript())}),vt(async()=>{try{const i=d.getContext("webgl2",{preserveDrawingBuffer:e()=="in-editor"});v={gl:i,canvas:d,program:i.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:T(j),statusDict:H,vertexShader:"",fragmentShader:"",sandbox:Ct(),indexModule:null,assets:{},async start(){try{await this.indexModule?.start?.(this)}catch(t){y()("js",{module:"index",error:t})}},async stop(){try{await this.indexModule?.stop?.(this)}catch(t){y()("js",{module:"index",error:t})}},async optimizeViewPort(){const t=this.gl,r=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),o=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==r||this.canvas.height!==o)&&(this.canvas.width=r,this.canvas.height=o,t.viewport(0,0,r,o)),await bt()},initProgram(t,r){const o=this.gl,l=(n,h)=>{const x=o.createShader(n);o.shaderSource(x,h),o.compileShader(x);const m=o.getShaderInfoLog(x);if(!o.getShaderParameter(x,o.COMPILE_STATUS)||m?.trim().length)throw`Cannot compile shader: ${m}`;o.attachShader(this.program,x)};try{l(o.VERTEX_SHADER,t)}catch(n){throw y()("vert",n),n}try{l(o.FRAGMENT_SHADER,r)}catch(n){throw y()("frag",n),n}if(o.linkProgram(this.program),!o.getProgramParameter(this.program,o.LINK_STATUS))throw`Cannot link program:
${o.getProgramInfoLog(this.program)}`;o.useProgram(this.program)},async importIndexModule(){try{this.indexModule=await this.sandbox.import("index")}catch(t){y()("js",{module:"index",error:t})}},render(){const t=this.gl,r=Date.now();p(Z,1e3/(r-this.lastRenderTime)),this.lastRenderTime=r,t.drawArrays(t.TRIANGLES,0,6)},newProgram(){const t=this.gl;t.getAttachedShaders(this.program)?.forEach(o=>{t.detachShader(this.program,o),t.deleteShader(o)}),t.deleteProgram(this.program),this.program=t.createProgram()},async reset(){const t=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const r=this.statusDict;for(const o in r)delete r[o];this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setShadersScriptAndAssets(t,r,o,l){this.vertexShader=t,this.fragmentShader=r,this.sandbox.register("index",o),this.assets=l},async refreshShadersAndScript(){await this.stop(),await this.optimizeViewPort();const t=this.statusDict;for(const r in t)delete t[r];this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setStatusTitle(t){p(j,t,!0)},reportStatus(t,r,o="inherit"){this.statusDict[t]={text:r,color:o}},async getAssetById(t){const r=this.assets[t];if(typeof r>"u"||r==null)throw`Asset with id "${t}" does not exist.`;if(r.type=="image")return new Promise((o,l)=>{const n=new Image;n.crossOrigin="anonymous",n.onload=()=>o(n),n.onerror=h=>l(h),n.src=r.src,n.complete&&o(n)});if(r.type==="audio")return new Promise((o,l)=>{const n=new Audio;n.crossOrigin="anonymous",n.oncanplaythrough=()=>o(n),n.onerror=h=>l(h),n.src=r.src,n.load()});throw"Not implemented"}},v.sandbox.addUncaughtErrorListener(q),new ResizeObserver(t=>{v.optimizeViewPort()}).observe(d),d.addEventListener("pointermove",async t=>{const r=d.getBoundingClientRect(),o=r.bottom-r.top;if(a()){p(O,!0),e()=="default"&&p(L,!0);const{clientX:l,clientY:n}=t,h=window.innerWidth,x=window.innerHeight,m=S.offsetWidth,k=S.offsetHeight;(r.left+r.right)*.5<=h*it?(S.animate({left:`${Math.min(l+U,h-m)}px`,top:`${Math.min(n+U,x-k)}px`},{fill:"forwards"}),g.animate({left:`${r.left}px`,top:`${r.bottom+4}px`},{fill:"forwards"})):(S.animate({right:`${Math.max(h-l+U,0)}px`,top:`${Math.min(n+U,x-k)}px`},{fill:"forwards"}),g.animate({right:`${h-r.right}px`,top:`${r.bottom+4}px`},{fill:"forwards"}))}}),d.addEventListener("pointerleave",async t=>{if(p(O,!1),g==null)return;const r=d.getBoundingClientRect(),o=g.getBoundingClientRect();if(a()){const{clientX:l,clientY:n}=t;o.left<=l&&l<=o.right&&n>r.top?p(L,!0):p(L,!1)}}),document.addEventListener("scroll",async t=>{p(O,!1),p(L,!1)},!0),d.addEventListener("webglcontextlost",async t=>{t.preventDefault(),console.warn("GLSL canvas WebGL context lost!")});const et=await B()(v);v.setShadersScriptAndAssets(f(),_(),b(),R()),et&&await v.refreshShadersAndScript()}catch(i){console.trace(i)}g.onpointerenter=async i=>{e()=="default"&&p(L,!0)},g.onpointerleave=async i=>{p(L,!1)}}),pt(()=>{v?.sandbox.removeUncaughtErrorListener(q)});var J=zt(),E=V(J);E.__click=[Bt,f,_,b,R];var ct=F(E);yt(),D(E),X(E,i=>g=i,()=>g);var Q=G(E,2);{var lt=i=>{kt(i,{target:"body",children:(P,et)=>{var t=Ht(),r=F(t),o=F(r,!0);D(r);var l=G(r,2),n=F(l),h=G(n);{var x=m=>{var k=St(),dt=V(k);Tt(dt,17,()=>Object.entries(H),At,(ut,ht)=>{var mt=Rt(()=>Lt(T(ht),2));let rt=()=>T(mt)[1];var ot=jt(),$=G(V(ot));let nt;var ft=F($,!0);D($),N(gt=>{nt=st($,"",nt,gt),W(ft,rt().text)},[()=>({color:rt().color})]),C(ut,ot)}),C(m,k)};at(h,m=>{H!=null&&m(x)})}D(l),D(t),X(t,m=>S=m,()=>S),N(m=>{Y(t,1,`floating-block ${T(O)&&e()!="background"?"visible":""}`),W(o,T(j)),W(n,`FPS: ${m??""} `)},[()=>`${Math.round(T(Z))} (${d?.width}x${d?.height})`]),C(P,t)},$$slots:{default:!0}})};at(Q,i=>{a()&&i(lt)})}var z=G(Q,2);let tt;X(z,i=>d=i,()=>d),N(i=>{Y(E,1,`edit ${T(L)?"visible":""}`,"svelte-1humrcv"),Et(ct,"src",Ut),Y(z,1,`glsl ${e()??""}`,"svelte-1humrcv"),tt=st(z,"",tt,i)},[()=>({"max-width":e()=="preview"?"calc(var(--compact-width) * 0.25)":e()=="background"?"100vw":`${s()}px`,"max-height":e()=="preview"?"auto":e()=="background"?"100vh":`${s()}px`,"background-color":A()})]),C(u,J),_t()}Pt(["click"]);export{oe as T,Gt as a,Ot as b,re as c,Dt as d,Ut as e,It as n};
