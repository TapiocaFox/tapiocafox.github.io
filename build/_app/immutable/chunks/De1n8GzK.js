import"./DsnmJJEf.js";import{o as De,a as Ue}from"./DqsCpnON.js";import{p as Oe,w as N,aG as H,a7 as Ge,f as V,e as ee,t as z,a as U,b as Ie,x as v,c as T,n as $e,r as F,s as D,v as E,al as Ne,g as Ve,az as He,aA as ze}from"./8wfNHnlc.js";import{d as je,s as te,e as We}from"./D-MeLBsU.js";import{i as Z}from"./BMSRtp_v.js";import{e as Je,i as Ye}from"./Bj7HpYt_.js";import{s as le}from"./d9TLXI1c.js";import{s as j}from"./XaaZzS1H.js";import{s as be}from"./CS34ykG-.js";import{b as ce}from"./ChHNlFE6.js";import{p as k}from"./DkCquwUv.js";import{P as Xe}from"./C7Vd2T-n.js";import"./xXA0C5zs.js";import{w as Ze}from"./CMIZL9ju.js";const Ke=`#version 300 es

// Author: TapiocaFox
// Title:  Default Vertex Shader

in  vec3 aPos;
out vec3 vPos;

void main() {
    gl_Position = vec4(aPos, 1.);
    vPos = aPos;
}`,Qe=`#version 300 es

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
}`,qe=`// Author: TapiocaFox
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
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        foxGL.reportFrame();
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
};`,et={index:qe},tt="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M16%204C16%205.86658%2014.7215%207.43455%2012.9924%207.87594C12.9974%207.91659%2013%207.95799%2013%208V9.7973C13.0054%209.79921%2013.0108%209.80113%2013.0162%209.80307L20.1604%2012.375C21.4569%2012.8418%2022.0701%2014.0289%2022%2015.177V18.5585C22%2019.8498%2021.1737%2020.9962%2019.9487%2021.4045L12.9487%2023.7379C12.3329%2023.9431%2011.6671%2023.9431%2011.0513%2023.7379L4.05132%2021.4045C2.82629%2020.9962%202%2019.8498%202%2018.5585V15.1769C1.92995%2014.0287%202.54315%2012.8417%203.83959%2012.375L10.9838%209.80307C10.9892%209.80113%2010.9946%209.79921%2011%209.79731V8C11%207.95799%2011.0026%207.91659%2011.0076%207.87594C9.27853%207.43455%208%205.86658%208%204C8%201.79086%209.79086%200%2012%200C14.2091%200%2016%201.79086%2016%204ZM11%2011.9229L4.51703%2014.2568C4.16878%2014.3821%203.99464%2014.6911%203.99461%2015H4C4%2015.3341%204.19728%2015.6283%204.51702%2015.7434L11.6613%2018.3153C11.8802%2018.3941%2012.1198%2018.3941%2012.3387%2018.3153L19.483%2015.7434C19.8027%2015.6283%2020%2015.3341%2020%2015H20.0054C20.0054%2014.6911%2019.8312%2014.3821%2019.483%2014.2568L13%2011.9229V15C13%2015.5523%2012.5523%2016%2012%2016C11.4477%2016%2011%2015.5523%2011%2015V11.9229ZM9.98005%204C9.98005%205.11559%2010.8844%206.01995%2012%206.01995C13.1156%206.01995%2014.0199%205.11559%2014.0199%204C14.0199%202.88441%2013.1156%201.98005%2012%201.98005C10.8844%201.98005%209.98005%202.88441%209.98005%204ZM4%2018.5585V17.6829L10.9838%2020.1971C11.6407%2020.4335%2012.3594%2020.4335%2013.0162%2020.1971L20%2017.6829V18.5585C20%2018.9889%2019.7246%2019.3711%2019.3162%2019.5072L12.3162%2021.8405C12.111%2021.9089%2011.889%2021.9089%2011.6838%2021.8405L4.68377%2019.5072C4.27543%2019.3711%204%2018.9889%204%2018.5585Z'%20fill='%230F0F0F'/%3e%3c/svg%3e",rt="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M16.6582%209.28638C18.098%2010.1862%2018.8178%2010.6361%2019.0647%2011.2122C19.2803%2011.7152%2019.2803%2012.2847%2019.0647%2012.7878C18.8178%2013.3638%2018.098%2013.8137%2016.6582%2014.7136L9.896%2018.94C8.29805%2019.9387%207.49907%2020.4381%206.83973%2020.385C6.26501%2020.3388%205.73818%2020.0469%205.3944%2019.584C5%2019.053%205%2018.1108%205%2016.2264V7.77357C5%205.88919%205%204.94701%205.3944%204.41598C5.73818%203.9531%206.26501%203.66111%206.83973%203.6149C7.49907%203.5619%208.29805%204.06126%209.896%205.05998L16.6582%209.28638Z'%20stroke='%23000000'%20stroke-width='2'%20stroke-linejoin='round'/%3e%3c/svg%3e",nt=""+new URL("../assets/eye_with_uuid.DdJW-jKS.png",import.meta.url).href;function Re(){const l=new Map,c=new Set;let u=[];function _(r,t){for(const s of c)s(r,p(t))}function p(r){let t;if(r instanceof Error?t=r:t=new Error(String(r)),t.stack)for(const[s,h]of l.entries())h.url&&(t.stack=t.stack.replaceAll(h.url,s));if(t.message)for(const[s,h]of l.entries())h.url&&(t.message=t.message.replaceAll(h.url,s));return t}function x(r){if(!r)return null;for(const t of u){const s=l.get(t);if(s&&s.url&&r.includes(s.url))return s}return null}function y(r){if(!r)return null;for(const[t,s]of l.entries())if(s.url===r||r?.includes(s.url))return t;return null}function b(r){if(r==null)return null;const t=x(r);return t==null?null:y(t.url)}window&&window.addEventListener("error",r=>{const t=y(r.filename);t!=null&&_(t,r.error??r.message)}),window&&window.addEventListener("unhandledrejection",r=>{const t=r.reason;if(!(t instanceof Error)||!t.stack)return;const s=b(t.stack);s!=null&&s&&_(s,t)});function f(r){const t=[];return r.replace(/import\s+(?:.+?)\s+from\s+['"]([^'"]+)['"]/g,(s,h)=>(t.push(h),s)),t}function O(){const r=new Set,t=new Set,s=[];function h(d,R=[]){if(r.has(d))return;if(t.has(d)){const A=[...R,d].join(" -> ");throw new Error(`Circular dependency detected: ${A}`)}t.add(d);const w=l.get(d);if(!w)throw new Error(`Module "${d}" not found for topological sort`);for(const A of w.deps)l.has(A)&&h(A,[...R,d]);t.delete(d),r.add(d),s.push(d)}for(const d of l.keys())h(d);return s}function G(r){return r.replace(/import\s+(.+?)\s+from\s+['"]([^'"]+)['"]/g,(t,s,h)=>{const d=l.get(h);return d?.url?`import ${s} from '${d.url}'`:t})}return{register(r,t){if(l.has(r)){const s=l.get(r);s.url&&URL.revokeObjectURL(s.url)}l.set(r,{code:t,url:null,exports:null,deps:f(t)})},commit(){u=O();for(const r of u){const t=l.get(r),s=G(t.code);t.url&&URL.revokeObjectURL(t.url);const h=new Blob([s],{type:"application/javascript"});t.url=URL.createObjectURL(h)}},async import(r){const t=l.get(r);if(!t||!t.url)throw new Error(`Module "${r}" not committed`);try{const s=await import(t.url);return t.exports=s,s}catch(s){let h=null;throw s instanceof Error&&(h=b(s.stack||null)),h==null?_(r,s):_(h,s),s}},async replace(r,t){this.register(r,t),this.commit()},async preloadAll(){for(const r of u){if(!l.get(r).url)return new Error(`Module "${r}" not committed`);try{await this.import(r)}catch(s){return p(s)}}},clear(){for(const r of l.values())r.url&&URL.revokeObjectURL(r.url);l.clear()},addUncaughtErrorListener(r){c.add(r)},removeUncaughtErrorListener(r){c.delete(r)}}}const W="index";function re(l){return new Promise((c,u)=>{l.oncomplete=l.onsuccess=()=>c(l.result),l.onabort=l.onerror=()=>u(l.error)})}function ot(l,c){let u;const _=()=>{if(u)return u;const p=indexedDB.open(l);return p.onupgradeneeded=()=>p.result.createObjectStore(c),u=re(p),u.then(x=>{x.onclose=()=>u=void 0},()=>{}),u};return(p,x)=>_().then(y=>x(y.transaction(c,p).objectStore(c)))}let de;function ue(){return de||(de=ot("keyval-store","keyval")),de}function st(l,c=ue()){return c("readonly",u=>re(u.get(l)))}function at(l,c,u=ue()){return u("readwrite",_=>(_.put(c,l),re(_.transaction)))}function it(l,c=ue()){return c("readwrite",u=>(u.delete(l),re(u.transaction)))}const lt=(l,c)=>{const u=Ze(c),_=crypto.randomUUID(),p=new BroadcastChannel(`storage-${l}`);let x;const y=new Promise(f=>x=f);let b=structuredClone(c);return st(l).then(f=>{f!==void 0&&(b=structuredClone(f),u.set(f)),x()}),u.subscribe(f=>{JSON.stringify(f)!==JSON.stringify(b)&&(b=structuredClone(f),f==null?it(l):at(l,f),p.postMessage({senderId:_,value:f}))}),p.onmessage=f=>{const{senderId:O,value:G}=f.data;O!==_&&JSON.stringify(G)!==JSON.stringify(b)&&(b=structuredClone(G),u.set(G))},{store:u,ready:y}};var ct=V("<br/><span> </span>",1),dt=V('<div><h3> </h3> <p class="annotation"> <!></p></div>'),ut=V('<button><img class="inline-glyph" alt="Edit"/>&nbsp;In Playground</button> <!>',1),ft=V('<img class="preview-image svelte-1humrcv" alt="Preview"/>'),mt=V('<div><h3 class="svelte-1humrcv"><button class="text"><img/> </button></h3> <p class="annotation svelte-1humrcv"> </p></div>'),ht=V('<div class="overlay code-block-background svelte-1humrcv"><!> <!></div>'),gt=V("<!> <div><canvas></canvas> <!></div>",1);function Mt(l,c){Oe(c,!0);const{store:u,ready:_}=lt("webgl_editor_snapshot_in_new_tab",null);let p=k(c,"vertex_shader",27,()=>H(Ke)),x=k(c,"fragment_shader",27,()=>H(Qe)),y=k(c,"modules",27,()=>H(et)),b=k(c,"assets",27,()=>H({})),f=k(c,"mode",3,"default"),O=k(c,"show_status_block",3,!0),G=k(c,"background_color",3,"transparent"),r=k(c,"onglinit",3,async function(a){return!0}),t=k(c,"onerror",3,async function(a,g){console.trace(g)}),s=k(c,"preview_image",27,()=>H(nt)),h=k(c,"start_immediately",3,!0);var d,R,w;let A=N(null),J=N(!h()),K=N(!1),I=N(!1),fe=N(0),ne=N("Rendering Status"),oe=H({});const me=.5,Q=32;let S;const he=(a,g)=>{console.log("module:",a,`
error:`,g),t()("modules",{module:a,error:g})};Ge(()=>{p(),x(),y(),b(),!(!S||E(J))&&(S.newProgram(),S.setShadersModulesAndAssets(p(),x(),y(),b()),S.refreshShadersAndModules())});const se=async()=>{v(J,!1);const a=d.getContext("webgl2",{preserveDrawingBuffer:f()=="in-editor"});S={gl:a,canvas:d,program:a.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,statusTitle:E(ne),statusDict:oe,vertexShader:"",fragmentShader:"",sandbox:Re(),defaultModule:null,assets:{},async start(){try{await this.defaultModule?.start?.(this)}catch(e){t()("modules",{module:W,error:e})}},async stop(){try{await this.defaultModule?.stop?.(this)}catch(e){t()("modules",{module:W,error:e})}},async optimizeViewPort(){const e=this.gl,o=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),n=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==o||this.canvas.height!==n)&&(this.canvas.width=o,this.canvas.height=n,e.viewport(0,0,o,n)),await Ne()},initProgram(e,o){const n=this.gl,m=(i,L)=>{const C=n.createShader(i);n.shaderSource(C,L),n.compileShader(C);const B=n.getShaderInfoLog(C);if(!n.getShaderParameter(C,n.COMPILE_STATUS)||B?.trim().length)throw`Cannot compile shader: ${B}`;n.attachShader(this.program,C)};try{m(n.VERTEX_SHADER,e)}catch(i){throw t()("vert",i),i}try{m(n.FRAGMENT_SHADER,o)}catch(i){throw t()("frag",i),i}if(n.linkProgram(this.program),!n.getProgramParameter(this.program,n.LINK_STATUS))throw`Cannot link program:
${n.getProgramInfoLog(this.program)}`;n.useProgram(this.program)},async importDefaultModule(){try{this.defaultModule=await this.sandbox.import(W);const e=this.defaultModule.title;e&&this.setStatusTitle(e)}catch(e){t()("modules",{module:W,error:e})}},reportFrame(){const e=Date.now();v(fe,1e3/(e-this.lastRenderTime)),this.lastRenderTime=e},newProgram(){const e=this.gl;e.getAttachedShaders(this.program)?.forEach(n=>{e.detachShader(this.program,n),e.deleteShader(n)}),e.deleteProgram(this.program),this.program=e.createProgram()},async reset(){const e=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const o=this.statusDict;for(const n in o)delete o[n];this.sandbox.commit(),!(f()=="in-editor"&&await this.sandbox.preloadAll())&&(this.initProgram(this.vertexShader,this.fragmentShader),await this.importDefaultModule(),await this.start())},setShadersModulesAndAssets(e,o,n,m){this.vertexShader=e,this.fragmentShader=o;try{this.sandbox.clear();for(const i in n)this.sandbox.register(i,n[i]);this.assets=m}catch(i){t()("modules",{module:W,error:i})}},async refreshShadersAndModules(){await this.stop(),await this.optimizeViewPort();const e=this.statusDict;for(const o in e)delete e[o];this.sandbox.commit(),!(f()=="in-editor"&&await this.sandbox.preloadAll())&&(this.initProgram(this.vertexShader,this.fragmentShader),await this.importDefaultModule(),await this.start())},setStatusTitle(e){v(ne,e,!0)},reportStatus(e,o,n="inherit"){this.statusDict[e]={text:o,color:n}},async getAssetById(e){const o=this.assets[e];if(typeof o>"u"||o==null)throw`Asset with id "${e}" does not exist.`;if(o.type=="image")return new Promise((n,m)=>{const i=new Image;i.crossOrigin="anonymous",i.onload=()=>n(i),i.onerror=L=>m(L),i.src=o.src,i.complete&&n(i)});if(o.type==="audio")return new Promise((n,m)=>{const i=new Audio;i.crossOrigin="anonymous",i.oncanplaythrough=()=>n(i),i.onerror=L=>m(L),i.src=o.src,i.load()});throw"Not implemented"},async getAssetArrayBufferById(e){const o=this.assets[e];return await(await fetch(o.src)).arrayBuffer()}},S.sandbox.addUncaughtErrorListener(he);const g=()=>{const e=d.getBoundingClientRect(),o=window.innerWidth;(e.left+e.right)*.5<=o*me?(w.style.right="unset",w.style.left=`${e.left}px`,w.style.top=`${e.bottom+4}px`):(w.style.right=`${o-e.right}px`,w.style.left="unset",w.style.top=`${e.bottom+4}px`)};let P=!1;const M=()=>{P&&requestAnimationFrame(M),g()},Y=new ResizeObserver(e=>{S.optimizeViewPort()});d.addEventListener("animationstart",()=>{P=!0,M()}),d.addEventListener("animationend",()=>{P=!1}),Y.observe(d),d.addEventListener("pointermove",async e=>{const o=d.getBoundingClientRect();if(o.bottom-o.top,O()){v(K,!0),f()=="default"&&v(I,!0);const{clientX:n,clientY:m}=e,i=window.innerWidth,L=window.innerHeight,C=R.offsetWidth,B=R.offsetHeight;(o.left+o.right)*.5<=i*me?(R.style.right="unset",R.style.left=`${Math.min(n+Q,i-C)}px`,R.style.top=`${Math.min(m+Q,L-B)}px`):(R.style.right=`${Math.max(i-n+Q,0)}px`,R.style.left="unset",R.style.top=`${Math.min(m+Q,L-B)}px`),g()}}),d.addEventListener("pointerleave",async e=>{if(v(K,!1),w==null)return;const o=d.getBoundingClientRect(),n=w.getBoundingClientRect();if(O()){const{clientX:m,clientY:i}=e;n.left<=m&&m<=n.right&&i>o.top?v(I,!0):v(I,!1)}}),document.addEventListener("scroll",async e=>{v(K,!1),v(I,!1)},!0),d.addEventListener("webglcontextlost",async e=>{e.preventDefault(),console.warn("webgl canvas WebGL context lost!")});const X=await r()(S);S.setShadersModulesAndAssets(p(),x(),y(),b()),X&&await S.refreshShadersAndModules()},Se=async()=>{try{const a=Re();for(const P in y())a.register(P,y()[P]);a.commit();const g=await a.import(W);g.title?g.description?v(A,`${g.title} (${g.description})`):v(A,g.title,!0):v(A,"Click to start the applet."),a.clear()}catch(a){v(A,"Click to start the applet."),console.trace(a)}};let Le=N(!1);De(async()=>{try{h()?await se():await Se(),v(Le,!0)}catch(a){console.trace(a)}w.onpointerenter=async a=>{f()=="default"&&v(I,!0)},w.onpointerleave=async a=>{v(I,!1)}}),Ue(()=>{if(S){S.sandbox.removeUncaughtErrorListener(he);const a=S.gl;a.useProgram(null),a.bindBuffer(a.ARRAY_BUFFER,null),a.bindTexture(a.TEXTURE_2D,null),a.bindFramebuffer(a.FRAMEBUFFER,null),a.bindRenderbuffer(a.RENDERBUFFER,null);const g=a.getExtension("WEBGL_lose_context");g&&!a.isContextLost()&&g.loseContext()}});async function Ce(){await _,u.set({name:"",timestamp:0,img:"",vert:p(),frag:x(),modules:JSON.parse(JSON.stringify(y())),assets:JSON.parse(JSON.stringify(b()))}),window.open("/webgl_editor","_blank","noopener,noreferrer")}var ge=gt(),ve=ee(ge);Xe(ve,{target:"body",children:(a,g)=>{var P=ut(),M=ee(P);M.__click=Ce;var Y=T(M);$e(),F(M),ce(M,o=>w=o,()=>w);var X=D(M,2);{var e=o=>{var n=dt(),m=T(n),i=T(m,!0);F(m);var L=D(m,2),C=T(L),B=D(C);{var Ae=$=>{var we=Ve(),Me=ee(we);Je(Me,17,()=>Object.entries(oe),Ye,(Te,Fe)=>{var ke=He(()=>ze(E(Fe),2));let _e=()=>E(ke)[1];var xe=ct(),ie=D(ee(xe));let ye;var Be=T(ie,!0);F(ie),z(()=>{ye=be(ie,"",ye,{color:_e().color}),te(Be,_e().text)}),U(Te,xe)}),U($,we)};Z(B,$=>{oe!=null&&$(Ae)})}F(L),F(n),ce(n,$=>R=$,()=>R),z($=>{j(n,1,`floating-block ${E(K)&&f()!="background"?"visible":""}`),te(i,E(ne)),te(C,`FPS: ${$??""} `)},[()=>`${Math.round(E(fe))} (${d?.width}x${d?.height})`]),U(o,n)};Z(X,o=>{O()&&o(e)})}z(()=>{j(M,1,`edit ${E(I)?"visible dropdown":""}`,"svelte-1humrcv"),le(Y,"src",tt)}),U(a,P)},$$slots:{default:!0}});var ae=D(ve,2),q=T(ae);let pe;ce(q,a=>d=a,()=>d);var Ee=D(q,2);{var Pe=a=>{var g=ht(),P=T(g);{var M=e=>{var o=ft();z(()=>le(o,"src",s())),U(e,o)};Z(P,e=>{s()!=null&&e(M)})}var Y=D(P,2);{var X=e=>{var o=mt(),n=T(o),m=T(n);m.__click=se;var i=T(m),L=D(i);L.nodeValue=" [ FoxGL ]",F(m),F(n);var C=D(n,2),B=T(C,!0);F(C),F(o),z(()=>{j(o,1,`info fade-in load ${s()!=null?"with-image":""}`,"svelte-1humrcv"),j(i,1,`inline-glyph ${s()!=null?"inverted":""}`),le(i,"src",rt),te(B,E(A))}),We("pointerenter",m,se),U(e,o)};Z(Y,e=>{E(A)!=null&&e(X)})}F(g),U(a,g)};Z(Ee,a=>{E(J)&&a(Pe)})}F(ae),z(a=>{j(ae,1,`canvas-container ${f()??""}`,"svelte-1humrcv"),j(q,1,`webgl ${f()??""} ${a??""}`,"svelte-1humrcv"),pe=be(q,"",pe,{"background-color":G()})},[()=>E(J)||f().includes("background")||E(J)?"":"zoom-in load"]),U(l,ge),Ie()}je(["click"]);export{Mt as T,W as a,Qe as b,qe as c,Ke as d,et as m,tt as p,lt as s};
