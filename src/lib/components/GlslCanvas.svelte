<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import default_vert_shader from '$lib/assets/glsl_shaders/default.vert?raw';
    import default_frag_shader from '$lib/assets/glsl_shaders/default.frag?raw';
    import { min } from 'three/tsl';
    // const frag_shader = "uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time;  void main() {vec2 st = gl_FragCoord.xy/u_resolution.xy;st.x *= u_resolution.x/u_resolution.y;vec3 color = vec3(0.);color = vec3(st.x,st.y,abs(sin(u_time)));gl_FragColor = vec4(color,1.0); }";
    interface Uniforms {
        [uniform: string]: THREE.IUniform<any>;
        u_time: { value: number };
        u_resolution: { value: THREE.Vector2 };
        u_mouse: { value: THREE.Vector2 };
    }
    // console.log(typeof(frag_shader.replace));
    // console.log(typeof(default_fragment_shader.replace));
    let {vertex_shader=default_vert_shader, fragment_shader=default_frag_shader, preview=false, size=250, show_code_block=true, background_color='black'} = $props();

    var canvas: HTMLCanvasElement;
    var code_block: HTMLDivElement;
    var camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, clock: THREE.Clock;
    var uniforms: Uniforms;

    let display_code_block = $state(false);

    const code_block_division_percentage = 0.5;

    const pointer_offset = 24;

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
            renderer.setPixelRatio(window.devicePixelRatio);
            
            onWindowResize(null);
            window.addEventListener( 'resize', onWindowResize, false );

        }

        function onWindowResize(event: UIEvent | null) {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
            uniforms.u_resolution.value.x = renderer.domElement.width;
            uniforms.u_resolution.value.y = renderer.domElement.height;
        }

        function animate() {
            requestAnimationFrame( animate );
            render();
        }

        function render() {
            uniforms.u_time.value += clock.getDelta();
            renderer.render( scene, camera ); 
        }
        
        canvas.onpointermove = async event => {
            // console.log(canvas);
            if(canvas==null) return;
            const rect = canvas.getBoundingClientRect();
            const height = rect.bottom - rect.top;
            uniforms.u_mouse.value.x = window.devicePixelRatio*(event.clientX-rect.left);
            uniforms.u_mouse.value.y = window.devicePixelRatio*(height-(event.clientY-rect.top));
            // console.log(event.clientX-rect.left, event.clientY-rect.top);
            
            if(show_code_block) {
                display_code_block = true;
                // await tick();
                const { clientX, clientY } = event;

                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                const canvasRect = canvas.getBoundingClientRect();

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
                }
                else {
                    // console.log('left', codeBlockWidth, `${clientX-codeBlockWidth-pointer_offset}px`);
                    code_block.animate({
                        right:`${Math.max(windowWidth-clientX+pointer_offset, 0)}px`,
                        top: `${Math.min(clientY+pointer_offset, windowHeight-codeBlockHeight)}px`
                    }, {fill: "forwards"});
                }
            }
        };

        canvas.onpointerleave = async event => {
            display_code_block = false;
            // console.log('onpointerleave', display_code_block);
        };
    });


    
</script>
<style>
    canvas.glsl {
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
        max-width: 250px;
        max-height: 250px;
        margin: auto;
        /* padding: 0; */
        border: 1px dotted var(--fox-background-color);
        background-color: black;
        color: white;
        cursor: crosshair;
    }
    canvas.glsl.preview {
        max-height: calc(var(--compact-width) * 0.25);
        width: auto;
        margin-right: 8px;
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

</style>
<canvas bind:this={canvas} 
style:max-width = {preview?'calc(var(--compact-width) * 0.25)':`${size}px`}
style:max-height = {preview?'auto':`${size}px`}
style:background-color = {background_color}
class="glsl {preview?'preview':''}"></canvas>
<!-- <div class="code-block {display_code_block ? 'visible' : ''}"  -->
<div class="code-block {display_code_block ? 'visible' : ''}" 
    bind:this={code_block}>
    <h4>Vertex shader</h4>
    <pre>{vertex_shader}</pre>
    <h4>Fragment shader</h4>
    <pre>{fragment_shader}</pre>
    <!-- <p>{display_code_block}</p> -->
</div>