<script lang="ts">
    import { onDestroy, onMount, tick } from 'svelte';
    import Portal from 'svelte-portal';
    import default_vert_shader from '$lib/assets/webgl/default.vert?raw';
    import default_frag_shader from '$lib/assets/webgl/default.frag?raw';
    import default_modules from '$lib/assets/webgl/default_modules';
    import edit_icon from '$lib/assets/icons/edit.svg';
    import { goto } from '$app/navigation';
    import type { TapiocaFoxGLContext } from './TapiocaFoxGLContext';
    import type { Asset, Status, ModuleSource } from './TapiocaFoxWebGL';
    import { createSandbox } from './TapiocaFoxWebGL';
    import {type Snapshot, nextSnapshot} from '../../routes/webgl_editor/snapshot';

    // console.log(`default_js: ${default_js}`);

    // const props = $props();
    let { vertex_shader=$bindable(default_vert_shader), fragment_shader=$bindable(default_frag_shader), modules=$bindable<Record<string, string>>(default_modules), assets=$bindable<Record<string, Asset>>({}), mode='default', size=250, show_status_block=true, background_color='transparent', onglinit=async function(tapiocafoxGl:TapiocaFoxGLContext) {return true;}, onerror=async function(type: string, error: any) {console.trace(error)} } = $props();

    var canvas: HTMLCanvasElement;
    var status_block: HTMLDivElement;
    var edit_button: HTMLButtonElement;

    let display_status_block = $state(false);
    let display_edit_button = $state(false);
    let fps = $state(0);
    let statusTitle = $state('Rendering Status');
    let statusDict = $state<Record<string, Status>>({});

    const status_block_division_percentage = 0.5;
    const pointer_offset = 32;
    const background_mode_shrink_by = 2;

    function shrink(value: number, shrink_by: number) {
        return Math.floor(value/shrink_by);
    }

    function shrink_bg(value: number) {
        return shrink(value, background_mode_shrink_by);
    }

    let foxGL: TapiocaFoxGLContext;

    const sandboxUncaughtErrorListener = (module: string, error: unknown) => {
        console.log('module:', module, '\nerror:', error);
        onerror('js', {
            module: module,
            error: error
        });
    };

    $effect ( () => {
        // console.log('Something changed:');
        // console.log(props.vertex_shader);
        // console.log(fragment_shader);
        // console.log(props.fragment_shader);
        // console.log(props.javascript);
        // vertex_shader = props.vertex_shader || vertex_shader;
        // fragment_shader = props.fragment_shader || fragment_shader;
        // javascript = props.javascript || javascript;
        // assets = props.assets || assets;
        // console.log(`vertex_shader: ${vertex_shader.length}, fragment_shader: ${fragment_shader.length}, javascript: ${javascript.length}, assets: ${Object.keys(assets).length}`);
        vertex_shader;
        fragment_shader; 
        modules;
        assets;
        if (!foxGL) return;
        // console.log('Something changed and foxGL exists, re-setup and run.');
        (async () => {
            foxGL.newProgram();
            foxGL.setShadersModulesAndAssets(vertex_shader, fragment_shader, modules, assets);
            await foxGL.refreshShadersAndModules();
        })();
    });

    onMount(async () => {
        try {
            const glNative = canvas.getContext('webgl2', { preserveDrawingBuffer: mode=='in-editor' })!;

            foxGL = {
                gl: glNative,
                canvas: canvas,
                program: glNative.createProgram(),
                startTime: Date.now(),
                lastRenderTime: 0,
                devicePixelRatio: window.devicePixelRatio || 1,
                // animate: null,
                // invokeStart: null,
                // invokeStop: null,
                statusTitle: statusTitle,
                statusDict: statusDict,
                vertexShader: '',
                fragmentShader: '',
                sandbox: createSandbox(),
                indexModule: null,
                assets: {},
                // loadedScripts: [],

                // onStart: function(start) {
                //     this.invokeStart = start;
                // },

                // onStop: function(stop) {
                //     this.invokeStop = stop;
                // },

                start: async function() {
                    try {
                        await this.indexModule?.start?.(this);
                    }
                    catch(error: any) {
                        onerror('js', {module: 'index', error: error});
                    }
                },

                stop: async function() {
                    try {
                        await this.indexModule?.stop?.(this);
                    }
                    catch(error: any) {
                        onerror('js', {module: 'index', error: error});
                    }
                },

                optimizeViewPort: async function() {
                    const gl = this.gl;
                    const width  = Math.floor(this.canvas.clientWidth * this.devicePixelRatio);
                    const height = Math.floor(this.canvas.clientHeight * this.devicePixelRatio);

                    if (this.canvas.width !== width || this.canvas.height !== height) {
                        this.canvas.width = width;
                        this.canvas.height = height;
                        gl.viewport(0, 0, width, height);
                    }
                    await tick();
                },

                // unloadLoadedScripts: function() {
                //     this.loadedScripts.forEach( (script) => {
                //         document.head.removeChild(script);
                //     });
                //     this.loadedScripts = [];
                // },

                initProgram: function (vertexShader: string, fragmentShader: string) {
                    // console.log('initProgram');
                    const gl = this.gl;
                    const addShader = (type: number, src: string) => {
                        const shader = gl.createShader(type)!;
                        gl.shaderSource(shader, src);
                        gl.compileShader(shader);
                        const infoLog = gl.getShaderInfoLog(shader); // For safari.
                        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) || infoLog?.trim().length)
                            throw `Cannot compile shader: ${infoLog}`;
                        gl.attachShader(this.program, shader);
                    };

                    try {
                        addShader(gl.VERTEX_SHADER, vertexShader);
                    }
                    catch(error) {
                        onerror('vert', error);
                        throw error;
                    }
                    try {
                        addShader(gl.FRAGMENT_SHADER, fragmentShader);
                    }
                    catch(error) {
                        onerror('frag', error);
                        throw error;
                    }

                    gl.linkProgram(this.program);
                    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
                        throw `Cannot link program:\n${gl.getProgramInfoLog(this.program)}`;
                    gl.useProgram(this.program);
                },

                importIndexModule: async function () {
                    try {
                        // console.log('Eval', javascript);
                        // eval(props.javascript);
                        this.indexModule = await this.sandbox.import('index');
                    }
                    catch(error) {
                        onerror('js', {module: 'index', error: error});
                    } 
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

                reset: async function() {
                    const gl = this.gl;
                    this.newProgram();
                    await this.stop();
                    // this.unloadLoadedScripts();
                    await this.optimizeViewPort();
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear both color and depth buffers
                    this.startTime = Date.now();
                    this.lastRenderTime = 0;
                    const statusDict = this.statusDict;
                    for (const key in statusDict) {
                        delete statusDict[key];
                    }
                    await this.sandbox.reloadAll();
                    this.initProgram(this.vertexShader, this.fragmentShader);
                    await this.importIndexModule();
                    await this.start();
                },

                setShadersModulesAndAssets: function(vertex_shader: string, fragment_shader: string, modules: Record<string, string>, assets: Record<string, Asset>) {
                    this.vertexShader = vertex_shader;
                    this.fragmentShader = fragment_shader;
                    for (const key in modules) {
                        this.sandbox.register(key, modules[key]);
                    }
                    this.assets = assets;
                },

                refreshShadersAndModules: async function() {
                    await this.stop();
                    // this.unloadLoadedScripts();
                    await this.optimizeViewPort();
                    const statusDict = this.statusDict;
                    for (const key in statusDict) {
                        delete statusDict[key];
                    }
                    await this.sandbox.reloadAll();
                    this.initProgram(this.vertexShader, this.fragmentShader);
                    await this.importIndexModule();
                    await this.start();
                },

                setStatusTitle: function(title: string) {
                    statusTitle = title;
                },

                reportStatus: function(key, text, color='inherit') {
                    // console.log(key, status, this.statusDict);
                    this.statusDict[key] = {
                        text: text,
                        color: color
                    };
                },

                // loadScriptFromSource: async function(src: string) {
                //     return new Promise<void>((resolve, reject) => {
                //         const script = document.createElement('script');
                //         script.src = src;
                //         script.onload = () => resolve();
                //         script.onerror = (e) => reject(e);
                //         document.head.appendChild(script);
                //         this.loadedScripts.push(script);
                //     });
                // },

                getAssetById: async function(id: string) {
                    const asset = this.assets[id];
                    if(typeof(asset)==='undefined' || asset==null)
                        throw `Asset with id "${id}" does not exist.`;
                    if(asset.type == 'image') {
                        return new Promise((resolve, reject) => {
                            const img = new Image();
                            img.crossOrigin = "anonymous";

                            img.onload = () => resolve(img);
                            img.onerror = (err) => reject(err);

                            img.src = asset.src;

                            // Handle cache-race condition:
                            if (img.complete) {
                                // If cached and already loaded, resolve immediately
                                resolve(img);
                            }
                        });
                    }
                    if (asset.type === 'audio') {
                        return new Promise<HTMLAudioElement>((resolve, reject) => {
                            const audio = new Audio();
                            audio.crossOrigin = "anonymous";

                            audio.oncanplaythrough = () => resolve(audio);
                            audio.onerror = (err) => reject(err);

                            audio.src = asset.src;
                            audio.load();
                        });
                    }

                    throw 'Not implemented'; // Placeholder
                }
            };

            foxGL.sandbox.addUncaughtErrorListener(sandboxUncaughtErrorListener);

            const resizeObserver = new ResizeObserver(entries => {
                foxGL.optimizeViewPort();
            });
            resizeObserver.observe(canvas);

            // window.addEventListener('resize', async (event) => {
            //     tapiocaFoxGL.optimizeViewPort();
            // });

            canvas.addEventListener('pointermove', async (event) => {
                const canvasRect = canvas.getBoundingClientRect();
                const canvasHeight = canvasRect.bottom - canvasRect.top;

                if(show_status_block) {
                    display_status_block = true;
                    if(mode == 'default') display_edit_button = true;

                    const { clientX, clientY } = event;

                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;

                    const statusBlockWidth = status_block.offsetWidth;
                    const statusBlockHeight = status_block.offsetHeight;

                    // if(mode == 'in-editor') {
                    //     pointerX = tapiocaFoxGL.devicePixelRatio*(event.clientX-canvasRect.left);
                    //     pointerY = tapiocaFoxGL.devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
                        // console.log(canvasHeight, event.clientY, canvasRect.top);
                    // }

                    if((canvasRect.left+canvasRect.right)*0.5 <= windowWidth*status_block_division_percentage) {
                        status_block.animate({
                            left:`${Math.min(clientX+pointer_offset, windowWidth-statusBlockWidth)}px`,
                            top: `${Math.min(clientY+pointer_offset, windowHeight-statusBlockHeight)}px`
                        }, {fill: "forwards"});
                        edit_button.animate({
                            left:`${canvasRect.left}px`,
                            top: `${canvasRect.bottom+4}px`
                        }, {fill: "forwards"});
                    }
                    else {
                        status_block.animate({
                            right:`${Math.max(windowWidth-clientX+pointer_offset, 0)}px`,
                            top: `${Math.min(clientY+pointer_offset, windowHeight-statusBlockHeight)}px`
                        }, {fill: "forwards"});
                        edit_button.animate({
                            right:`${windowWidth-canvasRect.right}px`,
                            top: `${canvasRect.bottom+4}px`
                        }, {fill: "forwards"});
                    }
                }
            });

            canvas.addEventListener('pointerleave', async (event) => {
                display_status_block = false;
                if(edit_button == null) return;

                const canvasRect = canvas.getBoundingClientRect();
                const editButtonRect = edit_button.getBoundingClientRect();

                if(show_status_block) {
                    const { clientX, clientY } = event;
                    if(editButtonRect.left<=clientX && clientX<=editButtonRect.right && clientY > canvasRect.top) {
                        display_edit_button = true;
                    }
                    else {
                        display_edit_button = false;
                    }
                }
            });

            document.addEventListener('scroll', async (event) => {
                display_status_block = false;
                display_edit_button = false;
            }, true);

            canvas.addEventListener('webglcontextlost', async (error) => {
                error.preventDefault();
                console.warn('GLSL canvas WebGL context lost!');
            });

            const refreshOnGlInit = await onglinit(foxGL);
            foxGL.setShadersModulesAndAssets(vertex_shader, fragment_shader, modules, assets);
            if(refreshOnGlInit) await foxGL.refreshShadersAndModules();
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

    onDestroy(() => {
        foxGL?.sandbox.removeUncaughtErrorListener(sandboxUncaughtErrorListener);
    });

    function clickEditButton() {
        nextSnapshot.set({
            name: '',
            timestamp: 0,
            img: '',
            vert: vertex_shader,
            frag: fragment_shader,
            modules: modules,
            assets: assets,
        });
        goto(`/webgl_editor`);
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
        /* border-radius: var(--sharper-radius); */
    }
    
    canvas.glsl.preview {
        max-height: calc(var(--compact-widcth) * 0.25);
        box-sizing: border-box;
        /* max-height: calc(var(--compact-widcth) * 0.25); */
        width: 100%;
        margin-right: var(--preview-row-gap);
    }

    canvas.glsl.background {
        position: fixed;
        z-index: calc(-1 * var(--large-z-index));
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        border: none;
        cursor: unset;
    }

    @media (max-width: 768px) {
        canvas.glsl {
            width: 170px;
            height: 170px;
        }
        
        canvas.glsl.preview {
            max-height: calc(var(--shrink-card-img) * var(--compact-width) * 0.25);
            box-sizing: border-box;
            width: auto;
            margin-right: 8px;
        }

        canvas.glsl.in-editor {
            max-width: 300px !important;
            max-height: 300px !important;
        }
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

<button 
    class="edit {display_edit_button ? 'visible' : ''}" 
    onclick={clickEditButton}
    bind:this={edit_button}>
<img class="inline-glyph" alt="Edit" src={edit_icon}/>Edit</button>

{#if show_status_block}
<Portal target="body">
<div class="floating-block {(display_status_block && mode != "background") ? 'visible' : ''}" 
    bind:this={status_block}>
    <!-- {#if mode != 'in-editor'}
    <h4>Vertex shader (FPS: {Math.round(fps)})</h4>
    <pre>{props.vertex_shader}</pre>
    <h4>Fragment shader</h4>
    <pre>{props.fragment_shader}</pre>
    {:else} -->
    <h3>{statusTitle}</h3>
    <p class="annotation">FPS: {`${Math.round(fps)} (${canvas?.width}x${canvas?.height})`} {#if statusDict!=null}{#each Object.entries(statusDict) as [key, status]}<br><span style:color={status.color}>{status.text}</span>{/each}{/if}</p>
    <!-- {/if} -->
</div>
</Portal>
{/if}

<canvas bind:this={canvas} 
    style:max-width = {mode=='preview'?'calc(var(--compact-width) * 0.25)':(mode=='background'?`100vw`:`${size}px`)}
    style:max-height = {mode=='preview'?'auto':(mode=='background'?`100vh`:`${size}px`)}
    style:background-color = {background_color}
    class="glsl {mode}"></canvas>