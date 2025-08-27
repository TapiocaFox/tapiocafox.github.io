<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';

    interface Uniforms {
        [uniform: string]: THREE.IUniform<any>;
        u_time: { value: number };
        u_resolution: { value: THREE.Vector2 };
        u_mouse: { value: THREE.Vector2 };
    }

    let {vertex_shader = "void main() {gl_Position = vec4( position, 1.0 );}", fragment_shader="uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time;  void main() {vec2 st = gl_FragCoord.xy/u_resolution.xy;st.x *= u_resolution.x/u_resolution.y;vec3 color = vec3(0.);color = vec3(st.x,st.y,abs(sin(u_time)));gl_FragColor = vec4(color,1.0); }"} = $props();

    var canvas: HTMLCanvasElement;
    var camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, clock: THREE.Clock;
    var uniforms: Uniforms;

    onMount(() => {
        init();
        animate();

        function init() {
            // container = document.getElementById('container') as HTMLElement;

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
    });

    
</script>
<style>
    canvas.glsl {
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
        max-width: 256px;
        max-height: 256px;
        margin: auto;
        /* padding: 0; */
        border: 1px dotted var(--fox-background-color);
        background-color: white;
    }
</style>
<canvas bind:this={canvas} class="glsl"></canvas>