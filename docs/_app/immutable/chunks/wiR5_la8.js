import"./DsnmJJEf.js";import{o as pt,a as wt}from"./DZor6qtp.js";import{p as xt,aB as F,ab as _t,f as Z,e as N,t as W,a as $,b as bt,i as M,k as w,j as I,as as yt,c as D,n as Rt,r as U,s as O,g as St,az as Lt,b8 as Pt}from"./UuebQw-N.js";import{d as Tt,s as Y}from"./CWSVVgTL.js";import{p as y,i as at}from"./BNnMBqfr.js";import{e as Mt,i as At}from"./DLdQWlW5.js";import{s as Et}from"./Bczg0Zq0.js";import{s as X}from"./BI6CLnWE.js";import{s as it}from"./CK7EHw7e.js";import{b as K}from"./XPBOPOQb.js";import{P as kt}from"./BlnfjrZp.js";import{g as Ft}from"./VZNsOmOE.js";import{w as Dt}from"./WXnP_9PU.js";const Ut=`#version 300 es

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
};`,Gt={index:Ct},Bt="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";function $t(){const d=new Map,u=new Set;let x=[];function _(e,n){for(const a of u)a(e,n)}function R(e){if(!e)return"unknown module";for(const[n,a]of d.entries())if(a.url===e||e?.includes(a.url))return n;return"unknown module"}window.addEventListener("error",e=>{const n=R(e.filename);_(n,e.error??e.message)}),window.addEventListener("unhandledrejection",e=>{const n=e.reason;if(!(n instanceof Error)||!n.stack)return;const a=[...d.values()].find(l=>n.stack?.includes(l.url));a&&_(R(a.url),n)});function A(e){const n=[];return e.replace(/import\s+(?:.+?)\s+from\s+['"]([^'"]+)['"]/g,(a,l)=>(n.push(l),a)),n}function h(){const e=new Set,n=new Set,a=[];function l(i,S=[]){if(e.has(i))return;if(n.has(i)){const L=[...S,i].join(" -> ");throw new Error(`Circular dependency detected: ${L}`)}n.add(i);const v=d.get(i);if(!v)throw new Error(`Module "${i}" not found for topological sort`);for(const L of v.deps)d.has(L)&&l(L,[...S,i]);n.delete(i),e.add(i),a.push(i)}for(const i of d.keys())l(i);return a}function G(e){return e.replace(/import\s+(.+?)\s+from\s+['"]([^'"]+)['"]/g,(n,a,l)=>{const i=d.get(l);return i?.url?`import ${a} from '${i.url}'`:n})}return{register(e,n){if(d.has(e)){const a=d.get(e);a.url&&URL.revokeObjectURL(a.url)}d.set(e,{code:n,url:null,exports:null,deps:A(n)})},commit(){x=h();for(const e of x){const n=d.get(e),a=G(n.code);n.url&&URL.revokeObjectURL(n.url);const l=new Blob([a],{type:"application/javascript"});n.url=URL.createObjectURL(l)}},async import(e){const n=d.get(e);if(!n||!n.url)throw new Error(`Module "${e}" not committed`);try{const a=await import(n.url);return n.exports=a,a}catch(a){throw _(e,a),a}},async replace(e,n){this.register(e,n),this.commit()},async preloadAll(){for(const e of x){if(console.log("name",e),!d.get(e).url)return new Error(`Module "${e}" not committed`);try{await this.import(e)}catch(a){return a}}},clear(){for(const e of d.values())e.url&&URL.revokeObjectURL(e.url);d.clear()},addUncaughtErrorListener(e){u.add(e)},removeUncaughtErrorListener(e){u.delete(e)}}}const C="index",ne="fgl",It=Dt(null);function Ht(d,u,x,_,R){It.set({name:"",timestamp:0,img:"",vert:u(),frag:x(),modules:_(),assets:R()}),Ft("/webgl_editor")}var jt=Z("<br/><span> </span>",1),zt=Z('<div><h3> </h3> <p class="annotation"> <!></p></div>'),Vt=Z('<button><img class="inline-glyph" alt="Edit"/>Edit</button> <!> <canvas></canvas>',1);function se(d,u){xt(u,!0);let x=y(u,"vertex_shader",27,()=>F(Ut)),_=y(u,"fragment_shader",27,()=>F(Ot)),R=y(u,"modules",27,()=>F(Gt)),A=y(u,"assets",27,()=>F({})),h=y(u,"mode",3,"default"),G=y(u,"size",3,250),e=y(u,"show_status_block",3,!0),n=y(u,"background_color",3,"transparent"),a=y(u,"onglinit",3,async function(c){return!0}),l=y(u,"onerror",3,async function(c,T){console.trace(T)});var i,S,v;let L=I(!1),P=I(!1),q=I(0),H=I("Rendering Status"),j=F({});const ct=.5,B=32;let p;const J=(c,T)=>{console.log("module:",c,`
error:`,T),l()("js",{module:c,error:T})};_t(()=>{x(),_(),R(),A(),p&&(p.newProgram(),p.setShadersModulesAndAssets(x(),_(),R(),A()),p.refreshShadersAndModules())}),pt(async()=>{try{const c=i.getContext("webgl2",{preserveDrawingBuffer:h()=="in-editor"});p={gl:c,canvas:i,program:c.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:M(H),statusDict:j,vertexShader:"",fragmentShader:"",sandbox:$t(),defaultModule:null,assets:{},async start(){try{await this.defaultModule?.start?.(this)}catch(t){l()("js",{module:C,error:t})}},async stop(){try{await this.defaultModule?.stop?.(this)}catch(t){l()("js",{module:C,error:t})}},async optimizeViewPort(){const t=this.gl,o=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),r=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==o||this.canvas.height!==r)&&(this.canvas.width=o,this.canvas.height=r,t.viewport(0,0,o,r)),await yt()},initProgram(t,o){const r=this.gl,f=(s,m)=>{const b=r.createShader(s);r.shaderSource(b,m),r.compileShader(b);const g=r.getShaderInfoLog(b);if(!r.getShaderParameter(b,r.COMPILE_STATUS)||g?.trim().length)throw`Cannot compile shader: ${g}`;r.attachShader(this.program,b)};try{f(r.VERTEX_SHADER,t)}catch(s){throw l()("vert",s),s}try{f(r.FRAGMENT_SHADER,o)}catch(s){throw l()("frag",s),s}if(r.linkProgram(this.program),!r.getProgramParameter(this.program,r.LINK_STATUS))throw`Cannot link program:
${r.getProgramInfoLog(this.program)}`;r.useProgram(this.program)},async importDefaultModule(){try{this.defaultModule=await this.sandbox.import(C)}catch(t){l()("js",{module:C,error:t})}},render(){const t=this.gl,o=Date.now();w(q,1e3/(o-this.lastRenderTime)),this.lastRenderTime=o,t.drawArrays(t.TRIANGLES,0,6)},newProgram(){const t=this.gl;t.getAttachedShaders(this.program)?.forEach(r=>{t.detachShader(this.program,r),t.deleteShader(r)}),t.deleteProgram(this.program),this.program=t.createProgram()},async reset(){const t=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const o=this.statusDict;for(const r in o)delete o[r];this.sandbox.commit(),!(h()=="in-editor"&&await this.sandbox.preloadAll())&&(this.initProgram(this.vertexShader,this.fragmentShader),await this.importDefaultModule(),await this.start())},setShadersModulesAndAssets(t,o,r,f){this.vertexShader=t,this.fragmentShader=o;try{this.sandbox.clear();for(const s in r)this.sandbox.register(s,r[s]);this.assets=f}catch(s){l()("js",{module:C,error:s})}},async refreshShadersAndModules(){await this.stop(),await this.optimizeViewPort();const t=this.statusDict;for(const o in t)delete t[o];this.sandbox.commit(),!(h()=="in-editor"&&await this.sandbox.preloadAll())&&(this.initProgram(this.vertexShader,this.fragmentShader),await this.importDefaultModule(),await this.start())},setStatusTitle(t){w(H,t,!0)},reportStatus(t,o,r="inherit"){this.statusDict[t]={text:o,color:r}},async getAssetById(t){const o=this.assets[t];if(typeof o>"u"||o==null)throw`Asset with id "${t}" does not exist.`;if(o.type=="image")return new Promise((r,f)=>{const s=new Image;s.crossOrigin="anonymous",s.onload=()=>r(s),s.onerror=m=>f(m),s.src=o.src,s.complete&&r(s)});if(o.type==="audio")return new Promise((r,f)=>{const s=new Audio;s.crossOrigin="anonymous",s.oncanplaythrough=()=>r(s),s.onerror=m=>f(m),s.src=o.src,s.load()});throw"Not implemented"}},p.sandbox.addUncaughtErrorListener(J),new ResizeObserver(t=>{p.optimizeViewPort()}).observe(i),i.addEventListener("pointermove",async t=>{const o=i.getBoundingClientRect(),r=o.bottom-o.top;if(e()){w(L,!0),h()=="default"&&w(P,!0);const{clientX:f,clientY:s}=t,m=window.innerWidth,b=window.innerHeight,g=S.offsetWidth,k=S.offsetHeight;(o.left+o.right)*.5<=m*ct?(S.animate({left:`${Math.min(f+B,m-g)}px`,top:`${Math.min(s+B,b-k)}px`},{fill:"forwards"}),v.animate({left:`${o.left}px`,top:`${o.bottom+4}px`},{fill:"forwards"})):(S.animate({right:`${Math.max(m-f+B,0)}px`,top:`${Math.min(s+B,b-k)}px`},{fill:"forwards"}),v.animate({right:`${m-o.right}px`,top:`${o.bottom+4}px`},{fill:"forwards"}))}}),i.addEventListener("pointerleave",async t=>{if(w(L,!1),v==null)return;const o=i.getBoundingClientRect(),r=v.getBoundingClientRect();if(e()){const{clientX:f,clientY:s}=t;r.left<=f&&f<=r.right&&s>o.top?w(P,!0):w(P,!1)}}),document.addEventListener("scroll",async t=>{w(L,!1),w(P,!1)},!0),i.addEventListener("webglcontextlost",async t=>{t.preventDefault(),console.warn("GLSL canvas WebGL context lost!")});const ot=await a()(p);p.setShadersModulesAndAssets(x(),_(),R(),A()),ot&&await p.refreshShadersAndModules()}catch(c){console.trace(c)}v.onpointerenter=async c=>{h()=="default"&&w(P,!0)},v.onpointerleave=async c=>{w(P,!1)}}),wt(()=>{p?.sandbox.removeUncaughtErrorListener(J)});var Q=Vt(),E=N(Q);E.__click=[Ht,x,_,R,A];var lt=D(E);Rt(),U(E),K(E,c=>v=c,()=>v);var tt=O(E,2);{var dt=c=>{kt(c,{target:"body",children:(T,ot)=>{var t=zt(),o=D(t),r=D(o,!0);U(o);var f=O(o,2),s=D(f),m=O(s);{var b=g=>{var k=St(),ut=N(k);Mt(ut,17,()=>Object.entries(j),At,(ft,ht)=>{var mt=Lt(()=>Pt(M(ht),2));let rt=()=>M(mt)[1];var nt=jt(),V=O(N(nt));let st;var gt=D(V,!0);U(V),W(vt=>{st=it(V,"",st,vt),Y(gt,rt().text)},[()=>({color:rt().color})]),$(ft,nt)}),$(g,k)};at(m,g=>{j!=null&&g(b)})}U(f),U(t),K(t,g=>S=g,()=>S),W(g=>{X(t,1,`floating-block ${M(L)&&h()!="background"?"visible":""}`),Y(r,M(H)),Y(s,`FPS: ${g??""} `)},[()=>`${Math.round(M(q))} (${i?.width}x${i?.height})`]),$(T,t)},$$slots:{default:!0}})};at(tt,c=>{e()&&c(dt)})}var z=O(tt,2);let et;K(z,c=>i=c,()=>i),W(c=>{X(E,1,`edit ${M(P)?"visible":""}`,"svelte-1humrcv"),Et(lt,"src",Bt),X(z,1,`glsl ${h()??""}`,"svelte-1humrcv"),et=it(z,"",et,c)},[()=>({"max-width":h()=="preview"?"calc(var(--compact-width) * 0.25)":h()=="background"?"100vw":`${G()}px`,"max-height":h()=="preview"?"auto":h()=="background"?"100vh":`${G()}px`,"background-color":n()})]),$(d,Q),bt()}Tt(["click"]);export{se as T,Ot as a,C as b,ne as c,Ut as d,Bt as e,Gt as m,It as n};
