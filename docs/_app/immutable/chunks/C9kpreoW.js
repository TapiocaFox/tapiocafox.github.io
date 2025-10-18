import"./DsnmJJEf.js";import{o as Me,a as ke}from"./DZor6qtp.js";import{p as Te,j as B,aB as z,ab as Ae,f as $,e as ne,t as H,a as C,b as Fe,k as g,c as L,n as Ce,r as E,s as k,i as P,as as De,g as Ue,az as Be,b8 as Ge}from"./UuebQw-N.js";import{d as Oe,s as Z}from"./CWSVVgTL.js";import{p as _,i as N}from"./BNnMBqfr.js";import{e as $e,i as Ie}from"./DLdQWlW5.js";import{s as se}from"./Bczg0Zq0.js";import{s as G}from"./BI6CLnWE.js";import{s as ve}from"./CK7EHw7e.js";import{b as ae}from"./XPBOPOQb.js";import{P as Ve}from"./BlnfjrZp.js";import{g as ze}from"./CGrJPenO.js";import{w as He}from"./WXnP_9PU.js";const Ne=`#version 300 es

// Author: TapiocaFox
// Title:  Default Vertex Shader

in  vec3 aPos;
out vec3 vPos;

void main() {
    gl_Position = vec4(aPos, 1.);
    vPos = aPos;
}`,je=`#version 300 es

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
}`,We=`// Author: TapiocaFox
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
};`,Ye={index:We},Xe="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e",Ke="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M16.6582%209.28638C18.098%2010.1862%2018.8178%2010.6361%2019.0647%2011.2122C19.2803%2011.7152%2019.2803%2012.2847%2019.0647%2012.7878C18.8178%2013.3638%2018.098%2013.8137%2016.6582%2014.7136L9.896%2018.94C8.29805%2019.9387%207.49907%2020.4381%206.83973%2020.385C6.26501%2020.3388%205.73818%2020.0469%205.3944%2019.584C5%2019.053%205%2018.1108%205%2016.2264V7.77357C5%205.88919%205%204.94701%205.3944%204.41598C5.73818%203.9531%206.26501%203.66111%206.83973%203.6149C7.49907%203.5619%208.29805%204.06126%209.896%205.05998L16.6582%209.28638Z'%20stroke='%23000000'%20stroke-width='2'%20stroke-linejoin='round'/%3e%3c/svg%3e";function pe(){const f=new Map,u=new Set;let b=[];function y(e,t){for(const i of u)i(e,R(t))}function R(e){let t;if(e instanceof Error?t=e:t=new Error(String(e)),t.stack)for(const[i,l]of f.entries())l.url&&(t.stack=t.stack.replaceAll(l.url,i));if(t.message)for(const[i,l]of f.entries())l.url&&(t.message=t.message.replaceAll(l.url,i));return t}function D(e){if(!e)return null;for(const t of b){const i=f.get(t);if(i.url&&e.includes(i.url))return i}return null}function v(e){if(!e)return null;for(const[t,i]of f.entries())if(i.url===e||e?.includes(i.url))return t;return null}function I(e){if(e==null)return null;const t=D(e);return t==null?null:v(t.url)}window&&window.addEventListener("error",e=>{const t=v(e.filename);t!=null&&y(t,e.error??e.message)}),window&&window.addEventListener("unhandledrejection",e=>{const t=e.reason;if(!(t instanceof Error)||!t.stack)return;const i=I(t.stack);i!=null&&i&&y(i,t)});function V(e){const t=[];return e.replace(/import\s+(?:.+?)\s+from\s+['"]([^'"]+)['"]/g,(i,l)=>(t.push(l),i)),t}function q(){const e=new Set,t=new Set,i=[];function l(d,S=[]){if(e.has(d))return;if(t.has(d)){const T=[...S,d].join(" -> ");throw new Error(`Circular dependency detected: ${T}`)}t.add(d);const M=f.get(d);if(!M)throw new Error(`Module "${d}" not found for topological sort`);for(const T of M.deps)f.has(T)&&l(T,[...S,d]);t.delete(d),e.add(d),i.push(d)}for(const d of f.keys())l(d);return i}function J(e){return e.replace(/import\s+(.+?)\s+from\s+['"]([^'"]+)['"]/g,(t,i,l)=>{const d=f.get(l);return d?.url?`import ${i} from '${d.url}'`:t})}return{register(e,t){if(f.has(e)){const i=f.get(e);i.url&&URL.revokeObjectURL(i.url)}f.set(e,{code:t,url:null,exports:null,deps:V(t)})},commit(){b=q();for(const e of b){const t=f.get(e),i=J(t.code);t.url&&URL.revokeObjectURL(t.url);const l=new Blob([i],{type:"application/javascript"});t.url=URL.createObjectURL(l)}},async import(e){const t=f.get(e);if(!t||!t.url)throw new Error(`Module "${e}" not committed`);try{const i=await import(t.url);return t.exports=i,i}catch(i){let l=null;throw i instanceof Error&&(l=I(i.stack||null)),l==null?y(e,i):y(l,i),i}},async replace(e,t){this.register(e,t),this.commit()},async preloadAll(){for(const e of b){if(!f.get(e).url)return new Error(`Module "${e}" not committed`);try{await this.import(e)}catch(i){return R(i)}}},clear(){for(const e of f.values())e.url&&URL.revokeObjectURL(e.url);f.clear()},addUncaughtErrorListener(e){u.add(e)},removeUncaughtErrorListener(e){u.delete(e)}}}const O="index",wt="fgl",Ze=He(null);function qe(f,u,b,y,R){Ze.set({name:"",timestamp:0,img:"",vert:u(),frag:b(),modules:y(),assets:R()}),ze("/webgl_editor")}var Je=$("<br/><span> </span>",1),Qe=$('<div><h3> </h3> <p class="annotation"> <!></p></div>'),et=$('<img class="preview-image svelte-1humrcv" alt="Preview"/>'),tt=(f,u)=>{u()},rt=$('<div><h3 class="svelte-1humrcv"><button class="text"><img/> </button></h3> <p class="annotation svelte-1humrcv"> </p></div>'),ot=$('<div class="overlay code-block-background svelte-1humrcv"><!> <!></div>'),nt=$('<button><img class="inline-glyph" alt="Edit"/>Edit</button> <!> <div><canvas></canvas> <!></div>',1);function xt(f,u){Te(u,!0);let b=_(u,"vertex_shader",27,()=>z(Ne)),y=_(u,"fragment_shader",27,()=>z(je)),R=_(u,"modules",27,()=>z(Ye)),D=_(u,"assets",27,()=>z({})),v=_(u,"mode",3,"default"),I=_(u,"size",3,250),V=_(u,"show_status_block",3,!0),q=_(u,"background_color",3,"transparent"),J=_(u,"onglinit",3,async function(s){return!0}),e=_(u,"onerror",3,async function(s,m){console.trace(m)}),t=_(u,"preview_image",11,null),i=_(u,"start_immediately",3,!0);var l,d,S;let M=B(null),T=B(!i()),j=B(!1),F=B(!1),ie=B(0),Q=B("Rendering Status"),ee=z({});const we=.5,W=32;let w;const le=(s,m)=>{console.log("module:",s,`
error:`,m),e()("modules",{module:s,error:m})};Ae(()=>{b(),y(),R(),D(),!(!w||P(T))&&(w.newProgram(),w.setShadersModulesAndAssets(b(),y(),R(),D()),w.refreshShadersAndModules())});const ce=async()=>{g(T,!1);const s=l.getContext("webgl2",{preserveDrawingBuffer:v()=="in-editor"});w={gl:s,canvas:l,program:s.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:P(Q),statusDict:ee,vertexShader:"",fragmentShader:"",sandbox:pe(),defaultModule:null,assets:{},async start(){try{await this.defaultModule?.start?.(this)}catch(r){e()("modules",{module:O,error:r})}},async stop(){try{await this.defaultModule?.stop?.(this)}catch(r){e()("modules",{module:O,error:r})}},async optimizeViewPort(){const r=this.gl,a=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),n=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==a||this.canvas.height!==n)&&(this.canvas.width=a,this.canvas.height=n,r.viewport(0,0,a,n)),await De()},initProgram(r,a){const n=this.gl,c=(o,p)=>{const x=n.createShader(o);n.shaderSource(x,p),n.compileShader(x);const h=n.getShaderInfoLog(x);if(!n.getShaderParameter(x,n.COMPILE_STATUS)||h?.trim().length)throw`Cannot compile shader: ${h}`;n.attachShader(this.program,x)};try{c(n.VERTEX_SHADER,r)}catch(o){throw e()("vert",o),o}try{c(n.FRAGMENT_SHADER,a)}catch(o){throw e()("frag",o),o}if(n.linkProgram(this.program),!n.getProgramParameter(this.program,n.LINK_STATUS))throw`Cannot link program:
${n.getProgramInfoLog(this.program)}`;n.useProgram(this.program)},async importDefaultModule(){try{this.defaultModule=await this.sandbox.import(O);const r=this.defaultModule.title;r&&this.setStatusTitle(r)}catch(r){e()("modules",{module:O,error:r})}},render(){const r=this.gl,a=Date.now();g(ie,1e3/(a-this.lastRenderTime)),this.lastRenderTime=a,r.drawArrays(r.TRIANGLES,0,6)},newProgram(){const r=this.gl;r.getAttachedShaders(this.program)?.forEach(n=>{r.detachShader(this.program,n),r.deleteShader(n)}),r.deleteProgram(this.program),this.program=r.createProgram()},async reset(){const r=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const a=this.statusDict;for(const n in a)delete a[n];this.sandbox.commit(),!(v()=="in-editor"&&await this.sandbox.preloadAll())&&(this.initProgram(this.vertexShader,this.fragmentShader),await this.importDefaultModule(),await this.start())},setShadersModulesAndAssets(r,a,n,c){this.vertexShader=r,this.fragmentShader=a;try{this.sandbox.clear();for(const o in n)this.sandbox.register(o,n[o]);this.assets=c}catch(o){e()("modules",{module:O,error:o})}},async refreshShadersAndModules(){await this.stop(),await this.optimizeViewPort();const r=this.statusDict;for(const a in r)delete r[a];this.sandbox.commit(),!(v()=="in-editor"&&await this.sandbox.preloadAll())&&(this.initProgram(this.vertexShader,this.fragmentShader),await this.importDefaultModule(),await this.start())},setStatusTitle(r){g(Q,r,!0)},reportStatus(r,a,n="inherit"){this.statusDict[r]={text:a,color:n}},async getAssetById(r){const a=this.assets[r];if(typeof a>"u"||a==null)throw`Asset with id "${r}" does not exist.`;if(a.type=="image")return new Promise((n,c)=>{const o=new Image;o.crossOrigin="anonymous",o.onload=()=>n(o),o.onerror=p=>c(p),o.src=a.src,o.complete&&n(o)});if(a.type==="audio")return new Promise((n,c)=>{const o=new Audio;o.crossOrigin="anonymous",o.oncanplaythrough=()=>n(o),o.onerror=p=>c(p),o.src=a.src,o.load()});throw"Not implemented"}},w.sandbox.addUncaughtErrorListener(le),new ResizeObserver(r=>{w.optimizeViewPort()}).observe(l),l.addEventListener("pointermove",async r=>{const a=l.getBoundingClientRect();if(a.bottom-a.top,V()){g(j,!0),v()=="default"&&g(F,!0);const{clientX:n,clientY:c}=r,o=window.innerWidth,p=window.innerHeight,x=d.offsetWidth,h=d.offsetHeight;(a.left+a.right)*.5<=o*we?(d.animate({left:`${Math.min(n+W,o-x)}px`,top:`${Math.min(c+W,p-h)}px`},{fill:"forwards"}),S.animate({left:`${a.left}px`,top:`${a.bottom+4}px`},{fill:"forwards"})):(d.animate({right:`${Math.max(o-n+W,0)}px`,top:`${Math.min(c+W,p-h)}px`},{fill:"forwards"}),S.animate({right:`${o-a.right}px`,top:`${a.bottom+4}px`},{fill:"forwards"}))}}),l.addEventListener("pointerleave",async r=>{if(g(j,!1),S==null)return;const a=l.getBoundingClientRect(),n=S.getBoundingClientRect();if(V()){const{clientX:c,clientY:o}=r;n.left<=c&&c<=n.right&&o>a.top?g(F,!0):g(F,!1)}}),document.addEventListener("scroll",async r=>{g(j,!1),g(F,!1)},!0),l.addEventListener("webglcontextlost",async r=>{r.preventDefault(),console.warn("webgl canvas WebGL context lost!")});const A=await J()(w);w.setShadersModulesAndAssets(b(),y(),R(),D()),A&&await w.refreshShadersAndModules()},xe=async()=>{try{const s=pe();for(const A in R())s.register(A,R()[A]);s.commit();const m=await s.import(O);m.title?m.description?g(M,`${m.title} (${m.description})`):g(M,m.title,!0):g(M,"Click to start the applet."),s.clear()}catch(s){g(M,"Click to start the applet."),console.trace(s)}};Me(async()=>{try{i()?ce():await xe()}catch(s){console.trace(s)}S.onpointerenter=async s=>{v()=="default"&&g(F,!0)},S.onpointerleave=async s=>{g(F,!1)}}),ke(()=>{if(console.log("onDestroy"),w){w.sandbox.removeUncaughtErrorListener(le);const s=w.gl;s.useProgram(null),s.bindBuffer(s.ARRAY_BUFFER,null),s.bindTexture(s.TEXTURE_2D,null),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindRenderbuffer(s.RENDERBUFFER,null);const m=s.getExtension("WEBGL_lose_context");m&&m.loseContext()}});var de=nt(),U=ne(de);U.__click=[qe,b,y,R,D];var _e=L(U);Ce(),E(U),ae(U,s=>S=s,()=>S);var ue=k(U,2);{var be=s=>{Ve(s,{target:"body",children:(m,A)=>{var r=Qe(),a=L(r),n=L(a,!0);E(a);var c=k(a,2),o=L(c),p=k(o);{var x=h=>{var X=Ue(),K=ne(X);$e(K,17,()=>Object.entries(ee),Ie,(re,Se)=>{var Le=Be(()=>Ge(P(Se),2));let me=()=>P(Le)[1];var he=Je(),oe=k(ne(he));let ge;var Ee=L(oe,!0);E(oe),H(Pe=>{ge=ve(oe,"",ge,Pe),Z(Ee,me().text)},[()=>({color:me().color})]),C(re,he)}),C(h,X)};N(p,h=>{ee!=null&&h(x)})}E(c),E(r),ae(r,h=>d=h,()=>d),H(h=>{G(r,1,`floating-block ${P(j)&&v()!="background"?"visible":""}`),Z(n,P(Q)),Z(o,`FPS: ${h??""} `)},[()=>`${Math.round(P(ie))} (${l?.width}x${l?.height})`]),C(m,r)},$$slots:{default:!0}})};N(ue,s=>{V()&&s(be)})}var te=k(ue,2),Y=L(te);let fe;ae(Y,s=>l=s,()=>l);var ye=k(Y,2);{var Re=s=>{var m=ot(),A=L(m);{var r=c=>{var o=et();H(()=>se(o,"src",t())),C(c,o)};N(A,c=>{t()!=null&&c(r)})}var a=k(A,2);{var n=c=>{var o=rt(),p=L(o),x=L(p);x.__click=[tt,ce];var h=L(x),X=k(h);X.nodeValue=" Play FoxGL",E(x),E(p);var K=k(p,2),re=L(K,!0);E(K),E(o),H(()=>{G(o,1,`info fade-in ${t()!=null?"with-image":""}`,"svelte-1humrcv"),G(h,1,`inline-glyph ${t()!=null?"inverted":""}`),se(h,"src",Ke),Z(re,P(M))}),C(c,o)};N(a,c=>{P(M)!=null&&c(n)})}E(m),C(s,m)};N(ye,s=>{P(T)&&s(Re)})}E(te),H(s=>{G(U,1,`edit ${P(F)?"visible":""}`,"svelte-1humrcv"),se(_e,"src",Xe),G(te,1,`canvas-container ${v()??""}`,"svelte-1humrcv"),G(Y,1,`webgl ${v()??""}`,"svelte-1humrcv"),fe=ve(Y,"",fe,s)},[()=>({"max-width":v()=="preview"?"calc(var(--compact-width) * 0.25)":v()=="background"?"100vw":`${I()}px`,"max-height":v()=="preview"?"auto":v()=="background"?"100vh":`${I()}px`,"background-color":q()})]),C(f,de),Fe()}Oe(["click"]);export{xt as T,je as a,O as b,wt as c,Ne as d,Xe as e,We as f,Ye as m,Ze as n};
