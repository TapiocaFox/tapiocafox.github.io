<script lang="ts">
    import { onMount } from 'svelte';
    import default_vert_shader from '$lib/assets/webgl/default.vert?raw';
    import default_frag_shader from '$lib/assets/webgl/default.frag?raw';
    import default_js from '$lib/assets/webgl/default?raw';
    import edit_icon from '$lib/assets/icons/edit.svg';
    import { goto } from '$app/navigation';

    interface TapiocaWebGL2RenderingContext extends WebGL2RenderingContext {
        canvas: HTMLCanvasElement,
        program: WebGLProgram,
        startTime: number,
        lastRenderTime: number,
        devicePixelRatio: number,
        initViewPort: () => void,
        initProgram: (vertexShader: string, fragmentShader: string) => void,
        newProgram: () => void,
        // animate: () => void,
        render: () => void,
    }

    const props = $props();
    let { vertex_shader=default_vert_shader, fragment_shader=default_frag_shader, mode='default', size=250, show_code_block=true, background_color='transparent' } = props;

    var canvas: HTMLCanvasElement;
    var code_block: HTMLDivElement;
    var edit_button: HTMLButtonElement;

    let display_code_block = $state(false);
    let display_edit_button = $state(false);
    let fps = $state(0);

    const code_block_division_percentage = 0.5;
    const pointer_offset = 56;
    const background_mode_shrink_by = 2;

    function shrink(value: number, shrink_by: number) {
        return Math.floor(value/shrink_by);
    }

    function shrink_bg(value: number) {
        return shrink(value, background_mode_shrink_by);
    }

    let tapiocaFoxGL: TapiocaWebGL2RenderingContext;

    $effect (() => {
        // console.log('Something changed:');
        // console.log(props.vertex_shader);
        // console.log(props.fragment_shader);
    });

    onMount(() => {
        try {
            const glNative = canvas.getContext('webgl2')!;

            tapiocaFoxGL = {
                ...glNative,
                canvas: canvas,
                program: glNative.createProgram(),
                startTime: Date.now(),
                lastRenderTime: 0,
                devicePixelRatio: window.devicePixelRatio || 1,
                
                initViewPort: function() {
                    const width  = Math.floor(this.canvas.clientWidth * devicePixelRatio);
                    const height = Math.floor(this.canvas.clientHeight * devicePixelRatio);

                    if (this.canvas.width !== width || this.canvas.height !== height) {
                        this.canvas.width = width;
                        this.canvas.height = height;
                        this.viewport(0, 0, width, height);
                    }
                },

                initProgram: function (vertexShader: string, fragmentShader: string) {
                    const addShader = (type: number, src: string) => {
                        const shader = this.createShader(type)!;
                        this.shaderSource(shader, src);
                        this.compileShader(shader);
                        if (!this.getShaderParameter(shader, this.COMPILE_STATUS))
                            throw `Cannot compile shader: ${this.getShaderInfoLog(shader)}`;
                        this.attachShader(this.program, shader);
                    };
                    addShader(this.VERTEX_SHADER, vertexShader);
                    addShader(this.FRAGMENT_SHADER, fragmentShader);
                    this.linkProgram(this.program);
                    if (!this.getProgramParameter(this.program, this.LINK_STATUS))
                        throw `Cannot link program:\n${this.getProgramInfoLog(this.program)}`;
                    this.useProgram(this.program);
                    this.bindBuffer(this.ARRAY_BUFFER, this.createBuffer());
                    this.bufferData(this.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), this.STATIC_DRAW);

                    const position = this.getAttribLocation(this.program, 'position');
                    this.enableVertexAttribArray(position);
                    this.vertexAttribPointer(position, 3, this.FLOAT, false, 0, 0);
                },

                render: function() {
                    const timeNow = Date.now();
                    fps = 0.001/(timeNow-this.lastRenderTime);
                    this.lastRenderTime = timeNow;
                    this.drawArrays(this.TRIANGLES, 0, 6);
                },

                newProgram: function() {
                    const attachedShaders = this.getAttachedShaders(this.program);
                     attachedShaders?.forEach(shader => {
                        this.detachShader(this.program, shader);
                        this.deleteShader(shader);
                    });
                    this.deleteProgram(this.program);
                    this.program = this.createProgram();
                }
            }
            
            let u_time_last_frame = 0;

            eval(default_js);

            canvas.addEventListener('pointermove', async (event) => {
                const canvasRect = canvas.getBoundingClientRect();
                // const canvasHeight = canvasRect.bottom - canvasRect.top;

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
    <h4>Vertex shader (FPS: {Math.round(fps)})</h4>
    <pre>{vertex_shader}</pre>
    <h4>Fragment shader</h4>
    <pre>{fragment_shader}</pre>
</div>