import"./DsnmJJEf.js";import{o as onMount}from"./-vV0HAPV.js";import{D as hydrating,p as push,az as proxy,j as user_effect,f as from_html,e as first_child,s as sibling,t as template_effect,a as append,b as pop,aw as set,ax as state,c as child,n as next,r as reset,o as get,g as comment,ay as user_derived,aX as to_array}from"./UPt5-JKI.js";import{d as delegate,s as set_text}from"./SOinAChg.js";import{r as rest_props,i as if_block}from"./m1joI1gH.js";import{e as each,i as index}from"./CCiDgPUn.js";import{s as set_attribute}from"./B8XZWvAf.js";import{t as to_class,s as set_style}from"./MNb0eeLk.js";import{b as bind_this}from"./onylsnVz.js";import{g as goto}from"./B1IjA_bS.js";function set_class(a,l,e,o,t,i){var n=a.__className;if(hydrating||n!==e||n===void 0){var r=to_class(e,o);(!hydrating||r!==a.getAttribute("class"))&&(r==null?a.removeAttribute("class"):a.className=r),a.__className=e}return i}const default_vert=`#version 300 es

// Author: TapiocaFox
// Title:  Default

in  vec3 position;
out vec3 vPos;

void main() {
    gl_Position = vec4(position, 1.);
    vPos = position;
}`,default_frag=`#version 300 es

// Author: TapiocaFox
// Title:  Default

#ifdef GL_ES
precision highp float;
#endif

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec3 stp = .5*vPos+.5;
    fragColor = vec4(stp, 1.);
}`,default_js=`// Author: TapiocaFox
// Title:  Default

// Reference to tapiocaFoxGL:
// interface TapiocaFoxGL {
//     gl: WebGL2RenderingContext,
//     canvas: HTMLCanvasElement,
//     program: WebGLProgram,
//     startTime: number,
//     lastRenderTime: number,
//     devicePixelRatio: number,
//     statusDict: Record<string, string>,
//     animate: (() => void) | null,
//     start: (() => void) | null,
//     stop: (() => void) | null,
//     onStart: (start: () => void) => void,
//     onStop: (stop: () => void) => void,
//     optimizeViewPort: () => void,
//     initProgram: (vertexShader: string, fragmentShader: string) => void,
//     newProgram: () => void,
//     render: () => void,
//     reportStatus: (key: string, status: string) => void,
// }

// console.log('JavaScript entered.');

const gl = tapiocaFoxGL.gl;
const program = tapiocaFoxGL.program;
const canvas = tapiocaFoxGL.canvas;

let destroyed = false;

const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const u_mouse_x = devicePixelRatio*(event.clientX-canvasRect.left);
    const u_mouse_y = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'u_mouse'), u_mouse_x, u_mouse_y);
    tapiocaFoxGL.reportStatus('u_mouse', \`u_mouse: (\${u_mouse_x.toFixed(1)}, \${u_mouse_y.toFixed(1)})\`);
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.width);
    tapiocaFoxGL.reportStatus('u_resolution', \`u_resolution: (\${canvas.width.toFixed(1)}, \${canvas.width.toFixed(1)})\`);
});

function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    const u_time = (Date.now() - tapiocaFoxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), u_time);
    tapiocaFoxGL.reportStatus('u_time', \`u_time: \${u_time.toFixed(2)}\`);
    tapiocaFoxGL.render();
}


tapiocaFoxGL.onStart(() => {
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.width);
    tapiocaFoxGL.reportStatus('u_resolution', \`u_resolution: (\${canvas.width.toFixed(1)}, \${canvas.width.toFixed(1)})\`);
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    window.addEventListener('resize', onresize);
    animate();
});

tapiocaFoxGL.onStop(() => {
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    window.removeEventListener('resize', onresize);
});

// console.log('JavaScript exited.');`,edit_icon="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";var root_1=from_html('<h4 class="svelte-1humrcv"> </h4> <pre class="svelte-1humrcv"> </pre> <h4 class="svelte-1humrcv">Fragment shader</h4> <pre class="svelte-1humrcv"> </pre>',1),root_4=from_html("<br/> ",1),root_2=from_html('<h3 class="svelte-1humrcv">Rendering Status</h3> <p class="annotation svelte-1humrcv"> <!></p>',1),root=from_html('<canvas></canvas> <button><img class="inline-glyph" alt="Edit"/>Edit</button> <div><!></div>',1);function TapiocaFoxWebGL($$anchor,$$props){push($$props,!0);const props=rest_props($$props,["$$slots","$$events","$$legacy"]);let{vertex_shader=default_vert,fragment_shader=default_frag,javascript=default_js,mode="default",size=250,show_code_block=!0,background_color="transparent"}=props;var canvas,code_block,edit_button;let display_code_block=state(!1),display_edit_button=state(!1),fps=state(0),statusDict=proxy({});const code_block_division_percentage=.5,pointer_offset=56;let tapiocaFoxGL;function evalJavaScript(javascript){try{eval(javascript)}catch(a){console.trace(a)}}user_effect(()=>{vertex_shader=$$props.vertex_shader||vertex_shader,fragment_shader=$$props.fragment_shader||fragment_shader,javascript=$$props.javascript||javascript,tapiocaFoxGL&&(tapiocaFoxGL.newProgram(),tapiocaFoxGL.stop?.(),tapiocaFoxGL.optimizeViewPort(),tapiocaFoxGL.initProgram(vertex_shader,fragment_shader),evalJavaScript(javascript),tapiocaFoxGL.start?.())}),onMount(()=>{try{const a=canvas.getContext("webgl2");tapiocaFoxGL={gl:a,canvas,program:a.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,animate:null,start:null,stop:null,statusDict,onStart(e){this.start=e},onStop(e){this.stop=e},optimizeViewPort(){const e=this.gl,o=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),t=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==o||this.canvas.height!==t)&&(this.canvas.width=o,this.canvas.height=t,e.viewport(0,0,o,t))},initProgram(e,o){const t=this.gl,i=(r,c)=>{const s=t.createShader(r);if(t.shaderSource(s,c),t.compileShader(s),!t.getShaderParameter(s,t.COMPILE_STATUS))throw`Cannot compile shader: ${t.getShaderInfoLog(s)}`;t.attachShader(this.program,s)};if(i(t.VERTEX_SHADER,e),i(t.FRAGMENT_SHADER,o),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS))throw`Cannot link program:
${t.getProgramInfoLog(this.program)}`;t.useProgram(this.program),t.bindBuffer(t.ARRAY_BUFFER,t.createBuffer()),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,1,0,1,1,0,-1,-1,0,1,-1,0,-1,-1,0,1,1,0]),t.STATIC_DRAW);const n=t.getAttribLocation(this.program,"position");t.enableVertexAttribArray(n),t.vertexAttribPointer(n,3,t.FLOAT,!1,0,0)},render(){const e=this.gl,o=Date.now();set(fps,1e3/(o-this.lastRenderTime)),this.lastRenderTime=o,e.drawArrays(e.TRIANGLES,0,6)},newProgram(){const e=this.gl;e.getAttachedShaders(this.program)?.forEach(t=>{e.detachShader(this.program,t),e.deleteShader(t)}),e.deleteProgram(this.program),this.program=e.createProgram()},reportStatus(e,o){this.statusDict[e]=o}},new ResizeObserver(e=>{tapiocaFoxGL.optimizeViewPort()}).observe(canvas),canvas.addEventListener("pointermove",async e=>{const o=canvas.getBoundingClientRect(),t=o.bottom-o.top;if(show_code_block){set(display_code_block,!0),mode=="default"&&set(display_edit_button,!0);const{clientX:i,clientY:n}=e,r=window.innerWidth,c=window.innerHeight,s=code_block.offsetWidth,d=code_block.offsetHeight;(o.left+o.right)*.5<=r*code_block_division_percentage?(code_block.animate({left:`${Math.min(i+pointer_offset,r-s)}px`,top:`${Math.min(n+pointer_offset,c-d)}px`},{fill:"forwards"}),edit_button.animate({left:`${o.left}px`,top:`${o.bottom+4}px`},{fill:"forwards"})):(code_block.animate({right:`${Math.max(r-i+pointer_offset,0)}px`,top:`${Math.min(n+pointer_offset,c-d)}px`},{fill:"forwards"}),edit_button.animate({right:`${r-o.right}px`,top:`${o.bottom+4}px`},{fill:"forwards"}))}}),canvas.addEventListener("pointerleave",async e=>{if(set(display_code_block,!1),edit_button==null)return;const o=canvas.getBoundingClientRect(),t=edit_button.getBoundingClientRect();if(show_code_block){const{clientX:i,clientY:n}=e;t.left<=i&&i<=t.right&&n>o.top?set(display_edit_button,!0):set(display_edit_button,!1)}}),canvas.addEventListener("webglcontextlost",async e=>{e.preventDefault(),console.warn("GLSL canvas WebGL context lost!")}),tapiocaFoxGL.stop?.(),tapiocaFoxGL.optimizeViewPort(),tapiocaFoxGL.initProgram(vertex_shader,fragment_shader),evalJavaScript(javascript),tapiocaFoxGL.start?.()}catch(a){console.trace(a)}edit_button.onpointerenter=async a=>{mode=="default"&&set(display_edit_button,!0)},edit_button.onpointerleave=async a=>{set(display_edit_button,!1)}});function clickEditButton(){goto(`/webgl_editor/?vert=${encodeURIComponent(vertex_shader)}&frag=${encodeURIComponent(fragment_shader)}&js=${encodeURIComponent(javascript)}`)}var fragment=root(),canvas_1=first_child(fragment);let styles;bind_this(canvas_1,a=>canvas=a,()=>canvas);var button=sibling(canvas_1,2);button.__click=clickEditButton;var img=child(button);next(),reset(button),bind_this(button,a=>edit_button=a,()=>edit_button);var div=sibling(button,2),node=child(div);{var consequent=a=>{var l=root_1(),e=first_child(l),o=child(e);reset(e);var t=sibling(e,2),i=child(t,!0);reset(t);var n=sibling(t,4),r=child(n,!0);reset(n),template_effect(c=>{set_text(o,`Vertex shader (FPS: ${c??""})`),set_text(i,$$props.vertex_shader),set_text(r,$$props.fragment_shader)},[()=>Math.round(get(fps))]),append(a,l)},alternate=a=>{var l=root_2(),e=sibling(first_child(l),2),o=child(e),t=sibling(o);{var i=n=>{var r=comment(),c=first_child(r);each(c,17,()=>Object.entries(statusDict),index,(s,d)=>{var v=user_derived(()=>to_array(get(d),2));let _=()=>get(v)[1];var p=root_4(),m=sibling(first_child(p),1,!0);template_effect(()=>set_text(m,_())),append(s,p)}),append(n,r)};if_block(t,n=>{statusDict!=null&&n(i)})}reset(e),template_effect(n=>set_text(o,`FPS: ${n??""} `),[()=>`${Math.round(get(fps))} (${canvas?.width}x${canvas?.height})`]),append(a,l)};if_block(node,a=>{mode!="in-editor"?a(consequent):a(alternate,!1)})}reset(div),bind_this(div,a=>code_block=a,()=>code_block),template_effect(a=>{set_class(canvas_1,1,`glsl ${mode??""}`,"svelte-1humrcv"),styles=set_style(canvas_1,"",styles,a),set_class(button,1,`edit ${get(display_edit_button)?"visible":""}`,"svelte-1humrcv"),set_attribute(img,"src",edit_icon),set_class(div,1,`code-block ${get(display_code_block)?"visible":""}`,"svelte-1humrcv")},[()=>({"max-width":mode=="preview"?"calc(var(--compact-width) * 0.25)":mode=="background"?"100vw":`${size}px`,"max-height":mode=="preview"?"auto":mode=="background"?"100vh":`${size}px`,"background-color":background_color})]),append($$anchor,fragment),pop()}delegate(["click"]);export{TapiocaFoxWebGL as T,default_frag as a,default_js as b,default_vert as d,edit_icon as e,set_class as s};
