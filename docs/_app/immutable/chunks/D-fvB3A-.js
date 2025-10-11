import"./DsnmJJEf.js";import{o as ve,a as pe}from"./DV4HuBXD.js";import{p as xe,aH as M,ac as we,f as K,e as V,t as N,a as D,b as _e,i as T,k as p,j as I,at as Se,c as F,n as be,r as C,s as G,g as ye,aA as Le,a_ as Re}from"./DuvEInI2.js";import{d as Pe,s as W}from"./7z5teZwa.js";import{p as w,i as ae}from"./CjISyPlu.js";import{e as Te,i as Ee}from"./C1OkaSYx.js";import{s as Ae}from"./VGIlh5vR.js";import{s as Y}from"./DbemgwNU.js";import{s as se}from"./Dqri1z1Q.js";import{b as X}from"./CDnwwIrz.js";import{P as ke}from"./CpjGdiVG.js";import{g as Me}from"./W0MlifQN.js";import{w as Fe}from"./CIU2_X1e.js";const Ce=`#version 300 es

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
}`,Oe=`// Author: TapiocaFox
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
};`,Ue="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";function De(){const u=new Map,l=new Set;function f(t,s){for(const a of l)a(t,s)}function _(t){if(!t)return"unknown module";for(const[s,a]of u.entries())if(a.url===t||t.includes(a.url))return s;return"unknown module"}function S(t){const s=_(t.filename);f(s,t.error??t.message)}function L(t){let s="unknown module";if(t.reason instanceof Error&&t.reason.stack){const a=t.reason.stack;for(const E of u.values())if(a.includes(E.url)){s=_(E.url);break}}f(s,t.reason)}return window.addEventListener("error",S),window.addEventListener("unhandledrejection",L),{register(t,s){const a=u.get(t);a?.url&&URL.revokeObjectURL(a.url);const E=s.replace(/import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g,(d,y)=>{const g=u.get(y);return g?d.replace(y,g.url):d}),B=new Blob([E],{type:"application/javascript"}),b=URL.createObjectURL(B);return u.set(t,{code:s,url:b,exports:null}),b},async import(t){const s=u.get(t);if(!s)throw new Error(`Module "${t}" not found`);try{const a=await import(s.url);return s.exports=a,a}catch(a){throw f(t,a),a}},async replace(t,s){this.register(t,s),await this.reloadAll()},async reloadAll(){for(const[t,s]of u.entries())try{const a=await import(s.url);s.exports=a}catch(a){f(t,a),console.error(`Failed to reload module "${t}":`,a)}},clear(){for(const t of u.values())URL.revokeObjectURL(t.url);u.clear(),l.clear(),window.removeEventListener("error",S),window.removeEventListener("unhandledrejection",L)},addUncaughtErrorListener(t){l.add(t)},removeUncaughtErrorListener(t){l.delete(t)}}}const rt="fgl",Ie=Fe(null);function Be(u,l,f,_,S){Ie.set({name:"",timestamp:0,img:"",vert:l(),frag:f(),js:_(),assets:S()}),Me("/webgl_editor")}var je=K("<br/><span> </span>",1),He=K('<div><h3> </h3> <p class="annotation"> <!></p></div>'),ze=K('<button><img class="inline-glyph" alt="Edit"/>Edit</button> <!> <canvas></canvas>',1);function ot(u,l){xe(l,!0);let f=w(l,"vertex_shader",27,()=>M(Ce)),_=w(l,"fragment_shader",27,()=>M(Ge)),S=w(l,"javascript",27,()=>M(Oe)),L=w(l,"assets",27,()=>M({})),t=w(l,"mode",3,"default"),s=w(l,"size",3,250),a=w(l,"show_status_block",3,!0),E=w(l,"background_color",3,"transparent"),B=w(l,"onglinit",3,async function(c){return!0}),b=w(l,"onerror",3,async function(c,P){console.trace(P)});var d,y,g;let O=I(!1),R=I(!1),Z=I(0),j=I("Rendering Status"),H=M({});const ie=.5,U=32;let v;const q=(c,P)=>{console.log("module:",c,`
error:`,P),b()("js",{module:c,error:P})};we(()=>{f(),_(),S(),L(),v&&(v.newProgram(),v.setShadersScriptAndAssets(f(),_(),S(),L()),v.refreshShadersAndScript())}),ve(async()=>{try{const c=d.getContext("webgl2",{preserveDrawingBuffer:t()=="in-editor"});v={gl:c,canvas:d,program:c.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:T(j),statusDict:H,vertexShader:"",fragmentShader:"",sandbox:De(),indexModule:null,assets:{},loadedScripts:[],async start(){try{await this.indexModule?.start?.(this)}catch(e){b()("js",{module:"index",error:e})}},async stop(){try{await this.indexModule?.stop?.(this)}catch(e){b()("js",{module:"index",error:e})}},async optimizeViewPort(){const e=this.gl,r=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),o=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==r||this.canvas.height!==o)&&(this.canvas.width=r,this.canvas.height=o,e.viewport(0,0,r,o)),await Se()},unloadLoadedScripts(){this.loadedScripts.forEach(e=>{document.head.removeChild(e)}),this.loadedScripts=[]},initProgram(e,r){const o=this.gl,i=(n,h)=>{const x=o.createShader(n);o.shaderSource(x,h),o.compileShader(x);const m=o.getShaderInfoLog(x);if(!o.getShaderParameter(x,o.COMPILE_STATUS)||m?.trim().length)throw`Cannot compile shader: ${m}`;o.attachShader(this.program,x)};try{i(o.VERTEX_SHADER,e)}catch(n){throw b()("vert",n),n}try{i(o.FRAGMENT_SHADER,r)}catch(n){throw b()("frag",n),n}if(o.linkProgram(this.program),!o.getProgramParameter(this.program,o.LINK_STATUS))throw`Cannot link program:
${o.getProgramInfoLog(this.program)}`;o.useProgram(this.program)},async importIndexModule(){try{this.indexModule=await this.sandbox.import("index")}catch(e){b()("js",{module:"index",error:e})}},render(){const e=this.gl,r=Date.now();p(Z,1e3/(r-this.lastRenderTime)),this.lastRenderTime=r,e.drawArrays(e.TRIANGLES,0,6)},newProgram(){const e=this.gl;e.getAttachedShaders(this.program)?.forEach(o=>{e.detachShader(this.program,o),e.deleteShader(o)}),e.deleteProgram(this.program),this.program=e.createProgram()},async reset(){const e=this.gl;this.newProgram(),await this.stop(),this.unloadLoadedScripts(),await this.optimizeViewPort(),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const r=this.statusDict;for(const o in r)delete r[o];this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setShadersScriptAndAssets(e,r,o,i){this.vertexShader=e,this.fragmentShader=r,this.sandbox.register("index",o),this.assets=i},async refreshShadersAndScript(){await this.stop(),this.unloadLoadedScripts(),await this.optimizeViewPort(),this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setStatusTitle(e){p(j,e,!0)},reportStatus(e,r,o="inherit"){this.statusDict[e]={text:r,color:o}},async loadScriptFromSource(e){return new Promise((r,o)=>{const i=document.createElement("script");i.src=e,i.onload=()=>r(),i.onerror=n=>o(n),document.head.appendChild(i),this.loadedScripts.push(i)})},async getAssetById(e){const r=this.assets[e];if(typeof r>"u"||r==null)throw`Asset with id "${e}" does not exist.`;if(r.type=="image")return new Promise((o,i)=>{const n=new Image;n.crossOrigin="anonymous",n.onload=()=>o(n),n.onerror=h=>i(h),n.src=r.src,n.complete&&o(n)});if(r.type==="audio")return new Promise((o,i)=>{const n=new Audio;n.crossOrigin="anonymous",n.oncanplaythrough=()=>o(n),n.onerror=h=>i(h),n.src=r.src,n.load()});throw"Not implemented"}},v.sandbox.addUncaughtErrorListener(q),new ResizeObserver(e=>{v.optimizeViewPort()}).observe(d),d.addEventListener("pointermove",async e=>{const r=d.getBoundingClientRect(),o=r.bottom-r.top;if(a()){p(O,!0),t()=="default"&&p(R,!0);const{clientX:i,clientY:n}=e,h=window.innerWidth,x=window.innerHeight,m=y.offsetWidth,k=y.offsetHeight;(r.left+r.right)*.5<=h*ie?(y.animate({left:`${Math.min(i+U,h-m)}px`,top:`${Math.min(n+U,x-k)}px`},{fill:"forwards"}),g.animate({left:`${r.left}px`,top:`${r.bottom+4}px`},{fill:"forwards"})):(y.animate({right:`${Math.max(h-i+U,0)}px`,top:`${Math.min(n+U,x-k)}px`},{fill:"forwards"}),g.animate({right:`${h-r.right}px`,top:`${r.bottom+4}px`},{fill:"forwards"}))}}),d.addEventListener("pointerleave",async e=>{if(p(O,!1),g==null)return;const r=d.getBoundingClientRect(),o=g.getBoundingClientRect();if(a()){const{clientX:i,clientY:n}=e;o.left<=i&&i<=o.right&&n>r.top?p(R,!0):p(R,!1)}}),document.addEventListener("scroll",async e=>{p(O,!1),p(R,!1)},!0),d.addEventListener("webglcontextlost",async e=>{e.preventDefault(),console.warn("GLSL canvas WebGL context lost!")});const te=await B()(v);v.setShadersScriptAndAssets(f(),_(),S(),L()),te&&await v.refreshShadersAndScript()}catch(c){console.trace(c)}g.onpointerenter=async c=>{t()=="default"&&p(R,!0)},g.onpointerleave=async c=>{p(R,!1)}}),pe(()=>{v?.sandbox.removeUncaughtErrorListener(q)});var J=ze(),A=V(J);A.__click=[Be,f,_,S,L];var ce=F(A);be(),C(A),X(A,c=>g=c,()=>g);var Q=G(A,2);{var le=c=>{ke(c,{target:"body",children:(P,te)=>{var e=He(),r=F(e),o=F(r,!0);C(r);var i=G(r,2),n=F(i),h=G(n);{var x=m=>{var k=ye(),de=V(k);Te(de,17,()=>Object.entries(H),Ee,(ue,he)=>{var me=Le(()=>Re(T(he),2));let re=()=>T(me)[1];var oe=je(),$=G(V(oe));let ne;var fe=F($,!0);C($),N(ge=>{ne=se($,"",ne,ge),W(fe,re().text)},[()=>({color:re().color})]),D(ue,oe)}),D(m,k)};ae(h,m=>{H!=null&&m(x)})}C(i),C(e),X(e,m=>y=m,()=>y),N(m=>{Y(e,1,`floating-block ${T(O)&&t()!="background"?"visible":""}`),W(o,T(j)),W(n,`FPS: ${m??""} `)},[()=>`${Math.round(T(Z))} (${d?.width}x${d?.height})`]),D(P,e)},$$slots:{default:!0}})};ae(Q,c=>{a()&&c(le)})}var z=G(Q,2);let ee;X(z,c=>d=c,()=>d),N(c=>{Y(A,1,`edit ${T(R)?"visible":""}`,"svelte-1humrcv"),Ae(ce,"src",Ue),Y(z,1,`glsl ${t()??""}`,"svelte-1humrcv"),ee=se(z,"",ee,c)},[()=>({"max-width":t()=="preview"?"calc(var(--compact-width) * 0.25)":t()=="background"?"100vw":`${s()}px`,"max-height":t()=="preview"?"auto":t()=="background"?"100vh":`${s()}px`,"background-color":E()})]),D(u,J),_e()}Pe(["click"]);export{ot as T,Ge as a,Oe as b,rt as c,Ce as d,Ue as e,Ie as n};
