<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';

    import GlslCanvas from '$lib/components/GlslCanvas.svelte';
    import fiber_bg from '$lib/assets/glsl_shaders/fiber_bg.frag?raw';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="" />
	<title>tapiocafox.com</title>
</svelte:head>

<style>
  	@import 'main.css';
</style>

<GlslCanvas mode='background' show_code_block={false} fragment_shader={fiber_bg}/>

<nav id="main-nav">
	<a href="/">&gt; <span style:font-weight="bold" style:color="var(--fox-secondary-color)">Tapioca</span><span style:font-weight="bold" style:color="var(--fox-primary-color)">Fox</span></a>
	<!-- <a href="https://github.com/TapiocaFox/Daijishou">Daijishō</a> -->
	<!-- <a href="/components">[Components]</a> -->
	<a href="/projects">[Projects]</a>
	<a href="/artworks">[Artworks]</a>
	<a href="/garage">[Garage]</a>
	<!-- <a href="/glsl">[GLSL]</a> -->
	<!-- <a href="https://github.com/TapiocaFox">[GitHub]</a> -->
	<!-- <button class="no-style" onclick={()=>{}}>[☾]</button> -->

</nav>

{@render children?.()}


