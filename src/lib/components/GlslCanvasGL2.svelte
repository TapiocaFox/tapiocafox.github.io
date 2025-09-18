<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import default_vert_shader from '$lib/assets/glsl_shaders/default.vert?raw';
    import default_frag_shader from '$lib/assets/glsl_shaders/default.frag?raw';
    import edit_icon from '$lib/assets/icons/edit.svg';
    import { goto } from '$app/navigation';

    let {vertex_shader=default_vert_shader, fragment_shader=default_frag_shader, mode='default', size=250, show_code_block=true, background_color='transparent'} = $props();

    var canvas: HTMLCanvasElement;
    var code_block: HTMLDivElement;
    var edit_button: HTMLButtonElement;

    let display_code_block = $state(false);
    let display_edit_button = $state(false);
    let fps = $state(0);

    const code_block_division_percentage = 0.5;

    const pointer_offset = 56;

    const background_mode_shrink_by = 2;

    // const glsl_version = '300 es';

    // const vertex_shader_prefix = `#version ${glsl_version}\n
    // in vec3 position;`;
    // const fragment_shader_prefix = `#version ${glsl_version}`;

    function shrink(value: number, shrink_by: number) {
        return Math.floor(value/shrink_by);
    }

    function shrink_bg(value: number) {
        return shrink(value, background_mode_shrink_by);
    }

    // console.log(vertex_shader, fragment_shader);

    onMount(() => {
        try {
            const gl = canvas.getContext('webgl2')!;
            const gl_program = gl.createProgram();
            const startTime = Date.now() / 1000;
            const dpr = window.devicePixelRatio || 1;
            let u_time_last_frame = 0;

            init();
            animate();

            function init() {
                const width  = Math.floor(canvas.clientWidth * dpr);
                const height = Math.floor(canvas.clientHeight * dpr);
                // const width  = 250;
                // const height = 250;

                if (canvas.width !== width || canvas.height !== height) {
                    console.log('width, height', width, height);
                    // canvas.width = 550;
                    // canvas.height = 550;
                    canvas.width = width;
                    canvas.height = height;
                    gl.viewport(0, 0, width, height);
                }
                
                const setShaders = (vertexShader: string, fragmentShader: string) => {
                    const addShader = (type: number, src: string) => {
                        const shader = gl.createShader(type)!;
                        gl.shaderSource(shader, src);
                        gl.compileShader(shader);
                        if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS))
                            throw `Cannot compile shader: ${gl.getShaderInfoLog(shader)}`;
                        gl.attachShader(gl_program, shader);
                    };
                    addShader(gl.VERTEX_SHADER, vertexShader);
                    addShader(gl.FRAGMENT_SHADER, fragmentShader);
                    gl.linkProgram(gl_program);
                    if (! gl.getProgramParameter(gl_program, gl.LINK_STATUS))
                        throw `Cannot link program:\n${gl.getProgramInfoLog(gl_program)}`;
                    gl.useProgram(gl_program);
                    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());

                    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,1,0, 1,1,0, 0,0,0, 1,0,0, 0,0,0, 1,1,0]), gl.STATIC_DRAW);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
                    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,0,0, 0,0,0, -1,-1,0, 0,-1,0, -1,-1,0, 0,0,0]), gl.STATIC_DRAW);
                    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,0,0, -1,-1,0, 0,0,0, 1,0,0, 0,0,0, 1,1,0]), gl.STATIC_DRAW);

                    const position = gl.getAttribLocation(gl_program, 'position');
                    gl.enableVertexAttribArray(position);
                    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
                };

                setShaders(vertex_shader, fragment_shader);

                onWindowResize(null);
                window.addEventListener('resize', onWindowResize, false);
                
            }
            function onWindowResize(event: UIEvent | null) {
                gl.uniform2f(gl.getUniformLocation(gl_program, 'u_resolution'), canvas.width, canvas.width);
            }

            function animate() {
                requestAnimationFrame(animate);
                render();
            }

            function render() {
                const u_time = Date.now() / 1000 - startTime;
                // console.log(u_time_last_frame);
                fps = 1/(u_time-u_time_last_frame);
                u_time_last_frame = u_time; 
                gl.uniform1f(gl.getUniformLocation(gl_program, 'u_time'), u_time);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }

            canvas.onpointermove = async event => {
                const canvasRect = canvas.getBoundingClientRect();
                const canvasHeight = canvasRect.bottom - canvasRect.top;

                const u_mouse_x = dpr*(event.clientX-canvasRect.left);
                const u_mouse_y = dpr*(canvasHeight-(event.clientY-canvasRect.top));
                gl.uniform2f(gl.getUniformLocation(gl_program, 'u_mouse'), u_mouse_x, u_mouse_y);

                if(show_code_block) {
                    display_code_block = true;
                    if(mode == 'default') display_edit_button = true;

                    const { clientX, clientY } = event;

                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;

                    const codeBlockWidth = code_block.offsetWidth;
                    const codeBlockHeight = code_block.offsetHeight;

                    if((canvasRect.left+canvasRect.right)*0.5 <= windowWidth*code_block_division_percentage) {
                        code_block.animate({
                            left:`${Math.min(clientX+pointer_offset, windowWidth-codeBlockWidth)}px`,
                            top: `${Math.min(clientY+pointer_offset, windowHeight-codeBlockHeight)}px`
                        }, {fill: "forwards"});
                        edit_button.animate({
                            left:`${canvasRect.left}px`,
                            top: `${canvasRect.bottom+4}px`
                        }, {fill: "forwards"})
                    }
                    else {
                        code_block.animate({
                            right:`${Math.max(windowWidth-clientX+pointer_offset, 0)}px`,
                            top: `${Math.min(clientY+pointer_offset, windowHeight-codeBlockHeight)}px`
                        }, {fill: "forwards"});
                        edit_button.animate({
                            right:`${windowWidth-canvasRect.right}px`,
                            top: `${canvasRect.bottom+4}px`
                        }, {fill: "forwards"})
                    }
                }
            };

            canvas.onpointerleave = async event => {
                display_code_block = false;
                if(edit_button == null) return;

                const canvasRect = canvas.getBoundingClientRect();
                const editButtonRect = edit_button.getBoundingClientRect();

                if(show_code_block) {
                    const { clientX, clientY } = event;
                    if(editButtonRect.left<=clientX && clientX<=editButtonRect.right && clientY > canvasRect.top) {
                        display_edit_button = true;
                    }
                    else {
                        display_edit_button = false;
                    }
                }
            };

            canvas.addEventListener("webglcontextlost", (error) => {
                error.preventDefault();
                console.warn("GLSL canvas WebGL context lost!");
            });
        }
        catch (error) {
            console.log(error);
        }

        edit_button.onpointerenter = async event => {
            if(mode == 'default') display_edit_button = true;
        };

        edit_button.onpointerleave = async event => {
            display_edit_button = false;
        };
    });

    function clickEditButton() {
        goto(`/glsl/editor/?frag=${encodeURIComponent(fragment_shader)}`);
    }
    
