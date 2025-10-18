import"./DsnmJJEf.js";import{o as kt,a as Mt}from"./DZor6qtp.js";import{p as Et,j as G,aB as z,ab as Tt,k as v,i as x,f as $,e as nt,t as H,a as F,b as At,c as P,n as Ct,r as k,s as E,as as Ft,g as Dt,az as Ut,b8 as Gt}from"./UuebQw-N.js";import{d as Ot,s as Z}from"./CWSVVgTL.js";import{p as _,i as N}from"./BNnMBqfr.js";import{e as Bt,i as $t}from"./DLdQWlW5.js";import{s as st}from"./Bczg0Zq0.js";import{s as O}from"./BI6CLnWE.js";import{s as gt}from"./CK7EHw7e.js";import{b as at}from"./XPBOPOQb.js";import{P as It}from"./BlnfjrZp.js";import{g as Vt}from"./DZEoTqWv.js";import{w as zt}from"./WXnP_9PU.js";const Ht=`#version 300 es

// Author: TapiocaFox
// Title:  Default Vertex Shader

in  vec3 aPos;
out vec3 vPos;

void main() {
    gl_Position = vec4(aPos, 1.);
    vPos = aPos;
}`,Nt=`#version 300 es

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
}`,jt=`// Author: TapiocaFox
// Title:  Default Renderer

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, resizeObserver;

export const title = 'Default Renderer';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;

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
};`,Wt={index:jt},Yt="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e",Xt="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M16.6582%209.28638C18.098%2010.1862%2018.8178%2010.6361%2019.0647%2011.2122C19.2803%2011.7152%2019.2803%2012.2847%2019.0647%2012.7878C18.8178%2013.3638%2018.098%2013.8137%2016.6582%2014.7136L9.896%2018.94C8.29805%2019.9387%207.49907%2020.4381%206.83973%2020.385C6.26501%2020.3388%205.73818%2020.0469%205.3944%2019.584C5%2019.053%205%2018.1108%205%2016.2264V7.77357C5%205.88919%205%204.94701%205.3944%204.41598C5.73818%203.9531%206.26501%203.66111%206.83973%203.6149C7.49907%203.5619%208.29805%204.06126%209.896%205.05998L16.6582%209.28638Z'%20stroke='%23000000'%20stroke-width='2'%20stroke-linejoin='round'/%3e%3c/svg%3e";function pt(){const f=new Map,u=new Set;let b=[];function y(t,e){for(const a of u)a(t,S(e))}function S(t){let e;if(t instanceof Error?e=t:e=new Error(String(t)),e.stack)for(const[a,l]of f.entries())l.url&&(e.stack=e.stack.replaceAll(l.url,a));if(e.message)for(const[a,l]of f.entries())l.url&&(e.message=e.message.replaceAll(l.url,a));return e}function D(t){if(!t)return null;for(const e of b){const a=f.get(e);if(a.url&&t.includes(a.url))return a}return null}function g(t){if(!t)return null;for(const[e,a]of f.entries())if(a.url===t||t?.includes(a.url))return e;return null}function I(t){if(t==null)return null;const e=D(t);return e==null?null:g(e.url)}window&&window.addEventListener("error",t=>{const e=g(t.filename);e!=null&&y(e,t.error??t.message)}),window&&window.addEventListener("unhandledrejection",t=>{const e=t.reason;if(!(e instanceof Error)||!e.stack)return;const a=I(e.stack);a!=null&&a&&y(a,e)});function V(t){const e=[];return t.replace(/import\s+(?:.+?)\s+from\s+['"]([^'"]+)['"]/g,(a,l)=>(e.push(l),a)),e}function q(){const t=new Set,e=new Set,a=[];function l(d,R=[]){if(t.has(d))return;if(e.has(d)){const T=[...R,d].join(" -> ");throw new Error(`Circular dependency detected: ${T}`)}e.add(d);const M=f.get(d);if(!M)throw new Error(`Module "${d}" not found for topological sort`);for(const T of M.deps)f.has(T)&&l(T,[...R,d]);e.delete(d),t.add(d),a.push(d)}for(const d of f.keys())l(d);return a}function J(t){return t.replace(/import\s+(.+?)\s+from\s+['"]([^'"]+)['"]/g,(e,a,l)=>{const d=f.get(l);return d?.url?`import ${a} from '${d.url}'`:e})}return{register(t,e){if(f.has(t)){const a=f.get(t);a.url&&URL.revokeObjectURL(a.url)}f.set(t,{code:e,url:null,exports:null,deps:V(e)})},commit(){b=q();for(const t of b){const e=f.get(t),a=J(e.code);e.url&&URL.revokeObjectURL(e.url);const l=new Blob([a],{type:"application/javascript"});e.url=URL.createObjectURL(l)}},async import(t){const e=f.get(t);if(!e||!e.url)throw new Error(`Module "${t}" not committed`);try{const a=await import(e.url);return e.exports=a,a}catch(a){let l=null;throw a instanceof Error&&(l=I(a.stack||null)),l==null?y(t,a):y(l,a),a}},async replace(t,e){this.register(t,e),this.commit()},async preloadAll(){for(const t of b){if(!f.get(t).url)return new Error(`Module "${t}" not committed`);try{await this.import(t)}catch(a){return S(a)}}},clear(){for(const t of f.values())t.url&&URL.revokeObjectURL(t.url);f.clear()},addUncaughtErrorListener(t){u.add(t)},removeUncaughtErrorListener(t){u.delete(t)}}}const B="index",pe="fgl",Kt=zt(null);function Zt(f,u,b,y,S){Kt.set({name:"",timestamp:0,img:"",vert:u(),frag:b(),modules:y(),assets:S()}),Vt("/webgl_editor")}var qt=$("<br/><span> </span>",1),Jt=$('<div><h3> </h3> <p class="annotation"> <!></p></div>'),Qt=$('<img class="preview-image svelte-1humrcv" alt="Preview"/>'),te=(f,u)=>{u()},ee=$('<div><h3 class="svelte-1humrcv"><button class="text"><img/> </button></h3> <p class="annotation svelte-1humrcv"> </p></div>'),re=$('<div class="overlay code-block-background svelte-1humrcv"><!> <!></div>'),oe=$('<button><img class="inline-glyph" alt="Edit"/>Edit</button> <!> <div><canvas></canvas> <!></div>',1);function we(f,u){Et(u,!0);let b=_(u,"vertex_shader",27,()=>z(Ht)),y=_(u,"fragment_shader",27,()=>z(Nt)),S=_(u,"modules",27,()=>z(Wt)),D=_(u,"assets",27,()=>z({})),g=_(u,"mode",3,"default"),I=_(u,"size",3,250),V=_(u,"show_status_block",3,!0),q=_(u,"background_color",3,"transparent"),J=_(u,"onglinit",3,async function(i){return!0}),t=_(u,"onerror",3,async function(i,h){console.trace(h)}),e=_(u,"preview_image",11,null),a=_(u,"start_immediately",3,!0);var l,d,R;let M=G(null),T=G(!a()),j=G(!1),C=G(!1),it=G(0),Q=G("Rendering Status"),tt=z({});const wt=.5,W=32;let L;const lt=(i,h)=>{console.log("module:",i,`
error:`,h),t()("modules",{module:i,error:h})};Tt(()=>{b(),y(),S(),D(),!(!L||x(T))&&(L.newProgram(),L.setShadersModulesAndAssets(b(),y(),S(),D()),L.refreshShadersAndModules())});const ct=async()=>{v(T,!1);const i=l.getContext("webgl2",{preserveDrawingBuffer:g()=="in-editor"});L={gl:i,canvas:l,program:i.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:x(Q),statusDict:tt,vertexShader:"",fragmentShader:"",sandbox:pt(),defaultModule:null,assets:{},async start(){try{await this.defaultModule?.start?.(this)}catch(r){t()("modules",{module:B,error:r})}},async stop(){try{await this.defaultModule?.stop?.(this)}catch(r){t()("modules",{module:B,error:r})}},async optimizeViewPort(){const r=this.gl,s=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),n=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==s||this.canvas.height!==n)&&(this.canvas.width=s,this.canvas.height=n,r.viewport(0,0,s,n)),await Ft()},initProgram(r,s){const n=this.gl,c=(o,p)=>{const w=n.createShader(o);n.shaderSource(w,p),n.compileShader(w);const m=n.getShaderInfoLog(w);if(!n.getShaderParameter(w,n.COMPILE_STATUS)||m?.trim().length)throw`Cannot compile shader: ${m}`;n.attachShader(this.program,w)};try{c(n.VERTEX_SHADER,r)}catch(o){throw t()("vert",o),o}try{c(n.FRAGMENT_SHADER,s)}catch(o){throw t()("frag",o),o}if(n.linkProgram(this.program),!n.getProgramParameter(this.program,n.LINK_STATUS))throw`Cannot link program:
${n.getProgramInfoLog(this.program)}`;n.useProgram(this.program)},async importDefaultModule(){try{this.defaultModule=await this.sandbox.import(B);const r=this.defaultModule.title;r&&this.setStatusTitle(r)}catch(r){t()("modules",{module:B,error:r})}},render(){const r=this.gl,s=Date.now();v(it,1e3/(s-this.lastRenderTime)),this.lastRenderTime=s,r.drawArrays(r.TRIANGLES,0,6)},newProgram(){const r=this.gl;r.getAttachedShaders(this.program)?.forEach(n=>{r.detachShader(this.program,n),r.deleteShader(n)}),r.deleteProgram(this.program),this.program=r.createProgram()},async reset(){const r=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const s=this.statusDict;for(const n in s)delete s[n];this.sandbox.commit(),!(g()=="in-editor"&&await this.sandbox.preloadAll())&&(this.initProgram(this.vertexShader,this.fragmentShader),await this.importDefaultModule(),await this.start())},setShadersModulesAndAssets(r,s,n,c){this.vertexShader=r,this.fragmentShader=s;try{this.sandbox.clear();for(const o in n)this.sandbox.register(o,n[o]);this.assets=c}catch(o){t()("modules",{module:B,error:o})}},async refreshShadersAndModules(){await this.stop(),await this.optimizeViewPort();const r=this.statusDict;for(const s in r)delete r[s];this.sandbox.commit(),!(g()=="in-editor"&&await this.sandbox.preloadAll())&&(this.initProgram(this.vertexShader,this.fragmentShader),await this.importDefaultModule(),await this.start())},setStatusTitle(r){v(Q,r,!0)},reportStatus(r,s,n="inherit"){this.statusDict[r]={text:s,color:n}},async getAssetById(r){const s=this.assets[r];if(typeof s>"u"||s==null)throw`Asset with id "${r}" does not exist.`;if(s.type=="image")return new Promise((n,c)=>{const o=new Image;o.crossOrigin="anonymous",o.onload=()=>n(o),o.onerror=p=>c(p),o.src=s.src,o.complete&&n(o)});if(s.type==="audio")return new Promise((n,c)=>{const o=new Audio;o.crossOrigin="anonymous",o.oncanplaythrough=()=>n(o),o.onerror=p=>c(p),o.src=s.src,o.load()});throw"Not implemented"}},L.sandbox.addUncaughtErrorListener(lt),new ResizeObserver(r=>{L.optimizeViewPort()}).observe(l),l.addEventListener("pointermove",async r=>{const s=l.getBoundingClientRect();if(s.bottom-s.top,V()){v(j,!0),g()=="default"&&v(C,!0);const{clientX:n,clientY:c}=r,o=window.innerWidth,p=window.innerHeight,w=d.offsetWidth,m=d.offsetHeight;(s.left+s.right)*.5<=o*wt?(d.animate({left:`${Math.min(n+W,o-w)}px`,top:`${Math.min(c+W,p-m)}px`},{fill:"forwards"}),R.animate({left:`${s.left}px`,top:`${s.bottom+4}px`},{fill:"forwards"})):(d.animate({right:`${Math.max(o-n+W,0)}px`,top:`${Math.min(c+W,p-m)}px`},{fill:"forwards"}),R.animate({right:`${o-s.right}px`,top:`${s.bottom+4}px`},{fill:"forwards"}))}}),l.addEventListener("pointerleave",async r=>{if(v(j,!1),R==null)return;const s=l.getBoundingClientRect(),n=R.getBoundingClientRect();if(V()){const{clientX:c,clientY:o}=r;n.left<=c&&c<=n.right&&o>s.top?v(C,!0):v(C,!1)}}),document.addEventListener("scroll",async r=>{v(j,!1),v(C,!1)},!0),l.addEventListener("webglcontextlost",async r=>{r.preventDefault(),console.warn("webgl canvas WebGL context lost!")});const A=await J()(L);L.setShadersModulesAndAssets(b(),y(),S(),D()),A&&await L.refreshShadersAndModules()};(async()=>{try{const i=pt();for(const A in S())i.register(A,S()[A]);i.commit();const h=await i.import(B);h.title?(v(M,h.title,!0),h.description&&v(M,`${x(M)} (${h.description})`)):v(M,"Click to start the applet."),i.clear()}catch(i){v(M,"Click to start the applet."),console.trace(i)}})(),kt(async()=>{try{a()&&ct()}catch(i){console.trace(i)}R.onpointerenter=async i=>{g()=="default"&&v(C,!0)},R.onpointerleave=async i=>{v(C,!1)}}),Mt(()=>{L?.sandbox.removeUncaughtErrorListener(lt)});var dt=oe(),U=nt(dt);U.__click=[Zt,b,y,S,D];var xt=P(U);Ct(),k(U),at(U,i=>R=i,()=>R);var ut=E(U,2);{var _t=i=>{It(i,{target:"body",children:(h,A)=>{var r=Jt(),s=P(r),n=P(s,!0);k(s);var c=E(s,2),o=P(c),p=E(o);{var w=m=>{var X=Dt(),K=nt(X);Bt(K,17,()=>Object.entries(tt),$t,(rt,St)=>{var Rt=Ut(()=>Gt(x(St),2));let mt=()=>x(Rt)[1];var ht=qt(),ot=E(nt(ht));let vt;var Lt=P(ot,!0);k(ot),H(Pt=>{vt=gt(ot,"",vt,Pt),Z(Lt,mt().text)},[()=>({color:mt().color})]),F(rt,ht)}),F(m,X)};N(p,m=>{tt!=null&&m(w)})}k(c),k(r),at(r,m=>d=m,()=>d),H(m=>{O(r,1,`floating-block ${x(j)&&g()!="background"?"visible":""}`),Z(n,x(Q)),Z(o,`FPS: ${m??""} `)},[()=>`${Math.round(x(it))} (${l?.width}x${l?.height})`]),F(h,r)},$$slots:{default:!0}})};N(ut,i=>{V()&&i(_t)})}var et=E(ut,2),Y=P(et);let ft;at(Y,i=>l=i,()=>l);var bt=E(Y,2);{var yt=i=>{var h=re(),A=P(h);{var r=c=>{var o=Qt();H(()=>st(o,"src",e())),F(c,o)};N(A,c=>{e()!=null&&c(r)})}var s=E(A,2);{var n=c=>{var o=ee(),p=P(o),w=P(p);w.__click=[te,ct];var m=P(w),X=E(m);X.nodeValue=" Play FoxGL",k(w),k(p);var K=E(p,2),rt=P(K,!0);k(K),k(o),H(()=>{O(o,1,`info fade-in ${e()!=null?"with-image":""}`,"svelte-1humrcv"),O(m,1,`inline-glyph ${e()!=null?"inverted":""}`),st(m,"src",Xt),Z(rt,x(M))}),F(c,o)};N(s,c=>{x(M)!=null&&c(n)})}k(h),F(i,h)};N(bt,i=>{x(T)&&i(yt)})}k(et),H(i=>{O(U,1,`edit ${x(C)?"visible":""}`,"svelte-1humrcv"),st(xt,"src",Yt),O(et,1,`canvas-container ${g()??""}`,"svelte-1humrcv"),O(Y,1,`webgl fade-in ${g()??""}`,"svelte-1humrcv"),ft=gt(Y,"",ft,i)},[()=>({"max-width":g()=="preview"?"calc(var(--compact-width) * 0.25)":g()=="background"?"100vw":`${I()}px`,"max-height":g()=="preview"?"auto":g()=="background"?"100vh":`${I()}px`,"background-color":q()})]),F(f,dt),At()}Ot(["click"]);export{we as T,Nt as a,B as b,pe as c,Ht as d,Yt as e,jt as f,Wt as m,Kt as n};
