import"./DsnmJJEf.js";import{o as onMount}from"./qytXBmRB.js";import{D as hydrating,p as push,j as user_effect,f as from_html,e as first_child,s as sibling,t as template_effect,a as append,b as pop,av as set,aw as state,c as child,n as next,r as reset,o as get}from"./7KmB_8Bl.js";import{d as delegate,s as set_text}from"./0qSW_X5u.js";import{s as set_attribute}from"./DliB0WGa.js";import{t as to_class,s as set_style}from"./DKwsPZ7O.js";import{b as bind_this}from"./jhTbCOVZ.js";import{r as rest_props}from"./BK4CHoPU.js";import{g as goto}from"./CcorBSfF.js";function set_class(a,e,o,t,i,n){var s=a.__className;if(hydrating||s!==o||s===void 0){var c=to_class(o,t);(!hydrating||c!==a.getAttribute("class"))&&(c==null?a.removeAttribute("class"):a.className=c),a.__className=o}return n}const default_vert=`#version 300 es

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
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;    
    vec3 color = vec3(0.);
    color = vec3(st.x,st.y,abs(sin(u_time)));

    fragColor = vec4(color,1.0);
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
//     animate: (() => void) | null,
//     start: (() => void) | null,
//     stop: (() => void) | null,
//     onStart: (start: () => void) => void,
//     onStop: (stop: () => void) => void,
//     initViewPort: () => void,
//     initProgram: (vertexShader: string, fragmentShader: string) => void,
//     newProgram: () => void,
//     render: () => void
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
};

const onresize = async event => {
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.width);
};

function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    const u_time = (Date.now() - tapiocaFoxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), u_time);
    tapiocaFoxGL.render();
}


tapiocaFoxGL.onStart(() => {
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.width);
    canvas.addEventListener('pointermove', onpointermove);
    window.addEventListener('resize', onresize);
    animate();
});

tapiocaFoxGL.onStop(() => {
    destroyed = true;
    canvas.removeEventListener('pointermove', onpointermove);
    window.removeEventListener('resize', onresize);
});

// console.log('JavaScript exited.');`,edit_icon="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";function clickEditButton(a,e,o,t){goto(`/webgl_editor/?vert=${encodeURIComponent(e)}&frag=${encodeURIComponent(o)}&js=${encodeURIComponent(t)}`)}var root=from_html('<canvas></canvas> <button><img class="inline-glyph" alt="Edit"/>Edit</button> <div><h4 class="svelte-1humrcv"> </h4> <pre class="svelte-1humrcv"> </pre> <h4 class="svelte-1humrcv">Fragment shader</h4> <pre class="svelte-1humrcv"> </pre></div>',1);function TapiocaFoxWebGL($$anchor,$$props){push($$props,!0);const props=rest_props($$props,["$$slots","$$events","$$legacy"]);let{vertex_shader=default_vert,fragment_shader=default_frag,javascript=default_js,mode="default",size=250,show_code_block=!0,background_color="transparent"}=props;var canvas,code_block,edit_button;let display_code_block=state(!1),display_edit_button=state(!1),fps=state(0);const code_block_division_percentage=.5,pointer_offset=56;let tapiocaFoxGL;function evalJavaScript(){try{eval(javascript)}catch(a){console.trace(a)}}user_effect(()=>{$$props.vertex_shader,$$props.fragment_shader,$$props.javascript,tapiocaFoxGL&&(tapiocaFoxGL.newProgram(),tapiocaFoxGL.stop?.(),tapiocaFoxGL.optimizeViewPort(),tapiocaFoxGL.initProgram($$props.vertex_shader,$$props.fragment_shader),evalJavaScript(),tapiocaFoxGL.start?.())}),onMount(()=>{try{const a=canvas.getContext("webgl2");tapiocaFoxGL={gl:a,canvas,program:a.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,animate:null,start:null,stop:null,onStart(e){this.start=e},onStop(e){this.stop=e},optimizeViewPort(){const e=this.gl,o=Math.floor(this.canvas.clientWidth*devicePixelRatio),t=Math.floor(this.canvas.clientHeight*devicePixelRatio);(this.canvas.width!==o||this.canvas.height!==t)&&(this.canvas.width=o,this.canvas.height=t,e.viewport(0,0,o,t))},initProgram(e,o){const t=this.gl,i=(s,c)=>{const r=t.createShader(s);if(t.shaderSource(r,c),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS))throw`Cannot compile shader: ${t.getShaderInfoLog(r)}`;t.attachShader(this.program,r)};if(i(t.VERTEX_SHADER,e),i(t.FRAGMENT_SHADER,o),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS))throw`Cannot link program:
${t.getProgramInfoLog(this.program)}`;t.useProgram(this.program),t.bindBuffer(t.ARRAY_BUFFER,t.createBuffer()),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,1,0,1,1,0,-1,-1,0,1,-1,0,-1,-1,0,1,1,0]),t.STATIC_DRAW);const n=t.getAttribLocation(this.program,"position");t.enableVertexAttribArray(n),t.vertexAttribPointer(n,3,t.FLOAT,!1,0,0)},render(){const e=this.gl,o=Date.now();set(fps,1e3/(o-this.lastRenderTime)),this.lastRenderTime=o,e.drawArrays(e.TRIANGLES,0,6)},newProgram(){const e=this.gl;e.getAttachedShaders(this.program)?.forEach(t=>{e.detachShader(this.program,t),e.deleteShader(t)}),e.deleteProgram(this.program),this.program=e.createProgram()}},window.addEventListener("resize",async e=>{tapiocaFoxGL.optimizeViewPort()}),canvas.addEventListener("pointermove",async e=>{const o=canvas.getBoundingClientRect();if(show_code_block){set(display_code_block,!0),mode=="default"&&set(display_edit_button,!0);const{clientX:t,clientY:i}=e,n=window.innerWidth,s=window.innerHeight,c=code_block.offsetWidth,r=code_block.offsetHeight;(o.left+o.right)*.5<=n*code_block_division_percentage?(code_block.animate({left:`${Math.min(t+pointer_offset,n-c)}px`,top:`${Math.min(i+pointer_offset,s-r)}px`},{fill:"forwards"}),edit_button.animate({left:`${o.left}px`,top:`${o.bottom+4}px`},{fill:"forwards"})):(code_block.animate({right:`${Math.max(n-t+pointer_offset,0)}px`,top:`${Math.min(i+pointer_offset,s-r)}px`},{fill:"forwards"}),edit_button.animate({right:`${n-o.right}px`,top:`${o.bottom+4}px`},{fill:"forwards"}))}}),canvas.addEventListener("pointerleave",async e=>{if(set(display_code_block,!1),edit_button==null)return;const o=canvas.getBoundingClientRect(),t=edit_button.getBoundingClientRect();if(show_code_block){const{clientX:i,clientY:n}=e;t.left<=i&&i<=t.right&&n>o.top?set(display_edit_button,!0):set(display_edit_button,!1)}}),canvas.addEventListener("webglcontextlost",async e=>{e.preventDefault(),console.warn("GLSL canvas WebGL context lost!")}),tapiocaFoxGL.stop?.(),tapiocaFoxGL.optimizeViewPort(),tapiocaFoxGL.initProgram($$props.vertex_shader,$$props.fragment_shader),evalJavaScript(),tapiocaFoxGL.start?.()}catch(a){console.trace(a)}edit_button.onpointerenter=async a=>{mode=="default"&&set(display_edit_button,!0)},edit_button.onpointerleave=async a=>{set(display_edit_button,!1)}});var fragment=root(),canvas_1=first_child(fragment);let styles;bind_this(canvas_1,a=>canvas=a,()=>canvas);var button=sibling(canvas_1,2);button.__click=[clickEditButton,vertex_shader,fragment_shader,javascript];var img=child(button);next(),reset(button),bind_this(button,a=>edit_button=a,()=>edit_button);var div=sibling(button,2),h4=child(div),text=child(h4);reset(h4);var pre=sibling(h4,2),text_1=child(pre,!0);reset(pre);var pre_1=sibling(pre,4),text_2=child(pre_1,!0);reset(pre_1),reset(div),bind_this(div,a=>code_block=a,()=>code_block),template_effect((a,e)=>{set_class(canvas_1,1,`glsl ${mode=="preview"?"preview":""} ${mode=="background"?"background":""}`,"svelte-1humrcv"),styles=set_style(canvas_1,"",styles,a),set_class(button,1,`edit ${get(display_edit_button)?"visible":""}`,"svelte-1humrcv"),set_attribute(img,"src",edit_icon),set_class(div,1,`code-block ${get(display_code_block)?"visible":""}`,"svelte-1humrcv"),set_text(text,`Vertex shader (FPS: ${e??""})`),set_text(text_1,$$props.vertex_shader),set_text(text_2,$$props.fragment_shader)},[()=>({"max-width":mode=="preview"?"calc(var(--compact-width) * 0.25)":mode=="background"?"100vw":`${size}px`,"max-height":mode=="preview"?"auto":mode=="background"?"100vh":`${size}px`,"background-color":background_color}),()=>Math.round(get(fps))]),append($$anchor,fragment),pop()}delegate(["click"]);export{TapiocaFoxWebGL as T,default_frag as a,default_js as b,default_vert as d,edit_icon as e,set_class as s};
