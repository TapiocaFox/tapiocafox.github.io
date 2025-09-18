<script lang="ts">
    import { onMount } from 'svelte';
    import default_vert_shader from '$lib/assets/webgl/default.vert?raw';
    import default_frag_shader from '$lib/assets/webgl/default.frag?raw';
    import default_js from '$lib/assets/webgl/default.js?raw';
    import edit_icon from '$lib/assets/icons/edit.svg';
    import { goto } from '$app/navigation';

    // console.log(`default_js: ${default_js}`);

    interface TapiocaFoxGL {
        gl: WebGL2RenderingContext,
        canvas: HTMLCanvasElement,
        program: WebGLProgram,
        startTime: number,
        lastRenderTime: number,
        devicePixelRatio: number,
        statusDict: Record<string, string>,
        animate: (() => void) | null,
        start: (() => void) | null,
        stop: (() => void) | null,
        onStart: (start: () => void) => void,
        onStop: (stop: () => void) => void,
        optimizeViewPort: () => void,
        initProgram: (vertexShader: string, fragmentShader: string) => void,
        newProgram: () => void,
        render: () => void,
        reportStatus: (key: string, status: string) => void,
    }

    const props = $props();
    let { vertex_shader=default_vert_shader, fragment_shader=default_frag_shader, javascript=default_js, mode='default', size=250, show_code_block=true, background_color='transparent' } = props;

    var canvas: HTMLCanvasElement;
    var code_block: HTMLDivElement;
    var edit_button: HTMLButtonElement;

    let display_code_block = $state(false);
    let display_edit_button = $state(false);
    let fps = $state(0);
    let statusDict = $state({});

    const code_block_division_percentage = 0.5;
    const pointer_offset = 56;
    const background_mode_shrink_by = 2;

    function shrink(value: number, shrink_by: number) {
        return Math.floor(value/shrink_by);
    }

    function shrink_bg(value: number) {
        return shrink(value, background_mode_shrink_by);
    }

    let tapiocaFoxGL: TapiocaFoxGL;

    function evalJavaScript(javascript: string) {
        try {
            // console.log('Eval', javascript);
            // eval(props.javascript);
            eval(javascript);
        }
        catch(error) {
            console.trace(error);
        } 
    }

    $effect (() => {
        // console.log('Something changed:');
        // console.log(props.vertex_shader);
        // console.log(fragment_shader);
        // console.log(props.fragment_shader);
        // console.log(props.javascript);
        vertex_shader = props.vertex_shader || vertex_shader;
        fragment_shader = props.fragment_shader || fragment_shader;
        javascript = props.javascript || javascript;


        if(tapiocaFoxGL) {
            tapiocaFoxGL.newProgram();

            tapiocaFoxGL.stop?.();

            tapiocaFoxGL.optimizeViewPort();
            tapiocaFoxGL.initProgram(vertex_shader, fragment_shader);

            evalJavaScript(javascript);

            tapiocaFoxGL.start?.();
        }
    });

    onMount(() => {
        try {
            const glNative = canvas.getContext('webgl2')!;

            tapiocaFoxGL = {
                gl: glNative,
                canvas: canvas,
                program: glNative.createProgram(),
                startTime: Date.now(),
                lastRenderTime: 0,
                devicePixelRatio: window.devicePixelRatio || 1,
                animate: null,
                start: null,
                stop: null,
                statusDict: statusDict,

                onStart: function(start) {
                    this.start = start;
                },

                onStop: function(stop) {
                    this.stop = stop;
                },

                optimizeViewPort: function() {
                    const gl = this.gl;
                    const width  = Math.floor(this.canvas.clientWidth * this.devicePixelRatio);
                    const height = Math.floor(this.canvas.clientHeight * this.devicePixelRatio);

                    if (this.canvas.width !== width || this.canvas.height !== height) {
                        this.canvas.width = width;
                        this.canvas.height = height;
                        gl.viewport(0, 0, width, height);
                    }
                },

                initProgram: function (vertexShader: string, fragmentShader: string) {
                    // console.log('initProgram');
                    const gl = this.gl;
                    const addShader = (type: number, src: string) => {
                        const shader = gl.createShader(type)!;
                        gl.shaderSource(shader, src);
                        gl.compileShader(shader);
                        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
                            throw `Cannot compile shader: ${gl.getShaderInfoLog(shader)}`;
                        gl.attachShader(this.program, shader);
                    };
                    addShader(gl.VERTEX_SHADER, vertexShader);
                    addShader(gl.FRAGMENT_SHADER, fragmentShader);
                    gl.linkProgram(this.program);
                    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
                        throw `Cannot link program:\n${gl.getProgramInfoLog(this.program)}`;
                    gl.useProgram(this.program);
                    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);

                    const position = gl.getAttribLocation(this.program, 'position');
                    gl.enableVertexAttribArray(position);
                    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
                },

                render: function() {
                    const gl = this.gl;
                    const timeNow = Date.now();
                    fps = 1000/(timeNow-this.lastRenderTime);
                    // console.log('delta', timeNow-this.lastRenderTime, 'fps', 1./(timeNow-this.lastRenderTime));
                    this.lastRenderTime = timeNow;
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                },

                newProgram: function() {
                    const gl = this.gl;
                    const attachedShaders = gl.getAttachedShaders(this.program);

                    attachedShaders?.forEach( (shader: WebGLProgram) => {
                        gl.detachShader(this.program, shader);
                        gl.deleteShader(shader);
                    });
                    gl.deleteProgram(this.program);
                    this.program = gl.createProgram();

                },

                reportStatus: function(key, status) {
                    // console.log(key, status, this.statusDict);
                    this.statusDict[key] = status;
                },
            };

            window.addEventListener('resize', async (event) => {
                tapiocaFoxGL.optimizeViewPort();
            });

            canvas.addEventListener('pointermove', async (event) => {
                const canvasRect = canvas.getBoundingClientRect();
                const canvasHeight = canvasRect.bottom - canvasRect.top;

                if(show_code_block) {
                    display_code_block = true;
                    if(mode == 'default') display_edit_button = true;

                    const { clientX, clientY } = event;

                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;

                    const codeBlockWidth = code_block.offsetWidth;
                    const codeBlockHeight = code_block.offsetHeight;

                    // if(mode == 'in-editor') {
                    //     pointerX = tapiocaFoxGL.devicePixelRatio*(event.clientX-canvasRect.left);
                    //     pointerY = tapiocaFoxGL.devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
                        // console.log(canvasHeight, event.clientY, canvasRect.top);
                    // }

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
            });

            canvas.addEventListener('pointerleave', async (event) => {
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
            });

            canvas.addEventListener('webglcontextlost', async (error) => {
                error.preventDefault();
                console.warn('GLSL canvas WebGL context lost!');
            });

            tapiocaFoxGL.stop?.();

            tapiocaFoxGL.optimizeViewPort();
            tapiocaFoxGL.initProgram(vertex_shader, fragment_shader);

            evalJavaScript(javascript);

            tapiocaFoxGL.start?.();

        }
        catch (error) {
            console.trace(error);
        }

        edit_button.onpointerenter = async event => {
            if(mode == 'default') display_edit_button = true;
        };

        edit_button.onpointerleave = async event => {
            display_edit_button = false;
        };

    });

    function clickEditButton() {
        goto(`/webgl_editor/?vert=${encodeURIComponent(vertex_shader)}&frag=${encodeURIComponent(fragment_shader)}&js=${encodeURIComponent(javascript)}`);
    }
    
</script>
<style>
    canvas.glsl {
        width: 100%;
        /* height: 100%; */
        aspect-ratio: 1;
        max-width: 220px;
        max-height: 220px;
        margin: auto;
        border: 1px dotted var(--fox-background-color);
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
            width: 220px;
            height: 220px;
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
        border: 1px solid var(--fox-background-color);
        background-color: rgba(255, 255, 255, 0.95);
        padding: 1em;
        max-width: 480px;
        z-index: 99;
        text-align: left;
    }
    div.code-block.visible {
        display: block !important;
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


<div class="code-block {display_code_block ? 'visible' : ''}" 
    bind:this={code_block}>
    {#if mode != 'in-editor'}
    <h4>Vertex shader (FPS: {Math.round(fps)})</h4>
    <pre>{props.vertex_shader}</pre>
    <h4>Fragment shader</h4>
    <pre>{props.fragment_shader}</pre>
    {:else}
    <h3>Rendering Status</h3>
    <p class="annotation">FPS: {`${Math.round(fps)} (${canvas?.width}x${canvas?.height})`} {#if statusDict!=null}{#each Object.entries(statusDict) as [key, status]}<br>{status}{/each}{/if}</p>
    {/if}
</div>