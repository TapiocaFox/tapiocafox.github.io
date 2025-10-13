import"./DsnmJJEf.js";import{o as vt,a as pt}from"./DZor6qtp.js";import{p as xt,aB as F,ab as wt,f as K,e as V,t as N,a as I,b as _t,i as M,k as w,j as B,as as bt,c as D,n as yt,r as U,s as O,g as Rt,az as St,b8 as Lt}from"./UuebQw-N.js";import{d as Pt,s as W}from"./CWSVVgTL.js";import{p as y,i as st}from"./BNnMBqfr.js";import{e as Tt,i as Mt}from"./DLdQWlW5.js";import{s as Et}from"./Bczg0Zq0.js";import{s as Y}from"./BI6CLnWE.js";import{s as at}from"./CK7EHw7e.js";import{b as X}from"./XPBOPOQb.js";import{P as At}from"./BlnfjrZp.js";import{g as kt}from"./DcUjF7w4.js";import{w as Ft}from"./WXnP_9PU.js";const Dt=`#version 300 es

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
};`,Ct={index:Ot},Gt="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";function It(){const u=new Map,l=new Set;function _(e,n){for(const a of l)a(e,n)}function R(e){if(!e)return"unknown module";for(const[n,a]of u.entries())if(a.url===e||e?.includes(a.url))return n;return"unknown module"}window.addEventListener("error",e=>{const n=R(e.filename);_(n,e.error??e.message)}),window.addEventListener("unhandledrejection",e=>{const n=e.reason;if(!(n instanceof Error)||!n.stack)return;const a=[...u.values()].find(m=>n.stack?.includes(m.url));a&&_(R(a.url),n)});function L(e){const n=[];return e.replace(/import\s+(?:.+?)\s+from\s+['"]([^'"]+)['"]/g,(a,m)=>(n.push(m),a)),n}function E(){const e=new Set,n=new Set,a=[];function m(i,h=[]){if(e.has(i))return;if(n.has(i)){const f=[...h,i].join(" -> ");throw new Error(`Circular dependency detected: ${f}`)}n.add(i);const S=u.get(i);if(!S)throw new Error(`Module "${i}" not found for topological sort`);for(const f of S.deps)u.has(f)&&m(f,[...h,i]);n.delete(i),e.add(i),a.push(i)}for(const i of u.keys())m(i);return a}function p(e){return e.replace(/import\s+(.+?)\s+from\s+['"]([^'"]+)['"]/g,(n,a,m)=>{const i=u.get(m);return i?.url?`import ${a} from '${i.url}'`:n})}return{register(e,n){if(u.has(e)){const a=u.get(e);a.url&&URL.revokeObjectURL(a.url)}u.set(e,{code:n,url:null,exports:null,deps:L(n)})},commit(){const e=E();for(const n of e){const a=u.get(n),m=p(a.code);a.url&&URL.revokeObjectURL(a.url);const i=new Blob([m],{type:"application/javascript"});a.url=URL.createObjectURL(i)}},async import(e){const n=u.get(e);if(!n||!n.url)throw new Error(`Module "${e}" not committed`);try{const a=await import(n.url);return n.exports=a,a}catch(a){throw _(e,a),a}},async replace(e,n){this.register(e,n),this.commit(),await this.reloadAll()},clear(){for(const e of u.values())e.url&&URL.revokeObjectURL(e.url);u.clear(),l.clear()},addUncaughtErrorListener(e){l.add(e)},removeUncaughtErrorListener(e){l.delete(e)}}}const re="fgl",Bt=Ft(null);function $t(u,l,_,R,L){Bt.set({name:"",timestamp:0,img:"",vert:l(),frag:_(),modules:R(),assets:L()}),kt("/webgl_editor")}var Ht=K("<br/><span> </span>",1),jt=K('<div><h3> </h3> <p class="annotation"> <!></p></div>'),zt=K('<button><img class="inline-glyph" alt="Edit"/>Edit</button> <!> <canvas></canvas>',1);function ne(u,l){xt(l,!0);let _=y(l,"vertex_shader",27,()=>F(Dt)),R=y(l,"fragment_shader",27,()=>F(Ut)),L=y(l,"modules",27,()=>F(Ct)),E=y(l,"assets",27,()=>F({})),p=y(l,"mode",3,"default"),e=y(l,"size",3,250),n=y(l,"show_status_block",3,!0),a=y(l,"background_color",3,"transparent"),m=y(l,"onglinit",3,async function(c){return!0}),i=y(l,"onerror",3,async function(c,T){console.trace(T)});var h,S,f;let C=B(!1),P=B(!1),Z=B(0),$=B("Rendering Status"),H=F({});const it=.5,G=32;let x;const q=(c,T)=>{console.log("module:",c,`
error:`,T),i()("js",{module:c,error:T})};wt(()=>{_(),R(),L(),E(),x&&(x.newProgram(),x.setShadersModulesAndAssets(_(),R(),L(),E()),x.refreshShadersAndModules())}),vt(async()=>{try{const c=h.getContext("webgl2",{preserveDrawingBuffer:p()=="in-editor"});x={gl:c,canvas:h,program:c.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:M($),statusDict:H,vertexShader:"",fragmentShader:"",sandbox:It(),indexModule:null,assets:{},async start(){try{await this.indexModule?.start?.(this)}catch(t){i()("js",{module:"index",error:t})}},async stop(){try{await this.indexModule?.stop?.(this)}catch(t){i()("js",{module:"index",error:t})}},async optimizeViewPort(){const t=this.gl,o=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),r=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==o||this.canvas.height!==r)&&(this.canvas.width=o,this.canvas.height=r,t.viewport(0,0,o,r)),await bt()},initProgram(t,o){const r=this.gl,d=(s,g)=>{const b=r.createShader(s);r.shaderSource(b,g),r.compileShader(b);const v=r.getShaderInfoLog(b);if(!r.getShaderParameter(b,r.COMPILE_STATUS)||v?.trim().length)throw`Cannot compile shader: ${v}`;r.attachShader(this.program,b)};try{d(r.VERTEX_SHADER,t)}catch(s){throw i()("vert",s),s}try{d(r.FRAGMENT_SHADER,o)}catch(s){throw i()("frag",s),s}if(r.linkProgram(this.program),!r.getProgramParameter(this.program,r.LINK_STATUS))throw`Cannot link program:
${r.getProgramInfoLog(this.program)}`;r.useProgram(this.program)},async importIndexModule(){try{this.indexModule=await this.sandbox.import("index")}catch(t){i()("js",{module:"index",error:t})}},render(){const t=this.gl,o=Date.now();w(Z,1e3/(o-this.lastRenderTime)),this.lastRenderTime=o,t.drawArrays(t.TRIANGLES,0,6)},newProgram(){const t=this.gl;t.getAttachedShaders(this.program)?.forEach(r=>{t.detachShader(this.program,r),t.deleteShader(r)}),t.deleteProgram(this.program),this.program=t.createProgram()},async reset(){const t=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const o=this.statusDict;for(const r in o)delete o[r];this.sandbox.commit(),this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setShadersModulesAndAssets(t,o,r,d){this.vertexShader=t,this.fragmentShader=o;try{this.sandbox.clear();for(const s in r)this.sandbox.register(s,r[s]);this.assets=d}catch(s){i()("js",{module:"index",error:s})}},async refreshShadersAndModules(){await this.stop(),await this.optimizeViewPort();const t=this.statusDict;for(const o in t)delete t[o];this.sandbox.commit(),this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setStatusTitle(t){w($,t,!0)},reportStatus(t,o,r="inherit"){this.statusDict[t]={text:o,color:r}},async getAssetById(t){const o=this.assets[t];if(typeof o>"u"||o==null)throw`Asset with id "${t}" does not exist.`;if(o.type=="image")return new Promise((r,d)=>{const s=new Image;s.crossOrigin="anonymous",s.onload=()=>r(s),s.onerror=g=>d(g),s.src=o.src,s.complete&&r(s)});if(o.type==="audio")return new Promise((r,d)=>{const s=new Audio;s.crossOrigin="anonymous",s.oncanplaythrough=()=>r(s),s.onerror=g=>d(g),s.src=o.src,s.load()});throw"Not implemented"}},x.sandbox.addUncaughtErrorListener(q),new ResizeObserver(t=>{x.optimizeViewPort()}).observe(h),h.addEventListener("pointermove",async t=>{const o=h.getBoundingClientRect(),r=o.bottom-o.top;if(n()){w(C,!0),p()=="default"&&w(P,!0);const{clientX:d,clientY:s}=t,g=window.innerWidth,b=window.innerHeight,v=S.offsetWidth,k=S.offsetHeight;(o.left+o.right)*.5<=g*it?(S.animate({left:`${Math.min(d+G,g-v)}px`,top:`${Math.min(s+G,b-k)}px`},{fill:"forwards"}),f.animate({left:`${o.left}px`,top:`${o.bottom+4}px`},{fill:"forwards"})):(S.animate({right:`${Math.max(g-d+G,0)}px`,top:`${Math.min(s+G,b-k)}px`},{fill:"forwards"}),f.animate({right:`${g-o.right}px`,top:`${o.bottom+4}px`},{fill:"forwards"}))}}),h.addEventListener("pointerleave",async t=>{if(w(C,!1),f==null)return;const o=h.getBoundingClientRect(),r=f.getBoundingClientRect();if(n()){const{clientX:d,clientY:s}=t;r.left<=d&&d<=r.right&&s>o.top?w(P,!0):w(P,!1)}}),document.addEventListener("scroll",async t=>{w(C,!1),w(P,!1)},!0),h.addEventListener("webglcontextlost",async t=>{t.preventDefault(),console.warn("GLSL canvas WebGL context lost!")});const et=await m()(x);x.setShadersModulesAndAssets(_(),R(),L(),E()),et&&await x.refreshShadersAndModules()}catch(c){console.trace(c)}f.onpointerenter=async c=>{p()=="default"&&w(P,!0)},f.onpointerleave=async c=>{w(P,!1)}}),pt(()=>{x?.sandbox.removeUncaughtErrorListener(q)});var J=zt(),A=V(J);A.__click=[$t,_,R,L,E];var ct=D(A);yt(),U(A),X(A,c=>f=c,()=>f);var Q=O(A,2);{var lt=c=>{At(c,{target:"body",children:(T,et)=>{var t=jt(),o=D(t),r=D(o,!0);U(o);var d=O(o,2),s=D(d),g=O(s);{var b=v=>{var k=Rt(),dt=V(k);Tt(dt,17,()=>Object.entries(H),Mt,(ut,ht)=>{var ft=St(()=>Lt(M(ht),2));let ot=()=>M(ft)[1];var rt=Ht(),z=O(V(rt));let nt;var mt=D(z,!0);U(z),N(gt=>{nt=at(z,"",nt,gt),W(mt,ot().text)},[()=>({color:ot().color})]),I(ut,rt)}),I(v,k)};st(g,v=>{H!=null&&v(b)})}U(d),U(t),X(t,v=>S=v,()=>S),N(v=>{Y(t,1,`floating-block ${M(C)&&p()!="background"?"visible":""}`),W(r,M($)),W(s,`FPS: ${v??""} `)},[()=>`${Math.round(M(Z))} (${h?.width}x${h?.height})`]),I(T,t)},$$slots:{default:!0}})};st(Q,c=>{n()&&c(lt)})}var j=O(Q,2);let tt;X(j,c=>h=c,()=>h),N(c=>{Y(A,1,`edit ${M(P)?"visible":""}`,"svelte-1humrcv"),Et(ct,"src",Gt),Y(j,1,`glsl ${p()??""}`,"svelte-1humrcv"),tt=at(j,"",tt,c)},[()=>({"max-width":p()=="preview"?"calc(var(--compact-width) * 0.25)":p()=="background"?"100vw":`${e()}px`,"max-height":p()=="preview"?"auto":p()=="background"?"100vh":`${e()}px`,"background-color":a()})]),I(u,J),_t()}Pt(["click"]);export{ne as T,Ut as a,re as b,Dt as d,Gt as e,Ct as m,Bt as n};