</script>
<style>
    canvas.glsl {
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
        max-width: 220px;
        max-height: 220px;
        margin: auto;
        /* padding: 0; */
        border: 1px dotted var(--fox-background-color);
        /* background-color: white; */
        color: white;
        cursor: crosshair;
    }
    canvas.glsl.preview {
        max-height: calc(var(--compact-width) * 0.25);
        width: 100%;
        margin-right: var(--preview-row-gap);
    }
    canvas.glsl.background {
        position: fixed;
        z-index: -99;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        border: none;
    }
    @media (max-width: 768px) {
        canvas.glsl {
            width: 150px;
            height: 150px;
        }
        
        canvas.glsl.preview {
            max-height: calc(var(--shrink-card-img) * var(--compact-width) * 0.25);
            width: auto;
            margin-right: 8px;
        }
    }
    div.code-block {
        display: none;
        position: fixed;
        min-width: 100px;
        max-height: 90vh;
        /* min-height: 100px; */
        border: 1px solid var(--fox-background-color);
        background-color: rgba(255, 255, 255, 0.95);
        padding: 1em;
        max-width: 480px;
        z-index: 99;
        text-align: left;
    }
    div.code-block.visible {
        display: block !important; /* you can safely use !important here */
    }
    div.code-block > :first-child {
        margin-top: 0;
    }
    div.code-block > :last-child {
        margin-bottom: 0;
    }
    div.code-block > pre {
        white-space: pre-wrap;
        text-overflow: ellipsis;
        overflow: hidden; 
    }
    button.edit {
        display: none;
        position: fixed;
    }
    button.edit.visible {
        display: block !important;
        animation: dropdown var(--animation-time) linear forwards;
    }
    @keyframes dropdown {
        from {
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
        }
        to { 
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
    }
</style>
<canvas bind:this={canvas} 
style:max-width = {mode=='preview'?'calc(var(--compact-width) * 0.25)':(mode=='background'?`100vw`:`${size}px`)}
style:max-height = {mode=='preview'?'auto':(mode=='background'?`100vh`:`${size}px`)}
style:background-color = {background_color}
class="glsl {mode=='preview'?'preview':''} {mode=='background'?'background':''}"></canvas>
<button 
class="edit {display_edit_button ? 'visible' : ''}" 
onclick={clickEditButton}
bind:this={edit_button}>
<img class="inline-glyph" alt="Edit" src={edit_icon}/>Edit</button>
<!-- <div class="code-block {display_code_block ? 'visible' : ''}"  -->
<div class="code-block {display_code_block ? 'visible' : ''}" 
    bind:this={code_block}>
    <h4>Vertex shader (FPS: {Math.round(fps)})</h4>
    <pre>{vertex_shader}</pre>
    <h4>Fragment shader</h4>
    <pre>{fragment_shader}</pre>
    <!-- <p>{display_code_block}</p> -->
</div>