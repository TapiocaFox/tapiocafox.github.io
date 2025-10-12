import"./DsnmJJEf.js";import{o as ve,a as pe}from"./CidtCB1f.js";import{p as xe,aC as F,ac as we,f as K,e as V,t as W,a as I,b as _e,i as E,k as p,j,at as be,c as U,n as ye,r as O,s as D,g as Se,aA as Re,aY as Le}from"./B8VawDUK.js";import{d as Pe,s as Y}from"./BD7GFFUT.js";import{p as w,i as ae}from"./B8nbE8KQ.js";import{e as Te,i as Ae}from"./D3l8ge-y.js";import{s as Ee}from"./CNP_HMTE.js";import{s as N}from"./Cu_Ctwgx.js";import{s as se}from"./C_o_6dgy.js";import{b as X}from"./CypkVt3v.js";import{P as ke}from"./Dm4xiPMc.js";import{g as Me}from"./CetbUvN9.js";import{w as Fe}from"./dmmSv_4b.js";const Ue=`#version 300 es

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
};`,Ce="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";function Ge(){const u=new Map,c=new Set;function f(r,a){for(const s of c)s(r,a)}function _(r){if(!r)return"unknown module";for(const[a,s]of u.entries())if(s.url===r||r.includes(s.url))return a;return"unknown module"}function b(r){const a=_(r.filename);f(a,r.error??r.message)}function L(r){const a=r.reason;if(!(a instanceof Error)||!a.stack)return;const s=a.stack,y=[...u.values()].find(P=>s.includes(P.url));y?f(_(y.url),a):console.debug("[Sandbox] Ignoring external promise rejection:",a)}return window.addEventListener("error",b),window.addEventListener("unhandledrejection",L),{register(r,a){const s=u.get(r);s?.url&&URL.revokeObjectURL(s.url);const y=a.replace(/import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g,(d,R)=>{const g=u.get(R);return g?d.replace(R,g.url):d}),P=new Blob([y],{type:"application/javascript"}),S=URL.createObjectURL(P);return u.set(r,{code:a,url:S,exports:null}),S},async import(r){const a=u.get(r);if(!a)throw new Error(`Module "${r}" not found`);try{const s=await import(a.url);return a.exports=s,s}catch(s){throw f(r,s),s}},async replace(r,a){this.register(r,a),await this.reloadAll()},async reloadAll(){for(const[r,a]of u.entries())try{URL.revokeObjectURL(a.url);const s=new Blob([a.code],{type:"application/javascript"}),y=URL.createObjectURL(s);a.url=y;const P=await import(y);a.exports=P}catch(s){f(r,s),console.error(`Failed to reload module "${r}":`,s)}},clear(){for(const r of u.values())URL.revokeObjectURL(r.url);u.clear(),c.clear(),window.removeEventListener("error",b),window.removeEventListener("unhandledrejection",L)},addUncaughtErrorListener(r){c.add(r)},removeUncaughtErrorListener(r){c.delete(r)}}}const rt="fgl",Ie=Fe(null);function je(u,c,f,_,b){Ie.set({name:"",timestamp:0,img:"",vert:c(),frag:f(),js:_(),assets:b()}),Me("/webgl_editor")}var Be=K("<br/><span> </span>",1),He=K('<div><h3> </h3> <p class="annotation"> <!></p></div>'),ze=K('<button><img class="inline-glyph" alt="Edit"/>Edit</button> <!> <canvas></canvas>',1);function ot(u,c){xe(c,!0);let f=w(c,"vertex_shader",27,()=>F(Ue)),_=w(c,"fragment_shader",27,()=>F(Oe)),b=w(c,"javascript",27,()=>F(De)),L=w(c,"assets",27,()=>F({})),r=w(c,"mode",3,"default"),a=w(c,"size",3,250),s=w(c,"show_status_block",3,!0),y=w(c,"background_color",3,"transparent"),P=w(c,"onglinit",3,async function(i){return!0}),S=w(c,"onerror",3,async function(i,A){console.trace(A)});var d,R,g;let C=j(!1),T=j(!1),Z=j(0),B=j("Rendering Status"),H=F({});const ie=.5,G=32;let v;const q=(i,A)=>{console.log("module:",i,`
error:`,A),S()("js",{module:i,error:A})};we(()=>{f(),_(),b(),L(),v&&(v.newProgram(),v.setShadersScriptAndAssets(f(),_(),b(),L()),v.refreshShadersAndScript())}),ve(async()=>{try{const i=d.getContext("webgl2",{preserveDrawingBuffer:r()=="in-editor"});v={gl:i,canvas:d,program:i.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:E(B),statusDict:H,vertexShader:"",fragmentShader:"",sandbox:Ge(),indexModule:null,assets:{},async start(){try{await this.indexModule?.start?.(this)}catch(e){S()("js",{module:"index",error:e})}},async stop(){try{await this.indexModule?.stop?.(this)}catch(e){S()("js",{module:"index",error:e})}},async optimizeViewPort(){const e=this.gl,t=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),o=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==t||this.canvas.height!==o)&&(this.canvas.width=t,this.canvas.height=o,e.viewport(0,0,t,o)),await be()},initProgram(e,t){const o=this.gl,l=(n,h)=>{const x=o.createShader(n);o.shaderSource(x,h),o.compileShader(x);const m=o.getShaderInfoLog(x);if(!o.getShaderParameter(x,o.COMPILE_STATUS)||m?.trim().length)throw`Cannot compile shader: ${m}`;o.attachShader(this.program,x)};try{l(o.VERTEX_SHADER,e)}catch(n){throw S()("vert",n),n}try{l(o.FRAGMENT_SHADER,t)}catch(n){throw S()("frag",n),n}if(o.linkProgram(this.program),!o.getProgramParameter(this.program,o.LINK_STATUS))throw`Cannot link program:
${o.getProgramInfoLog(this.program)}`;o.useProgram(this.program)},async importIndexModule(){try{this.indexModule=await this.sandbox.import("index")}catch(e){S()("js",{module:"index",error:e})}},render(){const e=this.gl,t=Date.now();p(Z,1e3/(t-this.lastRenderTime)),this.lastRenderTime=t,e.drawArrays(e.TRIANGLES,0,6)},newProgram(){const e=this.gl;e.getAttachedShaders(this.program)?.forEach(o=>{e.detachShader(this.program,o),e.deleteShader(o)}),e.deleteProgram(this.program),this.program=e.createProgram()},async reset(){const e=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const t=this.statusDict;for(const o in t)delete t[o];await this.sandbox.reloadAll(),this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setShadersScriptAndAssets(e,t,o,l){this.vertexShader=e,this.fragmentShader=t,this.sandbox.register("index",o),this.assets=l},async refreshShadersAndScript(){await this.stop(),await this.optimizeViewPort();const e=this.statusDict;for(const t in e)delete e[t];this.initProgram(this.vertexShader,this.fragmentShader),await this.importIndexModule(),await this.start()},setStatusTitle(e){p(B,e,!0)},reportStatus(e,t,o="inherit"){this.statusDict[e]={text:t,color:o}},async getAssetById(e){const t=this.assets[e];if(typeof t>"u"||t==null)throw`Asset with id "${e}" does not exist.`;if(t.type=="image")return new Promise((o,l)=>{const n=new Image;n.crossOrigin="anonymous",n.onload=()=>o(n),n.onerror=h=>l(h),n.src=t.src,n.complete&&o(n)});if(t.type==="audio")return new Promise((o,l)=>{const n=new Audio;n.crossOrigin="anonymous",n.oncanplaythrough=()=>o(n),n.onerror=h=>l(h),n.src=t.src,n.load()});throw"Not implemented"}},v.sandbox.addUncaughtErrorListener(q),new ResizeObserver(e=>{v.optimizeViewPort()}).observe(d),d.addEventListener("pointermove",async e=>{const t=d.getBoundingClientRect(),o=t.bottom-t.top;if(s()){p(C,!0),r()=="default"&&p(T,!0);const{clientX:l,clientY:n}=e,h=window.innerWidth,x=window.innerHeight,m=R.offsetWidth,M=R.offsetHeight;(t.left+t.right)*.5<=h*ie?(R.animate({left:`${Math.min(l+G,h-m)}px`,top:`${Math.min(n+G,x-M)}px`},{fill:"forwards"}),g.animate({left:`${t.left}px`,top:`${t.bottom+4}px`},{fill:"forwards"})):(R.animate({right:`${Math.max(h-l+G,0)}px`,top:`${Math.min(n+G,x-M)}px`},{fill:"forwards"}),g.animate({right:`${h-t.right}px`,top:`${t.bottom+4}px`},{fill:"forwards"}))}}),d.addEventListener("pointerleave",async e=>{if(p(C,!1),g==null)return;const t=d.getBoundingClientRect(),o=g.getBoundingClientRect();if(s()){const{clientX:l,clientY:n}=e;o.left<=l&&l<=o.right&&n>t.top?p(T,!0):p(T,!1)}}),document.addEventListener("scroll",async e=>{p(C,!1),p(T,!1)},!0),d.addEventListener("webglcontextlost",async e=>{e.preventDefault(),console.warn("GLSL canvas WebGL context lost!")});const te=await P()(v);v.setShadersScriptAndAssets(f(),_(),b(),L()),te&&await v.refreshShadersAndScript()}catch(i){console.trace(i)}g.onpointerenter=async i=>{r()=="default"&&p(T,!0)},g.onpointerleave=async i=>{p(T,!1)}}),pe(()=>{v?.sandbox.removeUncaughtErrorListener(q)});var J=ze(),k=V(J);k.__click=[je,f,_,b,L];var ce=U(k);ye(),O(k),X(k,i=>g=i,()=>g);var Q=D(k,2);{var le=i=>{ke(i,{target:"body",children:(A,te)=>{var e=He(),t=U(e),o=U(t,!0);O(t);var l=D(t,2),n=U(l),h=D(n);{var x=m=>{var M=Se(),de=V(M);Te(de,17,()=>Object.entries(H),Ae,(ue,he)=>{var me=Re(()=>Le(E(he),2));let re=()=>E(me)[1];var oe=Be(),$=D(V(oe));let ne;var fe=U($,!0);O($),W(ge=>{ne=se($,"",ne,ge),Y(fe,re().text)},[()=>({color:re().color})]),I(ue,oe)}),I(m,M)};ae(h,m=>{H!=null&&m(x)})}O(l),O(e),X(e,m=>R=m,()=>R),W(m=>{N(e,1,`floating-block ${E(C)&&r()!="background"?"visible":""}`),Y(o,E(B)),Y(n,`FPS: ${m??""} `)},[()=>`${Math.round(E(Z))} (${d?.width}x${d?.height})`]),I(A,e)},$$slots:{default:!0}})};ae(Q,i=>{s()&&i(le)})}var z=D(Q,2);let ee;X(z,i=>d=i,()=>d),W(i=>{N(k,1,`edit ${E(T)?"visible":""}`,"svelte-1humrcv"),Ee(ce,"src",Ce),N(z,1,`glsl ${r()??""}`,"svelte-1humrcv"),ee=se(z,"",ee,i)},[()=>({"max-width":r()=="preview"?"calc(var(--compact-width) * 0.25)":r()=="background"?"100vw":`${a()}px`,"max-height":r()=="preview"?"auto":r()=="background"?"100vh":`${a()}px`,"background-color":y()})]),I(u,J),_e()}Pe(["click"]);export{ot as T,Oe as a,De as b,rt as c,Ue as d,Ce as e,Ie as n};
