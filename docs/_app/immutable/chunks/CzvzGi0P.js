import"./DsnmJJEf.js";import{o as onMount}from"./sZ3Jm9HM.js";import{p as push,aJ as proxy,ac as user_effect,f as from_html,e as first_child,s as sibling,t as template_effect,a as append,b as pop,i as get,k as set,j as state,at as tick,c as child,n as next,r as reset,g as comment,aA as user_derived,a_ as to_array}from"./ug66gb1C.js";import{d as delegate,s as set_text}from"./gUgp7ExF.js";import{r as rest_props,i as if_block}from"./CkVXaSfc.js";import{e as each,i as index}from"./9Fe9rX9w.js";import{s as set_attribute}from"./DR0UNYFV.js";import{s as set_class}from"./a_jWnPqM.js";import{s as set_style}from"./CkfM7VC9.js";import{b as bind_this}from"./Dy2CllMe.js";import{g as goto}from"./CXhcfEP8.js";import{w as writable}from"./BIfveV6e.js";const default_vert=`#version 300 es

// Author: TapiocaFox
// Title:  Default Vertex Shader

in  vec3 aPos;
out vec3 vPos;

void main() {
    gl_Position = vec4(aPos, 1.);
    vPos = aPos;
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

// Start lifecycle.
foxGL.onStart(async () => {
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
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    window.addEventListener('resize', onresize);
    animate();
});

// Stop lifecycle.
foxGL.onStop(async () => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    window.removeEventListener('resize', onresize);
});`,edit_icon="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='File%20/%20Note_Edit'%3e%3cpath%20id='Vector'%20d='M10.0002%204H7.2002C6.08009%204%205.51962%204%205.0918%204.21799C4.71547%204.40973%204.40973%204.71547%204.21799%205.0918C4%205.51962%204%206.08009%204%207.2002V16.8002C4%2017.9203%204%2018.4801%204.21799%2018.9079C4.40973%2019.2842%204.71547%2019.5905%205.0918%2019.7822C5.5192%2020%206.07899%2020%207.19691%2020H16.8031C17.921%2020%2018.48%2020%2018.9074%2019.7822C19.2837%2019.5905%2019.5905%2019.2839%2019.7822%2018.9076C20%2018.4802%2020%2017.921%2020%2016.8031V14M16%205L10%2011V14H13L19%208M16%205L19%202L22%205L19%208M16%205L19%208'%20stroke='%23000000'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e",extension="fgl",nextSnapshot=writable(null);var root_2=from_html("<br/> ",1),root=from_html('<canvas></canvas> <button><img class="inline-glyph" alt="Edit"/>Edit</button> <div><h3> </h3> <p class="annotation"> <!></p></div>',1);function TapiocaFoxWebGL($$anchor,$$props){push($$props,!0);const props=rest_props($$props,["$$slots","$$events","$$legacy"]);let{vertex_shader=default_vert,fragment_shader=default_frag,javascript=default_js,mode="default",size=250,show_status_block=!0,background_color="transparent",onglinit=async function(t){return!0},onerror=async function(t,e){console.trace(e)}}=props;var canvas,status_block,edit_button;let display_status_block=state(!1),display_edit_button=state(!1),fps=state(0),statusTitle=state("Rendering Status"),statusDict=proxy({});const status_block_division_percentage=.5,pointer_offset=32;let foxGL;user_effect(()=>{vertex_shader=$$props.vertex_shader||vertex_shader,fragment_shader=$$props.fragment_shader||fragment_shader,javascript=$$props.javascript||javascript,foxGL&&(foxGL.newProgram(),foxGL.setup(vertex_shader,fragment_shader,javascript),foxGL.run())}),onMount(async()=>{try{const glNative=canvas.getContext("webgl2",{preserveDrawingBuffer:mode=="in-editor"});foxGL={gl:glNative,canvas,program:glNative.createProgram(),startTime:Date.now(),lastRenderTime:0,devicePixelRatio:window.devicePixelRatio||1,invokeStart:null,invokeStop:null,statusTitle:get(statusTitle),statusDict,vertexShader:"",fragmentShader:"",javascript:"",onStart(t){this.invokeStart=t},onStop(t){this.invokeStop=t},async start(){try{await this.invokeStart?.()}catch(t){onerror("js",t)}},async stop(){try{await this.invokeStop?.()}catch(t){onerror("js",t)}},async optimizeViewPort(){const t=this.gl,e=Math.floor(this.canvas.clientWidth*this.devicePixelRatio),a=Math.floor(this.canvas.clientHeight*this.devicePixelRatio);(this.canvas.width!==e||this.canvas.height!==a)&&(this.canvas.width=e,this.canvas.height=a,t.viewport(0,0,e,a)),await tick()},initProgram(t,e){const a=this.gl,o=(s,r)=>{const n=a.createShader(s);a.shaderSource(n,r),a.compileShader(n);const i=a.getShaderInfoLog(n);if(!a.getShaderParameter(n,a.COMPILE_STATUS)||i?.trim().length)throw`Cannot compile shader: ${i}`;a.attachShader(this.program,n)};try{o(a.VERTEX_SHADER,t)}catch(s){onerror("vert",s)}try{o(a.FRAGMENT_SHADER,e)}catch(s){onerror("frag",s)}if(a.linkProgram(this.program),!a.getProgramParameter(this.program,a.LINK_STATUS))throw`Cannot link program:
${a.getProgramInfoLog(this.program)}`;a.useProgram(this.program)},evalJavaScript(){try{eval(javascript)}catch(t){onerror("js",t)}},render(){const t=this.gl,e=Date.now();set(fps,1e3/(e-this.lastRenderTime)),this.lastRenderTime=e,t.drawArrays(t.TRIANGLES,0,6)},newProgram(){const t=this.gl;t.getAttachedShaders(this.program)?.forEach(a=>{t.detachShader(this.program,a),t.deleteShader(a)}),t.deleteProgram(this.program),this.program=t.createProgram()},async reset(){const t=this.gl;this.newProgram(),await this.stop(),await this.optimizeViewPort(),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),this.startTime=Date.now(),this.lastRenderTime=0;const e=this.statusDict;for(const a in e)delete e[a];this.initProgram(this.vertexShader,this.fragmentShader),this.evalJavaScript(),await this.start()},setup(t,e,a){this.vertexShader=t,this.fragmentShader=e,this.javascript=a},async run(){await this.stop(),await this.optimizeViewPort(),this.initProgram(this.vertexShader,this.fragmentShader),this.evalJavaScript(),await this.start()},setStatusTitle(t){set(statusTitle,t,!0)},reportStatus(t,e){this.statusDict[t]=e}};const resizeObserver=new ResizeObserver(t=>{foxGL.optimizeViewPort()});resizeObserver.observe(canvas),canvas.addEventListener("pointermove",async t=>{const e=canvas.getBoundingClientRect(),a=e.bottom-e.top;if(show_status_block){set(display_status_block,!0),mode=="default"&&set(display_edit_button,!0);const{clientX:o,clientY:s}=t,r=window.innerWidth,n=window.innerHeight,i=status_block.offsetWidth,c=status_block.offsetHeight;(e.left+e.right)*.5<=r*status_block_division_percentage?(status_block.animate({left:`${Math.min(o+pointer_offset,r-i)}px`,top:`${Math.min(s+pointer_offset,n-c)}px`},{fill:"forwards"}),edit_button.animate({left:`${e.left}px`,top:`${e.bottom+4}px`},{fill:"forwards"})):(status_block.animate({right:`${Math.max(r-o+pointer_offset,0)}px`,top:`${Math.min(s+pointer_offset,n-c)}px`},{fill:"forwards"}),edit_button.animate({right:`${r-e.right}px`,top:`${e.bottom+4}px`},{fill:"forwards"}))}}),canvas.addEventListener("pointerleave",async t=>{if(set(display_status_block,!1),edit_button==null)return;const e=canvas.getBoundingClientRect(),a=edit_button.getBoundingClientRect();if(show_status_block){const{clientX:o,clientY:s}=t;a.left<=o&&o<=a.right&&s>e.top?set(display_edit_button,!0):set(display_edit_button,!1)}}),canvas.addEventListener("webglcontextlost",async t=>{t.preventDefault(),console.warn("GLSL canvas WebGL context lost!")});const runOnGlInit=await onglinit(foxGL);foxGL.setup(vertex_shader,fragment_shader,javascript),runOnGlInit&&foxGL.run()}catch(t){console.trace(t)}edit_button.onpointerenter=async t=>{mode=="default"&&set(display_edit_button,!0)},edit_button.onpointerleave=async t=>{set(display_edit_button,!1)}});function clickEditButton(){nextSnapshot.set({name:"",timestamp:0,img:"",vert:vertex_shader,frag:fragment_shader,js:javascript}),goto("/webgl_editor/")}var fragment=root(),canvas_1=first_child(fragment);let styles;bind_this(canvas_1,t=>canvas=t,()=>canvas);var button=sibling(canvas_1,2);button.__click=clickEditButton;var img=child(button);next(),reset(button),bind_this(button,t=>edit_button=t,()=>edit_button);var div=sibling(button,2),h3=child(div),text=child(h3,!0);reset(h3);var p=sibling(h3,2),text_1=child(p),node=sibling(text_1);{var consequent=t=>{var e=comment(),a=first_child(e);each(a,17,()=>Object.entries(statusDict),index,(o,s)=>{var r=user_derived(()=>to_array(get(s),2));let n=()=>get(r)[1];var i=root_2(),c=sibling(first_child(i),1,!0);template_effect(()=>set_text(c,n())),append(o,i)}),append(t,e)};if_block(node,t=>{statusDict!=null&&t(consequent)})}reset(p),reset(div),bind_this(div,t=>status_block=t,()=>status_block),template_effect((t,e)=>{set_class(canvas_1,1,`glsl ${mode??""}`,"svelte-1humrcv"),styles=set_style(canvas_1,"",styles,t),set_class(button,1,`edit ${get(display_edit_button)?"visible":""}`,"svelte-1humrcv"),set_attribute(img,"src",edit_icon),set_class(div,1,`floating-block ${get(display_status_block)&&mode!="background"?"visible":""}`),set_text(text,get(statusTitle)),set_text(text_1,`FPS: ${e??""} `)},[()=>({"max-width":mode=="preview"?"calc(var(--compact-width) * 0.25)":mode=="background"?"100vw":`${size}px`,"max-height":mode=="preview"?"auto":mode=="background"?"100vh":`${size}px`,"background-color":background_color}),()=>`${Math.round(get(fps))} (${canvas?.width}x${canvas?.height})`]),append($$anchor,fragment),pop()}delegate(["click"]);export{TapiocaFoxWebGL as T,default_js as a,default_frag as b,extension as c,default_vert as d,edit_icon as e,nextSnapshot as n};
