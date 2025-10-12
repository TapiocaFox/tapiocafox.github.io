import"./DsnmJJEf.js";import{o as ve,a as pe}from"./CgRXHxBO.js";import{p as xe,aC as F,ac as we,f as K,e as V,t as W,a as I,b as _e,i as E,k as p,j as B,at as be,c as U,n as ye,r as O,s as D,g as Re,aA as Se,a_ as Le}from"./DhC3OKG3.js";import{d as Pe,s as N}from"./C2SMSy0O.js";import{p as w,i as se}from"./DTUXzvHw.js";import{e as Te,i as Ae}from"./Bi7ZZ38p.js";import{s as Ee}from"./DTh1TlsO.js";import{s as Y}from"./Dm4hEmcj.js";import{s as ae}from"./Cpu6rZaE.js";import{b as X}from"./C7ZlhQ6A.js";import{P as Me}from"./6nXsVoZT.js";import{g as ke}from"./MXlDgamq.js";import{w as Fe}from"./DlGSF-ol.js";const Ue=`#version 300 es

// Author: TapiocaFox
// Title:  Default Vertex Shader

in  vec3 aPos;
out vec3 vPos;

void main() {
    gl_Position = vec4(aPos, 1.);
    vPos = aPos;
}`,Oe=`#version 300 es

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
}`,De=`// Author: TapiocaFox
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
};`,Ce={index:De},Ge="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";function Ie(){const u=new Map,c=new Set;function f(r,s){for(const a of c)a(r,s)}function _(r){if(!r)return"unknown module";for(const[s,a]of u.entries())if(a.url===r||r.includes(a.url))return s;return"unknown module"}function b(r){const s=_(r.filename);f(s,r.error??r.message)}function L(r){const s=r.reason;if(!(s instanceof Error)||!s.stack)return;const a=s.stack,y=[...u.values()].find(P=>a.includes(P.url));y?f(_(y.url),s):console.debug("[Sandbox] Ignoring external promise rejection:",s)}return window.addEventListener("error",b),window.addEventListener("unhandledrejection",L),{register(r,s){const a=u.get(r);a?.url&&URL.revokeObjectURL(a.url);const y=s.replace(/import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g,(d,S)=>{const g=u.get(S);return g?d.replace(S,g.url):d}),P=new Blob([y],{type:"application/javascript"}),R=URL.createObjectURL(P);return u.set(r,{code:s,url:R,exports:null}),R},async import(r){const s=u.get(r);if(!s)throw new Error(`Module "${r}" not found`);try{const a=await import(s.url);return s.exports=a,a}catch(a){throw f(r,a),a}},async replace(r,s){this.register(r,s),await this.reloadAll()},async reloadAll(){for(const[r,s]of u.entries())try{URL.revokeObjectURL(s.url);const a=new Blob([s.code],{type:"application/javascript"}),y=URL.createObjectURL(a);s.url=y;const P=await import(y);s.exports=P}catch(a){f(r,a),console.error(`Failed to reload module "${r}":`,a)}},clear(){for(const r of u.values())URL.revokeObjectURL(r.url);u.clear(),c.clear(),window.removeEventListener("error",b),window.removeEventListener("unhandledrejection",L)},addUncaughtErrorListener(r){c.add(r)},removeUncaughtErrorListener(r){c.delete(r)}}}const ot="fgl",Be=Fe(null);function je(u,c,f,_,b){Be.set({name:"",timestamp:0,img:"",vert:c(),frag:f(),modules:_(),assets:b()}),ke("/webgl_editor")}var He=K("<br/><span> </span>",1),$e=K('<div><h3> </h3> <p class="annotation"> <!></p></div>'),ze=K('<button><img class="inline-glyph" alt="Edit"/>Edit</button> <!> <canvas></canvas>',1);function nt(u,c){xe(c,!0);let f=w(c,"vertex_shader",27,()=>F(Ue)),_=w(c,"fragment_shader",27,()=>F(Oe)),b=w(c,"modules",27,()=>F(Ce)),L=w(c,"assets",27,()=>F({})),r=w(c,"mode",3,"default"),s=w(c,"size",3,250),a=w(c,"show_status_block",3,!0),y=w(c,"background_color",3,"transparent"),P=w(c,"onglinit",3,async function(i){return!0}),R=w(c,"onerror",3,async function(i,A){console.trace(A)});var d,S,g;let C=B(!1),T=B(!1),Z=B(0),j=B("Rendering Status"),H=F({});const ie=.5,G=32;let v;const q=(i,A)=>{console.log("module:",i,`
error:`,A),R()("js",{module:i,error:A})};we(()=>{f(),_(),b(),L(),v&&(v.newProgram(),v.setShadersModulesAndAssets(f(),_(),b(),L()),v.refreshShadersAndScript())}),ve(async()=>{try{const i=d.getContext("webgl2",{preserveDrawingBuffer:r()=="in-editor"});v={gl:i,canvas:d,program:i.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:E(j),statusDict:H,vertexShader:"",fragmentShader:"",sandbox:Ie(),indexModule:null,assets:{},async start(){try{await this.indexModule?.start?.(this)}catch(e){R()("js",{module:"index",error:e})}},async stop(){try{await this.indexModule?.stop?.(this)}catch(e){R()("js",{module:"index",error:e})}},async optimizeViewPort(){const e=this.gl,t=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),o=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==t||this.canvas.height!==o)&&(this.canvas.width=t,this.canvas.height=o,e.viewport(0,0,t,o)),await be()},initProgram(e,t){const o=this.gl,l=(n,h)=>{const x=o.createShader(n);o.shaderSource(x,h),o.compileShader(x);const m=o.getShaderInfoLog(x);if(!o.getShaderParameter(x,o.COMPILE_STATUS)||m?.trim().length)throw`Cannot compile shader: ${m}`;o.attachShader(this.program,x)};try{l(o.VERTEX_SHADER,e)}catch(n){throw R()("vert",n),n}try{l(o.FRAGMENT_SHADER,t)}catch(n){throw R()("frag",n),n}if(o.linkProgram(this.program),!o.getProgramParameter(this.program,o.LINK_STATUS))throw`Cannot link program:
${o.getProgramInfoLog(this.program)}`;o.useProgram(this.program)},async importIndexModule(){try{this.indexModule=await this.sandbox.import("index")}catch(e){R()("js",{module:"index",error:e})}},render(){const e=this.gl,t=Date.now();p(Z,1e3/(t-this.lastRenderTime)),this.lastRenderTime=t,e.drawArrays(e.TRIANGLES,0,6)},newProgram(){const e=this.gl;e.getAttachedShaders(this.program)?.forEach(o=>{e.detachShader(this.program,o),e.deleteShader(o)}),e.deleteProgram(this.program),this.program=e.createProgram()},async reset(){const e=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const t=this.statusDict;for(const o in t)delete t[o];await this.sandbox.reloadAll(),this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setShadersModulesAndAssets(e,t,o,l){this.vertexShader=e,this.fragmentShader=t;for(const n in o)this.sandbox.register(n,o[n]);this.assets=l},async refreshShadersAndScript(){await this.stop(),await this.optimizeViewPort();const e=this.statusDict;for(const t in e)delete e[t];this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setStatusTitle(e){p(j,e,!0)},reportStatus(e,t,o="inherit"){this.statusDict[e]={text:t,color:o}},async getAssetById(e){const t=this.assets[e];if(typeof t>"u"||t==null)throw`Asset with id "${e}" does not exist.`;if(t.type=="image")return new Promise((o,l)=>{const n=new Image;n.crossOrigin="anonymous",n.onload=()=>o(n),n.onerror=h=>l(h),n.src=t.src,n.complete&&o(n)});if(t.type==="audio")return new Promise((o,l)=>{const n=new Audio;n.crossOrigin="anonymous",n.oncanplaythrough=()=>o(n),n.onerror=h=>l(h),n.src=t.src,n.load()});throw"Not implemented"}},v.sandbox.addUncaughtErrorListener(q),new ResizeObserver(e=>{v.optimizeViewPort()}).observe(d),d.addEventListener("pointermove",async e=>{const t=d.getBoundingClientRect(),o=t.bottom-t.top;if(a()){p(C,!0),r()=="default"&&p(T,!0);const{clientX:l,clientY:n}=e,h=window.innerWidth,x=window.innerHeight,m=S.offsetWidth,k=S.offsetHeight;(t.left+t.right)*.5<=h*ie?(S.animate({left:`${Math.min(l+G,h-m)}px`,top:`${Math.min(n+G,x-k)}px`},{fill:"forwards"}),g.animate({left:`${t.left}px`,top:`${t.bottom+4}px`},{fill:"forwards"})):(S.animate({right:`${Math.max(h-l+G,0)}px`,top:`${Math.min(n+G,x-k)}px`},{fill:"forwards"}),g.animate({right:`${h-t.right}px`,top:`${t.bottom+4}px`},{fill:"forwards"}))}}),d.addEventListener("pointerleave",async e=>{if(p(C,!1),g==null)return;const t=d.getBoundingClientRect(),o=g.getBoundingClientRect();if(a()){const{clientX:l,clientY:n}=e;o.left<=l&&l<=o.right&&n>t.top?p(T,!0):p(T,!1)}}),document.addEventListener("scroll",async e=>{p(C,!1),p(T,!1)},!0),d.addEventListener("webglcontextlost",async e=>{e.preventDefault(),console.warn("GLSL canvas WebGL context lost!")});const te=await P()(v);v.setShadersModulesAndAssets(f(),_(),b(),L()),te&&await v.refreshShadersAndScript()}catch(i){console.trace(i)}g.onpointerenter=async i=>{r()=="default"&&p(T,!0)},g.onpointerleave=async i=>{p(T,!1)}}),pe(()=>{v?.sandbox.removeUncaughtErrorListener(q)});var J=ze(),M=V(J);M.__click=[je,f,_,b,L];var ce=U(M);ye(),O(M),X(M,i=>g=i,()=>g);var Q=D(M,2);{var le=i=>{Me(i,{target:"body",children:(A,te)=>{var e=$e(),t=U(e),o=U(t,!0);O(t);var l=D(t,2),n=U(l),h=D(n);{var x=m=>{var k=Re(),de=V(k);Te(de,17,()=>Object.entries(H),Ae,(ue,he)=>{var me=Se(()=>Le(E(he),2));let re=()=>E(me)[1];var oe=He(),z=D(V(oe));let ne;var fe=U(z,!0);O(z),W(ge=>{ne=ae(z,"",ne,ge),N(fe,re().text)},[()=>({color:re().color})]),I(ue,oe)}),I(m,k)};se(h,m=>{H!=null&&m(x)})}O(l),O(e),X(e,m=>S=m,()=>S),W(m=>{Y(e,1,`floating-block ${E(C)&&r()!="background"?"visible":""}`),N(o,E(j)),N(n,`FPS: ${m??""} `)},[()=>`${Math.round(E(Z))} (${d?.width}x${d?.height})`]),I(A,e)},$$slots:{default:!0}})};se(Q,i=>{a()&&i(le)})}var $=D(Q,2);let ee;X($,i=>d=i,()=>d),W(i=>{Y(M,1,`edit ${E(T)?"visible":""}`,"svelte-1humrcv"),Ee(ce,"src",Ge),Y($,1,`glsl ${r()??""}`,"svelte-1humrcv"),ee=ae($,"",ee,i)},[()=>({"max-width":r()=="preview"?"calc(var(--compact-width) * 0.25)":r()=="background"?"100vw":`${s()}px`,"max-height":r()=="preview"?"auto":r()=="background"?"100vh":`${s()}px`,"background-color":y()})]),I(u,J),_e()}Pe(["click"]);export{nt as T,Oe as a,De as b,ot as c,Ue as d,Ge as e,Ce as m,Be as n};
