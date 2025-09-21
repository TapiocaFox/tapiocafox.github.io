<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';

    import TapiocaFoxWebGL from '$lib/components/TapiocaFoxWebGL.svelte';
	
	import default_vert from '$lib/assets/webgl/practice_1/default.vert?raw';
    import fiber_bg from '$lib/assets/webgl/practice_1/fiber_bg.frag?raw';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="var(--fox-background-color)">
	<title>TapiocaFox</title>
</svelte:head>

<style>
  	@import 'main.css';
</style>

<TapiocaFoxWebGL mode='background' show_code_block={false} vertex_shader={default_vert} fragment_shader={fiber_bg}/>

<nav id="main-nav">
	<a href="/">&gt; <span style:font-weight="bold" style:color="var(--fox-secondary-color)">Tapioca</span><span style:font-weight="bold" style:color="var(--fox-primary-color)">Fox</span></a>
	<!-- <a href="https://github.com/TapiocaFox/Daijishou">Daijishō</a> -->
	<!-- <a href="/components">[Components]</a> -->
	<a href="/projects">[Projects]</a>
	<a href="/artworks">[Artworks]</a>
	<a href="/webgl_editor">[WebGL]</a>
	<a href="/patio">[Patio]</a>
	<!-- <a href="https://github.com/TapiocaFox">[GitHub]</a> -->
	<!-- <button class="no-style" onclick={()=>{}}>[☾]</button> -->

</nav>

{@render children?.()}


