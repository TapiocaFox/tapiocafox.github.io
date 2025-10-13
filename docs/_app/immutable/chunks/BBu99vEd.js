import"./DsnmJJEf.js";import{o as vt,a as pt}from"./CgRXHxBO.js";import{p as xt,aC as F,ac as wt,f as K,e as V,t as N,a as I,b as _t,i as M,k as _,j as B,at as bt,c as D,n as yt,r as U,s as C,g as Rt,aA as St,a_ as Lt}from"./DhC3OKG3.js";import{d as Pt,s as W}from"./C2SMSy0O.js";import{p as y,i as st}from"./DTUXzvHw.js";import{e as Tt,i as At}from"./Bi7ZZ38p.js";import{s as Mt}from"./DTh1TlsO.js";import{s as Y}from"./Dm4hEmcj.js";import{s as at}from"./Cpu6rZaE.js";import{b as X}from"./C2r_3aev.js";import{P as Et}from"./6nXsVoZT.js";import{g as kt}from"./2bzKOL7H.js";import{w as Ft}from"./DlGSF-ol.js";const Dt=`#version 300 es

// Author: TapiocaFox
// Title:  Default Vertex Shader

in  vec3 aPos;
out vec3 vPos;

void main() {
    gl_Position = vec4(aPos, 1.);
    vPos = aPos;
}`,Ut=`#version 300 es

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
};`,Ot={index:Ct},Gt="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";function It(){const d=new Map,l=new Set;function p(e,r){for(const a of l)a(e,r)}function R(e){if(!e)return"unknown module";for(const[r,a]of d.entries())if(a.url===e||e?.includes(a.url))return r;return"unknown module"}window.addEventListener("error",e=>{const r=R(e.filename);p(r,e.error??e.message)}),window.addEventListener("unhandledrejection",e=>{const r=e.reason;if(!(r instanceof Error)||!r.stack)return;const a=[...d.values()].find(h=>r.stack?.includes(h.url));a&&p(R(a.url),r)});function L(e){const r=[];return e.replace(/import\s+(?:.+?)\s+from\s+['"]([^'"]+)['"]/g,(a,h)=>(r.push(h),a)),r}function P(){const e=new Set,r=new Set,a=[];function h(i,f=[]){if(e.has(i))return;if(r.has(i)){const m=[...f,i].join(" -> ");throw new Error(`Circular dependency detected: ${m}`)}r.add(i);const S=d.get(i);if(!S)throw new Error(`Module "${i}" not found for topological sort`);for(const m of S.deps)d.has(m)&&h(m,[...f,i]);r.delete(i),e.add(i),a.push(i)}for(const i of d.keys())h(i);return a}function x(e){return e.replace(/import\s+(.+?)\s+from\s+['"]([^'"]+)['"]/g,(r,a,h)=>{const i=d.get(h);return i?.url?`import ${a} from '${i.url}'`:r})}return{register(e,r){if(d.has(e)){const a=d.get(e);a.url&&URL.revokeObjectURL(a.url)}d.set(e,{code:r,url:null,exports:null,deps:L(r)})},commit(){const e=P();for(const r of e){const a=d.get(r),h=x(a.code);a.url&&URL.revokeObjectURL(a.url);const i=new Blob([h],{type:"application/javascript"});a.url=URL.createObjectURL(i)}},async import(e){const r=d.get(e);if(!r||!r.url)throw new Error(`Module "${e}" not committed`);try{const a=await import(r.url);return r.exports=a,a}catch(a){throw p(e,a),a}},async replace(e,r){this.register(e,r),this.commit(),await this.reloadAll()},async reloadAll(){const e=P();for(const r of e){const a=d.get(r);if(!a.url)throw new Error(`Module "${r}" not committed`);try{const h=await import(a.url);a.exports=h}catch(h){p(r,h)}}},clear(){for(const e of d.values())e.url&&URL.revokeObjectURL(e.url);d.clear(),l.clear()},addUncaughtErrorListener(e){l.add(e)},removeUncaughtErrorListener(e){l.delete(e)}}}const re="fgl",Bt=Ft(null);function $t(d,l,p,R,L){Bt.set({name:"",timestamp:0,img:"",vert:l(),frag:p(),modules:R(),assets:L()}),kt("/webgl_editor")}var Ht=K("<br/><span> </span>",1),jt=K('<div><h3> </h3> <p class="annotation"> <!></p></div>'),zt=K('<button><img class="inline-glyph" alt="Edit"/>Edit</button> <!> <canvas></canvas>',1);function ne(d,l){xt(l,!0);let p=y(l,"vertex_shader",27,()=>F(Dt)),R=y(l,"fragment_shader",27,()=>F(Ut)),L=y(l,"modules",27,()=>F(Ot)),P=y(l,"assets",27,()=>F({})),x=y(l,"mode",3,"default"),e=y(l,"size",3,250),r=y(l,"show_status_block",3,!0),a=y(l,"background_color",3,"transparent"),h=y(l,"onglinit",3,async function(c){return!0}),i=y(l,"onerror",3,async function(c,A){console.trace(A)});var f,S,m;let O=B(!1),T=B(!1),Z=B(0),$=B("Rendering Status"),H=F({});const it=.5,G=32;let w;const q=(c,A)=>{console.log("module:",c,`
error:`,A),i()("js",{module:c,error:A})};wt(()=>{p(),R(),L(),P(),w&&(w.newProgram(),w.setShadersModulesAndAssets(p(),R(),L(),P()),w.refreshShadersAndModules())}),vt(async()=>{try{const c=f.getContext("webgl2",{preserveDrawingBuffer:x()=="in-editor"});w={gl:c,canvas:f,program:c.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:M($),statusDict:H,vertexShader:"",fragmentShader:"",sandbox:It(),indexModule:null,assets:{},async start(){try{await this.indexModule?.start?.(this)}catch(t){i()("js",{module:"index",error:t})}},async stop(){try{await this.indexModule?.stop?.(this)}catch(t){i()("js",{module:"index",error:t})}},async optimizeViewPort(){const t=this.gl,o=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),n=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==o||this.canvas.height!==n)&&(this.canvas.width=o,this.canvas.height=n,t.viewport(0,0,o,n)),await bt()},initProgram(t,o){const n=this.gl,u=(s,g)=>{const b=n.createShader(s);n.shaderSource(b,g),n.compileShader(b);const v=n.getShaderInfoLog(b);if(!n.getShaderParameter(b,n.COMPILE_STATUS)||v?.trim().length)throw`Cannot compile shader: ${v}`;n.attachShader(this.program,b)};try{u(n.VERTEX_SHADER,t)}catch(s){throw i()("vert",s),s}try{u(n.FRAGMENT_SHADER,o)}catch(s){throw i()("frag",s),s}if(n.linkProgram(this.program),!n.getProgramParameter(this.program,n.LINK_STATUS))throw`Cannot link program:
${n.getProgramInfoLog(this.program)}`;n.useProgram(this.program)},async importIndexModule(){try{this.indexModule=await this.sandbox.import("index")}catch(t){i()("js",{module:"index",error:t})}},render(){const t=this.gl,o=Date.now();_(Z,1e3/(o-this.lastRenderTime)),this.lastRenderTime=o,t.drawArrays(t.TRIANGLES,0,6)},newProgram(){const t=this.gl;t.getAttachedShaders(this.program)?.forEach(n=>{t.detachShader(this.program,n),t.deleteShader(n)}),t.deleteProgram(this.program),this.program=t.createProgram()},async reset(){const t=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const o=this.statusDict;for(const n in o)delete o[n];await this.sandbox.reloadAll(),this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setShadersModulesAndAssets(t,o,n,u){this.vertexShader=t,this.fragmentShader=o;try{this.sandbox.clear();for(const s in n)this.sandbox.register(s,n[s]);this.sandbox.commit(),this.assets=u}catch(s){i()("js",{module:"index",error:s})}},async refreshShadersAndModules(){await this.stop(),await this.optimizeViewPort();const t=this.statusDict;for(const o in t)delete t[o];await this.sandbox.reloadAll(),this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setStatusTitle(t){_($,t,!0)},reportStatus(t,o,n="inherit"){this.statusDict[t]={text:o,color:n}},async getAssetById(t){const o=this.assets[t];if(typeof o>"u"||o==null)throw`Asset with id "${t}" does not exist.`;if(o.type=="image")return new Promise((n,u)=>{const s=new Image;s.crossOrigin="anonymous",s.onload=()=>n(s),s.onerror=g=>u(g),s.src=o.src,s.complete&&n(s)});if(o.type==="audio")return new Promise((n,u)=>{const s=new Audio;s.crossOrigin="anonymous",s.oncanplaythrough=()=>n(s),s.onerror=g=>u(g),s.src=o.src,s.load()});throw"Not implemented"}},w.sandbox.addUncaughtErrorListener(q),new ResizeObserver(t=>{w.optimizeViewPort()}).observe(f),f.addEventListener("pointermove",async t=>{const o=f.getBoundingClientRect(),n=o.bottom-o.top;if(r()){_(O,!0),x()=="default"&&_(T,!0);const{clientX:u,clientY:s}=t,g=window.innerWidth,b=window.innerHeight,v=S.offsetWidth,k=S.offsetHeight;(o.left+o.right)*.5<=g*it?(S.animate({left:`${Math.min(u+G,g-v)}px`,top:`${Math.min(s+G,b-k)}px`},{fill:"forwards"}),m.animate({left:`${o.left}px`,top:`${o.bottom+4}px`},{fill:"forwards"})):(S.animate({right:`${Math.max(g-u+G,0)}px`,top:`${Math.min(s+G,b-k)}px`},{fill:"forwards"}),m.animate({right:`${g-o.right}px`,top:`${o.bottom+4}px`},{fill:"forwards"}))}}),f.addEventListener("pointerleave",async t=>{if(_(O,!1),m==null)return;const o=f.getBoundingClientRect(),n=m.getBoundingClientRect();if(r()){const{clientX:u,clientY:s}=t;n.left<=u&&u<=n.right&&s>o.top?_(T,!0):_(T,!1)}}),document.addEventListener("scroll",async t=>{_(O,!1),_(T,!1)},!0),f.addEventListener("webglcontextlost",async t=>{t.preventDefault(),console.warn("GLSL canvas WebGL context lost!")});const et=await h()(w);w.setShadersModulesAndAssets(p(),R(),L(),P()),et&&await w.refreshShadersAndModules()}catch(c){console.trace(c)}m.onpointerenter=async c=>{x()=="default"&&_(T,!0)},m.onpointerleave=async c=>{_(T,!1)}}),pt(()=>{w?.sandbox.removeUncaughtErrorListener(q)});var J=zt(),E=V(J);E.__click=[$t,p,R,L,P];var ct=D(E);yt(),U(E),X(E,c=>m=c,()=>m);var Q=C(E,2);{var lt=c=>{Et(c,{target:"body",children:(A,et)=>{var t=jt(),o=D(t),n=D(o,!0);U(o);var u=C(o,2),s=D(u),g=C(s);{var b=v=>{var k=Rt(),dt=V(k);Tt(dt,17,()=>Object.entries(H),At,(ut,ht)=>{var ft=St(()=>Lt(M(ht),2));let ot=()=>M(ft)[1];var rt=Ht(),z=C(V(rt));let nt;var mt=D(z,!0);U(z),N(gt=>{nt=at(z,"",nt,gt),W(mt,ot().text)},[()=>({color:ot().color})]),I(ut,rt)}),I(v,k)};st(g,v=>{H!=null&&v(b)})}U(u),U(t),X(t,v=>S=v,()=>S),N(v=>{Y(t,1,`floating-block ${M(O)&&x()!="background"?"visible":""}`),W(n,M($)),W(s,`FPS: ${v??""} `)},[()=>`${Math.round(M(Z))} (${f?.width}x${f?.height})`]),I(A,t)},$$slots:{default:!0}})};st(Q,c=>{r()&&c(lt)})}var j=C(Q,2);let tt;X(j,c=>f=c,()=>f),N(c=>{Y(E,1,`edit ${M(T)?"visible":""}`,"svelte-1humrcv"),Mt(ct,"src",Gt),Y(j,1,`glsl ${x()??""}`,"svelte-1humrcv"),tt=at(j,"",tt,c)},[()=>({"max-width":x()=="preview"?"calc(var(--compact-width) * 0.25)":x()=="background"?"100vw":`${e()}px`,"max-height":x()=="preview"?"auto":x()=="background"?"100vh":`${e()}px`,"background-color":a()})]),I(d,J),_t()}Pt(["click"]);export{ne as T,Ut as a,re as b,Dt as d,Gt as e,Ot as m,Bt as n};
