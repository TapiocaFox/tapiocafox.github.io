<script lang="ts">
    import { onMount, tick } from 'svelte';
    import * as THREE from 'three';
    import default_vert_shader from '$lib/assets/glsl_shaders/default.vert?raw';
    import default_frag_shader from '$lib/assets/glsl_shaders/default.frag?raw';
    // const frag_shader = "uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time;  void main() {vec2 st = gl_FragCoord.xy/u_resolution.xy;st.x *= u_resolution.x/u_resolution.y;vec3 color = vec3(0.);color = vec3(st.x,st.y,abs(sin(u_time)));gl_FragColor = vec4(color,1.0); }";
    interface Uniforms {
        [uniform: string]: THREE.IUniform<any>;
        u_time: { value: number };
        u_resolution: { value: THREE.Vector2 };
        u_mouse: { value: THREE.Vector2 };
    }
    // console.log(typeof(frag_shader.replace));
    // console.log(typeof(default_fragment_shader.replace));
    let {vertex_shader=default_vert_shader, fragment_shader=default_frag_shader, size=250} = $props();

    var canvas: HTMLCanvasElement;
    var code_block: HTMLDivElement;
    var camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, clock: THREE.Clock;
    var uniforms: Uniforms;

    let display_code_block = $state(false);

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

            document.onmousemove = function(e){
                uniforms.u_mouse.value.x = e.pageX
                uniforms.u_mouse.value.y = e.pageY
            }
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
            display_code_block = true;
            // await tick();
            const { clientX, clientY } = event;
            code_block.animate({
                left: `${clientX+16}px`,
                top: `${clientY+16}px`
            }, {fill: "forwards"});
            // console.log(clientX, clientY);
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
        background-color: white;
        color: white;
    }
    div.code-block {
        display: none;
        position: fixed;
        min-width: 100px;
        /* min-height: 100px; */
        border: 1px solid var(--fox-background-color);
        background-color: white;
        padding: 1em;
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
</style>
<canvas bind:this={canvas} 
style:max-width = {`${size}px`}
style:max-height = {`${size}px`}
class="glsl"></canvas>
<div class="code-block {display_code_block ? 'visible' : ''}" 
    bind:this={code_block}>
    <h4>Vertex shader</h4>
    <pre>{vertex_shader}</pre>
    <h4>Fragment shader</h4>
    <pre>{fragment_shader}</pre>
    <!-- <p>{display_code_block}</p> -->
</div>