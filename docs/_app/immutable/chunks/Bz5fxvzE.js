import"./DsnmJJEf.js";import{o as ve,a as pe}from"./DqN36zCW.js";import{p as xe,aH as F,ac as we,f as K,e as V,t as W,a as C,b as _e,i as T,k as p,j as B,at as be,c as D,n as ye,r as G,s as I,g as Se,aA as Re,a_ as Le}from"./zC4ltpG_.js";import{d as Pe,s as N}from"./DyeTuOka.js";import{p as w,i as ae}from"./BP8gfJQl.js";import{e as Te,i as Ae}from"./DJqZe8kS.js";import{s as Ee}from"./Bjdap51O.js";import{s as Y}from"./D1WZr8Hc.js";import{s as se}from"./BfHYcZ64.js";import{b as X}from"./DclQEQ9f.js";import{P as ke}from"./DG-LWYYU.js";import{g as Me}from"./W_CAL3Lb.js";import{w as Fe}from"./Bm9bkr3D.js";const De=`#version 300 es

// Author: TapiocaFox
// Title:  Default Vertex Shader

in  vec3 aPos;
out vec3 vPos;

void main() {
    gl_Position = vec4(aPos, 1.);
    vPos = aPos;
}`,Ge=`#version 300 es

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
}`,Ie=`// Author: TapiocaFox
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
};`,Oe="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";function Ue(){const u=new Map,c=new Set;function f(r,a){for(const s of c)s(r,a)}function _(r){if(!r)return"unknown module";for(const[a,s]of u.entries())if(s.url===r||r.includes(s.url))return a;return"unknown module"}function b(r){const a=_(r.filename);f(a,r.error??r.message)}function R(r){const a=r.reason;if(!(a instanceof Error)||!a.stack)return;const s=a.stack,A=[...u.values()].find(k=>s.includes(k.url));A?f(_(A.url),a):console.debug("[Sandbox] Ignoring external promise rejection:",a)}return window.addEventListener("error",b),window.addEventListener("unhandledrejection",R),{register(r,a){const s=u.get(r);s?.url&&URL.revokeObjectURL(s.url);const A=a.replace(/import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g,(d,S)=>{const g=u.get(S);return g?d.replace(S,g.url):d}),k=new Blob([A],{type:"application/javascript"}),y=URL.createObjectURL(k);return u.set(r,{code:a,url:y,exports:null}),y},async import(r){const a=u.get(r);if(!a)throw new Error(`Module "${r}" not found`);try{const s=await import(a.url);return a.exports=s,s}catch(s){throw f(r,s),s}},async replace(r,a){this.register(r,a),await this.reloadAll()},async reloadAll(){for(const[r,a]of u.entries())try{const s=await import(a.url);a.exports=s}catch(s){f(r,s),console.error(`Failed to reload module "${r}":`,s)}},clear(){for(const r of u.values())URL.revokeObjectURL(r.url);u.clear(),c.clear(),window.removeEventListener("error",b),window.removeEventListener("unhandledrejection",R)},addUncaughtErrorListener(r){c.add(r)},removeUncaughtErrorListener(r){c.delete(r)}}}const rt="fgl",Ce=Fe(null);function Be(u,c,f,_,b){Ce.set({name:"",timestamp:0,img:"",vert:c(),frag:f(),js:_(),assets:b()}),Me("/webgl_editor")}var je=K("<br/><span> </span>",1),He=K('<div><h3> </h3> <p class="annotation"> <!></p></div>'),ze=K('<button><img class="inline-glyph" alt="Edit"/>Edit</button> <!> <canvas></canvas>',1);function nt(u,c){xe(c,!0);let f=w(c,"vertex_shader",27,()=>F(De)),_=w(c,"fragment_shader",27,()=>F(Ge)),b=w(c,"javascript",27,()=>F(Ie)),R=w(c,"assets",27,()=>F({})),r=w(c,"mode",3,"default"),a=w(c,"size",3,250),s=w(c,"show_status_block",3,!0),A=w(c,"background_color",3,"transparent"),k=w(c,"onglinit",3,async function(i){return!0}),y=w(c,"onerror",3,async function(i,P){console.trace(P)});var d,S,g;let O=B(!1),L=B(!1),Z=B(0),j=B("Rendering Status"),H=F({});const ie=.5,U=32;let v;const q=(i,P)=>{console.log("module:",i,`
error:`,P),y()("js",{module:i,error:P})};we(()=>{f(),_(),b(),R(),v&&(v.newProgram(),v.setShadersScriptAndAssets(f(),_(),b(),R()),v.refreshShadersAndScript())}),ve(async()=>{try{const i=d.getContext("webgl2",{preserveDrawingBuffer:r()=="in-editor"});v={gl:i,canvas:d,program:i.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:T(j),statusDict:H,vertexShader:"",fragmentShader:"",sandbox:Ue(),indexModule:null,assets:{},async start(){try{await this.indexModule?.start?.(this)}catch(e){y()("js",{module:"index",error:e})}},async stop(){try{await this.indexModule?.stop?.(this)}catch(e){y()("js",{module:"index",error:e})}},async optimizeViewPort(){const e=this.gl,t=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),n=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n)),await be()},initProgram(e,t){const n=this.gl,l=(o,h)=>{const x=n.createShader(o);n.shaderSource(x,h),n.compileShader(x);const m=n.getShaderInfoLog(x);if(!n.getShaderParameter(x,n.COMPILE_STATUS)||m?.trim().length)throw`Cannot compile shader: ${m}`;n.attachShader(this.program,x)};try{l(n.VERTEX_SHADER,e)}catch(o){throw y()("vert",o),o}try{l(n.FRAGMENT_SHADER,t)}catch(o){throw y()("frag",o),o}if(n.linkProgram(this.program),!n.getProgramParameter(this.program,n.LINK_STATUS))throw`Cannot link program:
${n.getProgramInfoLog(this.program)}`;n.useProgram(this.program)},async importIndexModule(){try{this.indexModule=await this.sandbox.import("index")}catch(e){y()("js",{module:"index",error:e})}},render(){const e=this.gl,t=Date.now();p(Z,1e3/(t-this.lastRenderTime)),this.lastRenderTime=t,e.drawArrays(e.TRIANGLES,0,6)},newProgram(){const e=this.gl;e.getAttachedShaders(this.program)?.forEach(n=>{e.detachShader(this.program,n),e.deleteShader(n)}),e.deleteProgram(this.program),this.program=e.createProgram()},async reset(){const e=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const t=this.statusDict;for(const n in t)delete t[n];this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setShadersScriptAndAssets(e,t,n,l){this.vertexShader=e,this.fragmentShader=t,this.sandbox.register("index",n),this.assets=l},async refreshShadersAndScript(){await this.stop(),await this.optimizeViewPort();const e=this.statusDict;for(const t in e)delete e[t];this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setStatusTitle(e){p(j,e,!0)},reportStatus(e,t,n="inherit"){this.statusDict[e]={text:t,color:n}},async getAssetById(e){const t=this.assets[e];if(typeof t>"u"||t==null)throw`Asset with id "${e}" does not exist.`;if(t.type=="image")return new Promise((n,l)=>{const o=new Image;o.crossOrigin="anonymous",o.onload=()=>n(o),o.onerror=h=>l(h),o.src=t.src,o.complete&&n(o)});if(t.type==="audio")return new Promise((n,l)=>{const o=new Audio;o.crossOrigin="anonymous",o.oncanplaythrough=()=>n(o),o.onerror=h=>l(h),o.src=t.src,o.load()});throw"Not implemented"}},v.sandbox.addUncaughtErrorListener(q),new ResizeObserver(e=>{v.optimizeViewPort()}).observe(d),d.addEventListener("pointermove",async e=>{const t=d.getBoundingClientRect(),n=t.bottom-t.top;if(s()){p(O,!0),r()=="default"&&p(L,!0);const{clientX:l,clientY:o}=e,h=window.innerWidth,x=window.innerHeight,m=S.offsetWidth,M=S.offsetHeight;(t.left+t.right)*.5<=h*ie?(S.animate({left:`${Math.min(l+U,h-m)}px`,top:`${Math.min(o+U,x-M)}px`},{fill:"forwards"}),g.animate({left:`${t.left}px`,top:`${t.bottom+4}px`},{fill:"forwards"})):(S.animate({right:`${Math.max(h-l+U,0)}px`,top:`${Math.min(o+U,x-M)}px`},{fill:"forwards"}),g.animate({right:`${h-t.right}px`,top:`${t.bottom+4}px`},{fill:"forwards"}))}}),d.addEventListener("pointerleave",async e=>{if(p(O,!1),g==null)return;const t=d.getBoundingClientRect(),n=g.getBoundingClientRect();if(s()){const{clientX:l,clientY:o}=e;n.left<=l&&l<=n.right&&o>t.top?p(L,!0):p(L,!1)}}),document.addEventListener("scroll",async e=>{p(O,!1),p(L,!1)},!0),d.addEventListener("webglcontextlost",async e=>{e.preventDefault(),console.warn("GLSL canvas WebGL context lost!")});const te=await k()(v);v.setShadersScriptAndAssets(f(),_(),b(),R()),te&&await v.refreshShadersAndScript()}catch(i){console.trace(i)}g.onpointerenter=async i=>{r()=="default"&&p(L,!0)},g.onpointerleave=async i=>{p(L,!1)}}),pe(()=>{v?.sandbox.removeUncaughtErrorListener(q)});var J=ze(),E=V(J);E.__click=[Be,f,_,b,R];var ce=D(E);ye(),G(E),X(E,i=>g=i,()=>g);var Q=I(E,2);{var le=i=>{ke(i,{target:"body",children:(P,te)=>{var e=He(),t=D(e),n=D(t,!0);G(t);var l=I(t,2),o=D(l),h=I(o);{var x=m=>{var M=Se(),de=V(M);Te(de,17,()=>Object.entries(H),Ae,(ue,he)=>{var me=Re(()=>Le(T(he),2));let re=()=>T(me)[1];var ne=je(),$=I(V(ne));let oe;var fe=D($,!0);G($),W(ge=>{oe=se($,"",oe,ge),N(fe,re().text)},[()=>({color:re().color})]),C(ue,ne)}),C(m,M)};ae(h,m=>{H!=null&&m(x)})}G(l),G(e),X(e,m=>S=m,()=>S),W(m=>{Y(e,1,`floating-block ${T(O)&&r()!="background"?"visible":""}`),N(n,T(j)),N(o,`FPS: ${m??""} `)},[()=>`${Math.round(T(Z))} (${d?.width}x${d?.height})`]),C(P,e)},$$slots:{default:!0}})};ae(Q,i=>{s()&&i(le)})}var z=I(Q,2);let ee;X(z,i=>d=i,()=>d),W(i=>{Y(E,1,`edit ${T(L)?"visible":""}`,"svelte-1humrcv"),Ee(ce,"src",Oe),Y(z,1,`glsl ${r()??""}`,"svelte-1humrcv"),ee=se(z,"",ee,i)},[()=>({"max-width":r()=="preview"?"calc(var(--compact-width) * 0.25)":r()=="background"?"100vw":`${a()}px`,"max-height":r()=="preview"?"auto":r()=="background"?"100vh":`${a()}px`,"background-color":A()})]),C(u,J),_e()}Pe(["click"]);export{nt as T,Ge as a,Ie as b,rt as c,De as d,Oe as e,Ce as n};
