import"./DsnmJJEf.js";import{o as onMount}from"./sZ3Jm9HM.js";import{p as push,aJ as proxy,ac as user_effect,f as from_html,e as first_child,s as sibling,t as template_effect,a as append,b as pop,i as get,k as set,j as state,at as tick,c as child,n as next,r as reset,g as comment,aA as user_derived,a_ as to_array}from"./ug66gb1C.js";import{d as delegate,s as set_text}from"./gUgp7ExF.js";import{r as rest_props,i as if_block}from"./CkVXaSfc.js";import{e as each,i as index}from"./9Fe9rX9w.js";import{s as set_attribute}from"./DR0UNYFV.js";import{s as set_class}from"./a_jWnPqM.js";import{s as set_style}from"./CkfM7VC9.js";import{b as bind_this}from"./Dy2CllMe.js";import{g as goto}from"./ci-W82wf.js";import{w as writable}from"./BIfveV6e.js";const default_vert=`#version 300 es

// Author: TapiocaFox
// Title:  Default Vertex Shader

in  vec3 position;
out vec3 vPos;

void main() {
    gl_Position = vec4(position, 1.);
    vPos = position;
}`,default_frag=`#version 300 es

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
}`,default_js=`// Author: TapiocaFox
// Title:  Default Renderer

// Reference to foxGL (Only exposed APIs):
// export interface TapiocaFoxGLContext {
//     gl: WebGL2RenderingContext,
//     canvas: HTMLCanvasElement,
//     program: WebGLProgram,
//     startTime: number,
//     lastRenderTime: number,
//     devicePixelRatio: number,
//     onStart: (start: () => void) => void,
//     onStop: (stop: () => void) => void,
//     render: () => void,
//     setStatusTitle: (title: string) => void,
//     reportStatus: (key: string, status: string) => void,
// }

// console.log('JavaScript entered.');

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;
let destroyed = false;

// Declare listeners.
const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const uMouse_x = devicePixelRatio*(event.clientX-canvasRect.left);
    const uMouse_y = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouse_x, uMouse_y);
    foxGL.reportStatus('uMouse', \`uMouse: (\${uMouse_x.toFixed(1)}, \${uMouse_y.toFixed(1)})\`);
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
});

// Render per animation frame.
function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
    foxGL.render();
}

// Register listeners on start.
foxGL.onStart(async () => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.setStatusTitle('Default Renderer');
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    window.addEventListener('resize', onresize);
    animate();
});

// Deregister listeners on stop.
foxGL.onStop(async () => {
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    window.removeEventListener('resize', onresize);
});

// console.log('JavaScript exited.');`,edit_icon="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e",extension="fgl",nextSnapshot=writable(null);var root_2=from_html("<br/> ",1),root=from_html('<canvas></canvas> <button><img class="inline-glyph" alt="Edit"/>Edit</button> <div><h3> </h3> <p class="annotation"> <!></p></div>',1);function TapiocaFoxWebGL($$anchor,$$props){push($$props,!0);const props=rest_props($$props,["$$slots","$$events","$$legacy"]);let{vertex_shader=default_vert,fragment_shader=default_frag,javascript=default_js,mode="default",size=250,show_status_block=!0,background_color="transparent",onglinit=async function(t){return!0},onerror=async function(t,a){console.trace(a)}}=props;var canvas,status_block,edit_button;let display_status_block=state(!1),display_edit_button=state(!1),fps=state(0),statusTitle=state("Rendering Status"),statusDict=proxy({});const status_block_division_percentage=.5,pointer_offset=32;let foxGL;user_effect(()=>{vertex_shader=$$props.vertex_shader||vertex_shader,fragment_shader=$$props.fragment_shader||fragment_shader,javascript=$$props.javascript||javascript,foxGL&&(foxGL.newProgram(),foxGL.setup(vertex_shader,fragment_shader,javascript),foxGL.run())}),onMount(async()=>{try{const glNative=canvas.getContext("webgl2",{preserveDrawingBuffer:mode=="in-editor"});foxGL={gl:glNative,canvas,program:glNative.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,invokeStart:null,invokeStop:null,statusTitle:get(statusTitle),statusDict,vertexShader:"",fragmentShader:"",javascript:"",onStart(t){this.invokeStart=t},onStop(t){this.invokeStop=t},async start(){try{await this.invokeStart?.()}catch(t){onerror("js",t)}},async stop(){try{await this.invokeStop?.()}catch(t){onerror("js",t)}},async optimizeViewPort(){const t=this.gl,a=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),e=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==a||this.canvas.height!==e)&&(this.canvas.width=a,this.canvas.height=e,t.viewport(0,0,a,e)),await tick()},initProgram(t,a){const e=this.gl,s=(o,c)=>{const n=e.createShader(o);e.shaderSource(n,c),e.compileShader(n);const i=e.getShaderInfoLog(n);if(!e.getShaderParameter(n,e.COMPILE_STATUS)||i?.trim().length)throw`Cannot compile shader: ${i}`;e.attachShader(this.program,n)};try{s(e.VERTEX_SHADER,t)}catch(o){onerror("vert",o)}try{s(e.FRAGMENT_SHADER,a)}catch(o){onerror("frag",o)}if(e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw`Cannot link program:
${e.getProgramInfoLog(this.program)}`;e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,1,0,1,1,0,-1,-1,0,1,-1,0,-1,-1,0,1,1,0]),e.STATIC_DRAW);const r=e.getAttribLocation(this.program,"position");e.enableVertexAttribArray(r),e.vertexAttribPointer(r,3,e.FLOAT,!1,0,0)},evalJavaScript(){try{eval(javascript)}catch(t){onerror("js",t)}},render(){const t=this.gl,a=Date.now();set(fps,1e3/(a-this.lastRenderTime)),this.lastRenderTime=a,t.drawArrays(t.TRIANGLES,0,6)},newProgram(){const t=this.gl;t.getAttachedShaders(this.program)?.forEach(e=>{t.detachShader(this.program,e),t.deleteShader(e)}),t.deleteProgram(this.program),this.program=t.createProgram()},async reset(){const t=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const a=this.statusDict;for(const e in a)delete a[e];this.initProgram(this.vertexShader,this.fragmentShader),this.evalJavaScript(),await this.start()},setup(t,a,e){this.vertexShader=t,this.fragmentShader=a,this.javascript=e},async run(){await this.stop(),await this.optimizeViewPort(),this.initProgram(this.vertexShader,this.fragmentShader),this.evalJavaScript(),await this.start()},setStatusTitle(t){set(statusTitle,t,!0)},reportStatus(t,a){this.statusDict[t]=a}};const resizeObserver=new ResizeObserver(t=>{foxGL.optimizeViewPort()});resizeObserver.observe(canvas),canvas.addEventListener("pointermove",async t=>{const a=canvas.getBoundingClientRect(),e=a.bottom-a.top;if(show_status_block){set(display_status_block,!0),mode=="default"&&set(display_edit_button,!0);const{clientX:s,clientY:r}=t,o=window.innerWidth,c=window.innerHeight,n=status_block.offsetWidth,i=status_block.offsetHeight;(a.left+a.right)*.5<=o*status_block_division_percentage?(status_block.animate({left:`${Math.min(s+pointer_offset,o-n)}px`,top:`${Math.min(r+pointer_offset,c-i)}px`},{fill:"forwards"}),edit_button.animate({left:`${a.left}px`,top:`${a.bottom+4}px`},{fill:"forwards"})):(status_block.animate({right:`${Math.max(o-s+pointer_offset,0)}px`,top:`${Math.min(r+pointer_offset,c-i)}px`},{fill:"forwards"}),edit_button.animate({right:`${o-a.right}px`,top:`${a.bottom+4}px`},{fill:"forwards"}))}}),canvas.addEventListener("pointerleave",async t=>{if(set(display_status_block,!1),edit_button==null)return;const a=canvas.getBoundingClientRect(),e=edit_button.getBoundingClientRect();if(show_status_block){const{clientX:s,clientY:r}=t;e.left<=s&&s<=e.right&&r>a.top?set(display_edit_button,!0):set(display_edit_button,!1)}}),canvas.addEventListener("webglcontextlost",async t=>{t.preventDefault(),console.warn("GLSL canvas WebGL context lost!")});const runOnGlInit=await onglinit(foxGL);foxGL.setup(vertex_shader,fragment_shader,javascript),runOnGlInit&&foxGL.run()}catch(t){console.trace(t)}edit_button.onpointerenter=async t=>{mode=="default"&&set(display_edit_button,!0)},edit_button.onpointerleave=async t=>{set(display_edit_button,!1)}});function clickEditButton(){nextSnapshot.set({name:"",timestamp:0,img:"",vert:vertex_shader,frag:fragment_shader,js:javascript}),goto("/webgl_editor/")}var fragment=root(),canvas_1=first_child(fragment);let styles;bind_this(canvas_1,t=>canvas=t,()=>canvas);var button=sibling(canvas_1,2);button.__click=clickEditButton;var img=child(button);next(),reset(button),bind_this(button,t=>edit_button=t,()=>edit_button);var div=sibling(button,2),h3=child(div),text=child(h3,!0);reset(h3);var p=sibling(h3,2),text_1=child(p),node=sibling(text_1);{var consequent=t=>{var a=comment(),e=first_child(a);each(e,17,()=>Object.entries(statusDict),index,(s,r)=>{var o=user_derived(()=>to_array(get(r),2));let c=()=>get(o)[1];var n=root_2(),i=sibling(first_child(n),1,!0);template_effect(()=>set_text(i,c())),append(s,n)}),append(t,a)};if_block(node,t=>{statusDict!=null&&t(consequent)})}reset(p),reset(div),bind_this(div,t=>status_block=t,()=>status_block),template_effect((t,a)=>{set_class(canvas_1,1,`glsl ${mode??""}`,"svelte-1humrcv"),styles=set_style(canvas_1,"",styles,t),set_class(button,1,`edit ${get(display_edit_button)?"visible":""}`,"svelte-1humrcv"),set_attribute(img,"src",edit_icon),set_class(div,1,`floating-block ${get(display_status_block)&&mode!="background"?"visible":""}`),set_text(text,get(statusTitle)),set_text(text_1,`FPS: ${a??""} `)},[()=>({"max-width":mode=="preview"?"calc(var(--compact-width) * 0.25)":mode=="background"?"100vw":`${size}px`,"max-height":mode=="preview"?"auto":mode=="background"?"100vh":`${size}px`,"background-color":background_color}),()=>`${Math.round(get(fps))} (${canvas?.width}x${canvas?.height})`]),append($$anchor,fragment),pop()}delegate(["click"]);export{TapiocaFoxWebGL as T,default_js as a,default_frag as b,extension as c,default_vert as d,edit_icon as e,nextSnapshot as n};
