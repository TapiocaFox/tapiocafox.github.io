<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import default_vert_shader from '$lib/assets/webgl/practice_1/default_three.vert?raw';
    import default_frag_shader from '$lib/assets/webgl/practice_1/default.frag?raw';
    import edit_icon from '$lib/assets/icons/edit.svg';
    // import { min } from 'three/tsl';
    import { goto } from '$app/navigation';
    // const frag_shader = "uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time;  void main() {vec2 st = gl_FragCoord.xy/u_resolution.xy;st.x *= u_resolution.x/u_resolution.y;vec3 color = vec3(0.);color = vec3(st.x,st.y,abs(sin(u_time)));gl_FragColor = vec4(color,1.0); }";
    interface Uniforms {
        [uniform: string]: THREE.IUniform<any>;
        u_time: { value: number };
        u_resolution: { value: THREE.Vector2 };
        u_mouse: { value: THREE.Vector2 };
    }
    // console.log(typeof(frag_shader.replace));
    // console.log(typeof(default_fragment_shader.replace));
    let {vertex_shader=default_vert_shader, fragment_shader=default_frag_shader, mode='default', size=250, show_code_block=true, background_color='transparent'} = $props();

    var canvas: HTMLCanvasElement;
    var code_block: HTMLDivElement;
    var edit_button: HTMLButtonElement;
    var camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, clock: THREE.Clock;
    var uniforms: Uniforms;

    let display_code_block = $state(false);
    let display_edit_button = $state(false);
    let fps = $state(0);

    const code_block_division_percentage = 0.5;

    const pointer_offset = 56;

    const background_mode_shrink_by = 2;

    // function shrink(value: number, shrink_by: number) {
    //     return Math.floor(value/shrink_by);
    // }

    // function shrink_bg(value: number) {
    //     return shrink(value, background_mode_shrink_by);
    // }

    onMount(() => {
        init();
        animate();

        function init() {
            // block = document.getElementById('block') as HTMLElement;

            camera = new THREE.Camera();
            camera.position.z = 1;

            scene = new THREE.Scene();
            clock = new THREE.Clock();

            var geometry = new THREE.PlaneGeometry(2, 2);

            uniforms = {
                u_time: {value: 1.0 },
                u_resolution: {value: new THREE.Vector2() },
                u_mouse: {value: new THREE.Vector2() }
            };

            var material = new THREE.ShaderMaterial( {
                uniforms: uniforms,
                vertexShader: vertex_shader,
                fragmentShader: fragment_shader
            } );

            var mesh = new THREE.Mesh( geometry, material );
            scene.add( mesh );

            renderer = new THREE.WebGLRenderer({antialias: true, canvas});
            if(mode == 'background') {
                renderer.setPixelRatio(window.devicePixelRatio/background_mode_shrink_by);
            }
            else renderer.setPixelRatio(window.devicePixelRatio);
            
            onWindowResize(null);
            window.addEventListener( 'resize', onWindowResize, false );

        }

        function onWindowResize(event: UIEvent | null) {
            if(canvas==null) return;
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
            uniforms.u_resolution.value.x = renderer.domElement.width;
            uniforms.u_resolution.value.y = renderer.domElement.height;

            // console.log('clientWidth, clientHeight', canvas.clientWidth, canvas.clientHeight);
            // console.log('width, height', renderer.domElement.width, renderer.domElement.height);
        }

        function animate() {
            requestAnimationFrame(animate);
            render();
        }

        function render() {
            const deltaTime = clock.getDelta();;
            uniforms.u_time.value += deltaTime;
            fps = 1/deltaTime;
            renderer.render(scene, camera); 
        }

        // const buttonRect = edit_button.getBoundingClientRect();
        // const buttonWidth = buttonRect.right - buttonRect.left;
        // window.addEventListener("resize", ()=> {
            // console.log(window.innerWidth, window.innerHeight);
        // });

        canvas.onpointermove = async event => {
            const canvasRect = canvas.getBoundingClientRect();
            const canvasHeight = canvasRect.bottom - canvasRect.top;

            // console.log(canvas);
            // console.log(buttonRect.right, buttonRect.left);
            
            // if(canvas==null) return;
            uniforms.u_mouse.value.x = window.devicePixelRatio*(event.clientX-canvasRect.left);
            uniforms.u_mouse.value.y = window.devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
            // console.log(event.clientX-rect.left, event.clientY-rect.top);
            
            if(show_code_block) {
                display_code_block = true;
                if(mode == 'default') display_edit_button = true;
                // await tick();
                const { clientX, clientY } = event;

                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                // console.log(windowWidth, windowHeight);
                // console.log((canvasRect.left+canvasRect.right)*0.5, windowWidth*code_block_division_percentage);
                // const canvasRect = canvas.getBoundingClientRect();

                const codeBlockWidth = code_block.offsetWidth;
                const codeBlockHeight = code_block.offsetHeight;
                // console.log(clientX+pointer_offset, clientY+pointer_offset);
                // console.log(windowWidth-codeBlockWidth, windowHeight-codeBlockHeight);
                // console.log(Math.min(clientX+pointer_offset, windowWidth-codeBlockWidth), Math.min(clientY+pointer_offset, windowHeight-codeBlockHeight));
                if((canvasRect.left+canvasRect.right)*0.5 <= windowWidth*code_block_division_percentage) {
                    // console.log('right');
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
                    // console.log('left', codeBlockWidth, `${clientX-codeBlockWidth-pointer_offset}px`);
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

                // const windowWidth = window.innerWidth;
                // const codeBlockWidth = code_block.offsetWidth;

                if(editButtonRect.left<=clientX && clientX<=editButtonRect.right && clientY > canvasRect.top) {
                    display_edit_button = true;
                    // console.log('display_edit_button = true;');
                }
                else {
                    display_edit_button = false;
                    // console.log('display_edit_button = false;');

                }
            }
            // console.log('canvas.onpointerleave');
            // console.log('onpointerleave', display_code_block);
        };

        // const rect = canvas.getBoundingClientRect();

        edit_button.onpointerenter = async event => {
            // console.log('edit_button.onpointerenter');
            if(mode == 'default') display_edit_button = true;
        };

        edit_button.onpointerleave = async event => {
            // console.log('edit_button.onpointerenter');
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
        width: auto;
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