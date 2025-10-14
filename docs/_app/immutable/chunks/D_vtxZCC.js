import"./DsnmJJEf.js";import{o as pt,a as wt}from"./DZor6qtp.js";import{p as xt,aB as F,ab as _t,f as q,e as W,t as Y,a as $,b as bt,i as T,k as x,j as I,as as yt,c as D,n as St,r as U,s as O,g as Rt,az as Lt,b8 as Pt}from"./UuebQw-N.js";import{d as Mt,s as X}from"./CWSVVgTL.js";import{p as y,i as at}from"./BNnMBqfr.js";import{e as Tt,i as Et}from"./DLdQWlW5.js";import{s as At}from"./Bczg0Zq0.js";import{s as K}from"./BI6CLnWE.js";import{s as it}from"./CK7EHw7e.js";import{b as Z}from"./XPBOPOQb.js";import{P as kt}from"./BlnfjrZp.js";import{g as Ft}from"./CD4uPXR_.js";import{w as Dt}from"./WXnP_9PU.js";const Ut=`#version 300 es

// Author: TapiocaFox
// Title:  Default Vertex Shader

in  vec3 aPos;
out vec3 vPos;

void main() {
    gl_Position = vec4(aPos, 1.);
    vPos = aPos;
}`,Ot=`#version 300 es

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
}`,Ct=`// Author: TapiocaFox
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
};`,Gt={index:Ct},Bt="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";function $t(){const d=new Map,u=new Set;let v=[];function p(t,e){for(const r of u)r(t,e)}function S(t){if(!t)return null;for(const e of v){const r=d.get(e);if(r.url&&t.includes(r.url))return r}return null}function R(t){if(!t)return null;for(const[e,r]of d.entries())if(r.url===t||t?.includes(r.url))return e;return null}function m(t){if(t==null)return null;const e=S(t);return e==null?null:R(e.url)}window.addEventListener("error",t=>{const e=R(t.filename);e!=null&&p(e,t.error??t.message)}),window.addEventListener("unhandledrejection",t=>{const e=t.reason;if(!(e instanceof Error)||!e.stack)return;const r=m(e.stack);r!=null&&r&&p(r,e)});function G(t){const e=[];return t.replace(/import\s+(?:.+?)\s+from\s+['"]([^'"]+)['"]/g,(r,l)=>(e.push(l),r)),e}function A(){const t=new Set,e=new Set,r=[];function l(i,L=[]){if(t.has(i))return;if(e.has(i)){const P=[...L,i].join(" -> ");throw new Error(`Circular dependency detected: ${P}`)}e.add(i);const _=d.get(i);if(!_)throw new Error(`Module "${i}" not found for topological sort`);for(const P of _.deps)d.has(P)&&l(P,[...L,i]);e.delete(i),t.add(i),r.push(i)}for(const i of d.keys())l(i);return r}function H(t){return t.replace(/import\s+(.+?)\s+from\s+['"]([^'"]+)['"]/g,(e,r,l)=>{const i=d.get(l);return i?.url?`import ${r} from '${i.url}'`:e})}return{register(t,e){if(d.has(t)){const r=d.get(t);r.url&&URL.revokeObjectURL(r.url)}d.set(t,{code:e,url:null,exports:null,deps:G(e)})},commit(){v=A();for(const t of v){const e=d.get(t),r=H(e.code);e.url&&URL.revokeObjectURL(e.url);const l=new Blob([r],{type:"application/javascript"});e.url=URL.createObjectURL(l)}},async import(t){const e=d.get(t);if(!e||!e.url)throw new Error(`Module "${t}" not committed`);try{const r=await import(e.url);return e.exports=r,r}catch(r){let l=null;throw r instanceof Error&&(l=m(r.stack||null)),console.log(`moduleName: ${l}`),l==null?p(t,r):p(l,r),r}},async replace(t,e){this.register(t,e),this.commit()},async preloadAll(){for(const t of v){if(!d.get(t).url)return new Error(`Module "${t}" not committed`);try{await this.import(t)}catch(r){return r}}},clear(){for(const t of d.values())t.url&&URL.revokeObjectURL(t.url);d.clear()},addUncaughtErrorListener(t){u.add(t)},removeUncaughtErrorListener(t){u.delete(t)}}}const C="index",ne="fgl",It=Dt(null);function Ht(d,u,v,p,S){It.set({name:"",timestamp:0,img:"",vert:u(),frag:v(),modules:p(),assets:S()}),Ft("/webgl_editor")}var jt=q("<br/><span> </span>",1),zt=q('<div><h3> </h3> <p class="annotation"> <!></p></div>'),Nt=q('<button><img class="inline-glyph" alt="Edit"/>Edit</button> <!> <canvas></canvas>',1);function se(d,u){xt(u,!0);let v=y(u,"vertex_shader",27,()=>F(Ut)),p=y(u,"fragment_shader",27,()=>F(Ot)),S=y(u,"modules",27,()=>F(Gt)),R=y(u,"assets",27,()=>F({})),m=y(u,"mode",3,"default"),G=y(u,"size",3,250),A=y(u,"show_status_block",3,!0),H=y(u,"background_color",3,"transparent"),t=y(u,"onglinit",3,async function(c){return!0}),e=y(u,"onerror",3,async function(c,M){console.trace(M)});var r,l,i;let L=I(!1),_=I(!1),P=I(0),j=I("Rendering Status"),z=F({});const ct=.5,B=32;let w;const J=(c,M)=>{console.log("module:",c,`
error:`,M),e()("js",{module:c,error:M})};_t(()=>{v(),p(),S(),R(),w&&(w.newProgram(),w.setShadersModulesAndAssets(v(),p(),S(),R()),w.refreshShadersAndModules())}),pt(async()=>{try{const c=r.getContext("webgl2",{preserveDrawingBuffer:m()=="in-editor"});w={gl:c,canvas:r,program:c.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:T(j),statusDict:z,vertexShader:"",fragmentShader:"",sandbox:$t(),defaultModule:null,assets:{},async start(){try{await this.defaultModule?.start?.(this)}catch(o){e()("js",{module:C,error:o})}},async stop(){try{await this.defaultModule?.stop?.(this)}catch(o){e()("js",{module:C,error:o})}},async optimizeViewPort(){const o=this.gl,n=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),s=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==n||this.canvas.height!==s)&&(this.canvas.width=n,this.canvas.height=s,o.viewport(0,0,n,s)),await yt()},initProgram(o,n){const s=this.gl,f=(a,h)=>{const b=s.createShader(a);s.shaderSource(b,h),s.compileShader(b);const g=s.getShaderInfoLog(b);if(!s.getShaderParameter(b,s.COMPILE_STATUS)||g?.trim().length)throw`Cannot compile shader: ${g}`;s.attachShader(this.program,b)};try{f(s.VERTEX_SHADER,o)}catch(a){throw e()("vert",a),a}try{f(s.FRAGMENT_SHADER,n)}catch(a){throw e()("frag",a),a}if(s.linkProgram(this.program),!s.getProgramParameter(this.program,s.LINK_STATUS))throw`Cannot link program:
${s.getProgramInfoLog(this.program)}`;s.useProgram(this.program)},async importDefaultModule(){try{this.defaultModule=await this.sandbox.import(C)}catch(o){e()("js",{module:C,error:o})}},render(){const o=this.gl,n=Date.now();x(P,1e3/(n-this.lastRenderTime)),this.lastRenderTime=n,o.drawArrays(o.TRIANGLES,0,6)},newProgram(){const o=this.gl;o.getAttachedShaders(this.program)?.forEach(s=>{o.detachShader(this.program,s),o.deleteShader(s)}),o.deleteProgram(this.program),this.program=o.createProgram()},async reset(){const o=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const n=this.statusDict;for(const s in n)delete n[s];this.sandbox.commit(),!(m()=="in-editor"&&await this.sandbox.preloadAll())&&(this.initProgram(this.vertexShader,this.fragmentShader),await this.importDefaultModule(),await this.start())},setShadersModulesAndAssets(o,n,s,f){this.vertexShader=o,this.fragmentShader=n;try{this.sandbox.clear();for(const a in s)this.sandbox.register(a,s[a]);this.assets=f}catch(a){e()("js",{module:C,error:a})}},async refreshShadersAndModules(){await this.stop(),await this.optimizeViewPort();const o=this.statusDict;for(const n in o)delete o[n];this.sandbox.commit(),!(m()=="in-editor"&&await this.sandbox.preloadAll())&&(this.initProgram(this.vertexShader,this.fragmentShader),await this.importDefaultModule(),await this.start())},setStatusTitle(o){x(j,o,!0)},reportStatus(o,n,s="inherit"){this.statusDict[o]={text:n,color:s}},async getAssetById(o){const n=this.assets[o];if(typeof n>"u"||n==null)throw`Asset with id "${o}" does not exist.`;if(n.type=="image")return new Promise((s,f)=>{const a=new Image;a.crossOrigin="anonymous",a.onload=()=>s(a),a.onerror=h=>f(h),a.src=n.src,a.complete&&s(a)});if(n.type==="audio")return new Promise((s,f)=>{const a=new Audio;a.crossOrigin="anonymous",a.oncanplaythrough=()=>s(a),a.onerror=h=>f(h),a.src=n.src,a.load()});throw"Not implemented"}},w.sandbox.addUncaughtErrorListener(J),new ResizeObserver(o=>{w.optimizeViewPort()}).observe(r),r.addEventListener("pointermove",async o=>{const n=r.getBoundingClientRect(),s=n.bottom-n.top;if(A()){x(L,!0),m()=="default"&&x(_,!0);const{clientX:f,clientY:a}=o,h=window.innerWidth,b=window.innerHeight,g=l.offsetWidth,k=l.offsetHeight;(n.left+n.right)*.5<=h*ct?(l.animate({left:`${Math.min(f+B,h-g)}px`,top:`${Math.min(a+B,b-k)}px`},{fill:"forwards"}),i.animate({left:`${n.left}px`,top:`${n.bottom+4}px`},{fill:"forwards"})):(l.animate({right:`${Math.max(h-f+B,0)}px`,top:`${Math.min(a+B,b-k)}px`},{fill:"forwards"}),i.animate({right:`${h-n.right}px`,top:`${n.bottom+4}px`},{fill:"forwards"}))}}),r.addEventListener("pointerleave",async o=>{if(x(L,!1),i==null)return;const n=r.getBoundingClientRect(),s=i.getBoundingClientRect();if(A()){const{clientX:f,clientY:a}=o;s.left<=f&&f<=s.right&&a>n.top?x(_,!0):x(_,!1)}}),document.addEventListener("scroll",async o=>{x(L,!1),x(_,!1)},!0),r.addEventListener("webglcontextlost",async o=>{o.preventDefault(),console.warn("GLSL canvas WebGL context lost!")});const rt=await t()(w);w.setShadersModulesAndAssets(v(),p(),S(),R()),rt&&await w.refreshShadersAndModules()}catch(c){console.trace(c)}i.onpointerenter=async c=>{m()=="default"&&x(_,!0)},i.onpointerleave=async c=>{x(_,!1)}}),wt(()=>{w?.sandbox.removeUncaughtErrorListener(J)});var Q=Nt(),E=W(Q);E.__click=[Ht,v,p,S,R];var lt=D(E);St(),U(E),Z(E,c=>i=c,()=>i);var tt=O(E,2);{var dt=c=>{kt(c,{target:"body",children:(M,rt)=>{var o=zt(),n=D(o),s=D(n,!0);U(n);var f=O(n,2),a=D(f),h=O(a);{var b=g=>{var k=Rt(),ut=W(k);Tt(ut,17,()=>Object.entries(z),Et,(ft,mt)=>{var ht=Lt(()=>Pt(T(mt),2));let ot=()=>T(ht)[1];var nt=jt(),V=O(W(nt));let st;var gt=D(V,!0);U(V),Y(vt=>{st=it(V,"",st,vt),X(gt,ot().text)},[()=>({color:ot().color})]),$(ft,nt)}),$(g,k)};at(h,g=>{z!=null&&g(b)})}U(f),U(o),Z(o,g=>l=g,()=>l),Y(g=>{K(o,1,`floating-block ${T(L)&&m()!="background"?"visible":""}`),X(s,T(j)),X(a,`FPS: ${g??""} `)},[()=>`${Math.round(T(P))} (${r?.width}x${r?.height})`]),$(M,o)},$$slots:{default:!0}})};at(tt,c=>{A()&&c(dt)})}var N=O(tt,2);let et;Z(N,c=>r=c,()=>r),Y(c=>{K(E,1,`edit ${T(_)?"visible":""}`,"svelte-1humrcv"),At(lt,"src",Bt),K(N,1,`glsl ${m()??""}`,"svelte-1humrcv"),et=it(N,"",et,c)},[()=>({"max-width":m()=="preview"?"calc(var(--compact-width) * 0.25)":m()=="background"?"100vw":`${G()}px`,"max-height":m()=="preview"?"auto":m()=="background"?"100vh":`${G()}px`,"background-color":H()})]),$(d,Q),bt()}Mt(["click"]);export{se as T,Ot as a,C as b,ne as c,Ut as d,Bt as e,Gt as m,It as n};
