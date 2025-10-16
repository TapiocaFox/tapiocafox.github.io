import"./DsnmJJEf.js";import{o as pt,a as wt}from"./DZor6qtp.js";import{p as xt,aB as D,ab as _t,f as q,e as W,t as Y,a as $,b as bt,i as P,k as x,j as I,as as yt,c as U,n as St,r as O,s as C,g as Rt,az as Lt,b8 as Pt}from"./UuebQw-N.js";import{d as Et,s as X}from"./CWSVVgTL.js";import{p as y,i as at}from"./BNnMBqfr.js";import{e as Mt,i as Tt}from"./DLdQWlW5.js";import{s as At}from"./Bczg0Zq0.js";import{s as K}from"./BI6CLnWE.js";import{s as it}from"./CK7EHw7e.js";import{b as Z}from"./XPBOPOQb.js";import{P as kt}from"./BlnfjrZp.js";import{g as Ft}from"./uMYitFVO.js";import{w as Dt}from"./WXnP_9PU.js";const Ut=`#version 300 es

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
};`,Gt={index:Ct},Bt="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";function $t(){const d=new Map,u=new Set;let v=[];function p(e,t){for(const o of u)o(e,S(t))}function S(e){let t;if(e instanceof Error?t=e:t=new Error(String(e)),t.stack)for(const[o,i]of d.entries())i.url&&(t.stack=t.stack.replaceAll(i.url,o));if(t.message)for(const[o,i]of d.entries())i.url&&(t.message=t.message.replaceAll(i.url,o));return t}function E(e){if(!e)return null;for(const t of v){const o=d.get(t);if(o.url&&e.includes(o.url))return o}return null}function m(e){if(!e)return null;for(const[t,o]of d.entries())if(o.url===e||e?.includes(o.url))return t;return null}function T(e){if(e==null)return null;const t=E(e);return t==null?null:m(t.url)}window.addEventListener("error",e=>{const t=m(e.filename);t!=null&&p(t,e.error??e.message)}),window.addEventListener("unhandledrejection",e=>{const t=e.reason;if(!(t instanceof Error)||!t.stack)return;const o=T(t.stack);o!=null&&o&&p(o,t)});function A(e){const t=[];return e.replace(/import\s+(?:.+?)\s+from\s+['"]([^'"]+)['"]/g,(o,i)=>(t.push(i),o)),t}function H(){const e=new Set,t=new Set,o=[];function i(c,_=[]){if(e.has(c))return;if(t.has(c)){const R=[..._,c].join(" -> ");throw new Error(`Circular dependency detected: ${R}`)}t.add(c);const k=d.get(c);if(!k)throw new Error(`Module "${c}" not found for topological sort`);for(const R of k.deps)d.has(R)&&i(R,[..._,c]);t.delete(c),e.add(c),o.push(c)}for(const c of d.keys())i(c);return o}function z(e){return e.replace(/import\s+(.+?)\s+from\s+['"]([^'"]+)['"]/g,(t,o,i)=>{const c=d.get(i);return c?.url?`import ${o} from '${c.url}'`:t})}return{register(e,t){if(d.has(e)){const o=d.get(e);o.url&&URL.revokeObjectURL(o.url)}d.set(e,{code:t,url:null,exports:null,deps:A(t)})},commit(){v=H();for(const e of v){const t=d.get(e),o=z(t.code);t.url&&URL.revokeObjectURL(t.url);const i=new Blob([o],{type:"application/javascript"});t.url=URL.createObjectURL(i)}},async import(e){const t=d.get(e);if(!t||!t.url)throw new Error(`Module "${e}" not committed`);try{const o=await import(t.url);return t.exports=o,o}catch(o){let i=null;throw o instanceof Error&&(i=T(o.stack||null)),i==null?p(e,o):p(i,o),o}},async replace(e,t){this.register(e,t),this.commit()},async preloadAll(){for(const e of v){if(!d.get(e).url)return new Error(`Module "${e}" not committed`);try{await this.import(e)}catch(o){return S(o)}}},clear(){for(const e of d.values())e.url&&URL.revokeObjectURL(e.url);d.clear()},addUncaughtErrorListener(e){u.add(e)},removeUncaughtErrorListener(e){u.delete(e)}}}const G="index",ne="fgl",It=Dt(null);function Ht(d,u,v,p,S){It.set({name:"",timestamp:0,img:"",vert:u(),frag:v(),modules:p(),assets:S()}),Ft("/webgl_editor")}var zt=q("<br/><span> </span>",1),Vt=q('<div><h3> </h3> <p class="annotation"> <!></p></div>'),Nt=q('<button><img class="inline-glyph" alt="Edit"/>Edit</button> <!> <canvas></canvas>',1);function se(d,u){xt(u,!0);let v=y(u,"vertex_shader",27,()=>D(Ut)),p=y(u,"fragment_shader",27,()=>D(Ot)),S=y(u,"modules",27,()=>D(Gt)),E=y(u,"assets",27,()=>D({})),m=y(u,"mode",3,"default"),T=y(u,"size",3,250),A=y(u,"show_status_block",3,!0),H=y(u,"background_color",3,"transparent"),z=y(u,"onglinit",3,async function(l){return!0}),e=y(u,"onerror",3,async function(l,L){console.trace(L)});var t,o,i;let c=I(!1),_=I(!1),k=I(0),R=I("Rendering Status"),V=D({});const lt=.5,B=32;let w;const J=(l,L)=>{console.log("module:",l,`
error:`,L),e()("modules",{module:l,error:L})};_t(()=>{v(),p(),S(),E(),w&&(w.newProgram(),w.setShadersModulesAndAssets(v(),p(),S(),E()),w.refreshShadersAndModules())}),pt(async()=>{try{const l=t.getContext("webgl2",{preserveDrawingBuffer:m()=="in-editor"});w={gl:l,canvas:t,program:l.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:P(R),statusDict:V,vertexShader:"",fragmentShader:"",sandbox:$t(),defaultModule:null,assets:{},async start(){try{await this.defaultModule?.start?.(this)}catch(r){e()("modules",{module:G,error:r})}},async stop(){try{await this.defaultModule?.stop?.(this)}catch(r){e()("modules",{module:G,error:r})}},async optimizeViewPort(){const r=this.gl,n=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),s=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==n||this.canvas.height!==s)&&(this.canvas.width=n,this.canvas.height=s,r.viewport(0,0,n,s)),await yt()},initProgram(r,n){const s=this.gl,f=(a,h)=>{const b=s.createShader(a);s.shaderSource(b,h),s.compileShader(b);const g=s.getShaderInfoLog(b);if(!s.getShaderParameter(b,s.COMPILE_STATUS)||g?.trim().length)throw`Cannot compile shader: ${g}`;s.attachShader(this.program,b)};try{f(s.VERTEX_SHADER,r)}catch(a){throw e()("vert",a),a}try{f(s.FRAGMENT_SHADER,n)}catch(a){throw e()("frag",a),a}if(s.linkProgram(this.program),!s.getProgramParameter(this.program,s.LINK_STATUS))throw`Cannot link program:
${s.getProgramInfoLog(this.program)}`;s.useProgram(this.program)},async importDefaultModule(){try{this.defaultModule=await this.sandbox.import(G)}catch(r){e()("modules",{module:G,error:r})}},render(){const r=this.gl,n=Date.now();x(k,1e3/(n-this.lastRenderTime)),this.lastRenderTime=n,r.drawArrays(r.TRIANGLES,0,6)},newProgram(){const r=this.gl;r.getAttachedShaders(this.program)?.forEach(s=>{r.detachShader(this.program,s),r.deleteShader(s)}),r.deleteProgram(this.program),this.program=r.createProgram()},async reset(){const r=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const n=this.statusDict;for(const s in n)delete n[s];this.sandbox.commit(),!(m()=="in-editor"&&await this.sandbox.preloadAll())&&(this.initProgram(this.vertexShader,this.fragmentShader),await this.importDefaultModule(),await this.start())},setShadersModulesAndAssets(r,n,s,f){this.vertexShader=r,this.fragmentShader=n;try{this.sandbox.clear();for(const a in s)this.sandbox.register(a,s[a]);this.assets=f}catch(a){e()("modules",{module:G,error:a})}},async refreshShadersAndModules(){await this.stop(),await this.optimizeViewPort();const r=this.statusDict;for(const n in r)delete r[n];this.sandbox.commit(),!(m()=="in-editor"&&await this.sandbox.preloadAll())&&(this.initProgram(this.vertexShader,this.fragmentShader),await this.importDefaultModule(),await this.start())},setStatusTitle(r){x(R,r,!0)},reportStatus(r,n,s="inherit"){this.statusDict[r]={text:n,color:s}},async getAssetById(r){const n=this.assets[r];if(typeof n>"u"||n==null)throw`Asset with id "${r}" does not exist.`;if(n.type=="image")return new Promise((s,f)=>{const a=new Image;a.crossOrigin="anonymous",a.onload=()=>s(a),a.onerror=h=>f(h),a.src=n.src,a.complete&&s(a)});if(n.type==="audio")return new Promise((s,f)=>{const a=new Audio;a.crossOrigin="anonymous",a.oncanplaythrough=()=>s(a),a.onerror=h=>f(h),a.src=n.src,a.load()});throw"Not implemented"}},w.sandbox.addUncaughtErrorListener(J),new ResizeObserver(r=>{w.optimizeViewPort()}).observe(t),t.addEventListener("pointermove",async r=>{const n=t.getBoundingClientRect(),s=n.bottom-n.top;if(A()){x(c,!0),m()=="default"&&x(_,!0);const{clientX:f,clientY:a}=r,h=window.innerWidth,b=window.innerHeight,g=o.offsetWidth,F=o.offsetHeight;(n.left+n.right)*.5<=h*lt?(o.animate({left:`${Math.min(f+B,h-g)}px`,top:`${Math.min(a+B,b-F)}px`},{fill:"forwards"}),i.animate({left:`${n.left}px`,top:`${n.bottom+4}px`},{fill:"forwards"})):(o.animate({right:`${Math.max(h-f+B,0)}px`,top:`${Math.min(a+B,b-F)}px`},{fill:"forwards"}),i.animate({right:`${h-n.right}px`,top:`${n.bottom+4}px`},{fill:"forwards"}))}}),t.addEventListener("pointerleave",async r=>{if(x(c,!1),i==null)return;const n=t.getBoundingClientRect(),s=i.getBoundingClientRect();if(A()){const{clientX:f,clientY:a}=r;s.left<=f&&f<=s.right&&a>n.top?x(_,!0):x(_,!1)}}),document.addEventListener("scroll",async r=>{x(c,!1),x(_,!1)},!0),t.addEventListener("webglcontextlost",async r=>{r.preventDefault(),console.warn("GLSL canvas WebGL context lost!")});const rt=await z()(w);w.setShadersModulesAndAssets(v(),p(),S(),E()),rt&&await w.refreshShadersAndModules()}catch(l){console.trace(l)}i.onpointerenter=async l=>{m()=="default"&&x(_,!0)},i.onpointerleave=async l=>{x(_,!1)}}),wt(()=>{w?.sandbox.removeUncaughtErrorListener(J)});var Q=Nt(),M=W(Q);M.__click=[Ht,v,p,S,E];var ct=U(M);St(),O(M),Z(M,l=>i=l,()=>i);var tt=C(M,2);{var dt=l=>{kt(l,{target:"body",children:(L,rt)=>{var r=Vt(),n=U(r),s=U(n,!0);O(n);var f=C(n,2),a=U(f),h=C(a);{var b=g=>{var F=Rt(),ut=W(F);Mt(ut,17,()=>Object.entries(V),Tt,(ft,mt)=>{var ht=Lt(()=>Pt(P(mt),2));let ot=()=>P(ht)[1];var nt=zt(),j=C(W(nt));let st;var gt=U(j,!0);O(j),Y(vt=>{st=it(j,"",st,vt),X(gt,ot().text)},[()=>({color:ot().color})]),$(ft,nt)}),$(g,F)};at(h,g=>{V!=null&&g(b)})}O(f),O(r),Z(r,g=>o=g,()=>o),Y(g=>{K(r,1,`floating-block ${P(c)&&m()!="background"?"visible":""}`),X(s,P(R)),X(a,`FPS: ${g??""} `)},[()=>`${Math.round(P(k))} (${t?.width}x${t?.height})`]),$(L,r)},$$slots:{default:!0}})};at(tt,l=>{A()&&l(dt)})}var N=C(tt,2);let et;Z(N,l=>t=l,()=>t),Y(l=>{K(M,1,`edit ${P(_)?"visible":""}`,"svelte-1humrcv"),At(ct,"src",Bt),K(N,1,`glsl ${m()??""}`,"svelte-1humrcv"),et=it(N,"",et,l)},[()=>({"max-width":m()=="preview"?"calc(var(--compact-width) * 0.25)":m()=="background"?"100vw":`${T()}px`,"max-height":m()=="preview"?"auto":m()=="background"?"100vh":`${T()}px`,"background-color":H()})]),$(d,Q),bt()}Et(["click"]);export{se as T,Ot as a,G as b,ne as c,Ut as d,Bt as e,Ct as f,Gt as m,It as n};
