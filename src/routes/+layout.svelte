<script lang="ts">
	import { page } from '$app/stores';

	import favicon from '$lib/assets/favicon.ico';

    import TapiocaFoxWebGL from '$lib/components/TapiocaFoxWebGL.svelte';
	import tapiocafox from '$lib/assets/squares/tapiocafox.png';
	// import default_vert from '$lib/assets/webgl/practice_1/default.vert?raw';
    import fiber_bg_frag from '$lib/assets/webgl/misc/fiber_bg.frag?raw';

	let { children } = $props();

	let first_level_path = $derived($page.url.pathname.split('/')[1] || '');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="var(--fox-background-color)">
	<title>TapiocaFox</title>
	
	<!-- Basic Open Graph -->
	<meta property="og:title" content="TapiocaFox" />
	<meta property="og:description" content="Hi, I am TapiocaFox. This is the website of me sharing personal works and demos." />
	<meta property="og:image" content={ tapiocafox }/>
	<meta property="og:type" content="website" />
</svelte:head>

<style>
  	@import 'main.css';
</style>

<TapiocaFoxWebGL mode='background' show_status_block={false} fragment_shader={fiber_bg_frag}/>

<nav id="main-nav">
	<a href="/">&gt; <span style:font-weight="bold" style:color="var(--fox-secondary-color)">Tapioca</span><span style:font-weight="bold" style:color="var(--fox-primary-color)">Fox</span></a>
	<!-- <a href="https://github.com/TapiocaFox/Daijishou">Daijishō</a> -->
	<!-- <a href="/components">[Components]</a> -->
	<a style:color={first_level_path=='projects'?'var(--page-selected-color)':'unset'} href="/projects">[Projects]</a>
	<a style:color={first_level_path=='webgl_editor'?'var(--page-selected-color)':'unset'} href="/webgl_editor">[FoxGL]</a>
	<a style:color={first_level_path=='artworks'?'var(--page-selected-color)':'unset'} href="/artworks">[Artworks]</a>
	<a style:color={first_level_path=='patio'?'var(--page-selected-color)':'unset'} href="/patio">[Patio]</a>
	<!-- <a href="https://github.com/TapiocaFox">[GitHub]</a> -->
	<!-- <button class="no-style" onclick={()=>{}}>[☾]</button> -->

</nav>

{@render children?.()}


