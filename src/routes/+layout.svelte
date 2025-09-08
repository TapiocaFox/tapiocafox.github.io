<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';
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

<nav id="main-nav">
	<a href="/">&gt; <span style:font-weight="bold" style:color="var(--fox-secondary-color)">Tapioca</span><span style:font-weight="bold" style:color="var(--fox-primary-color)">Fox</span></a>
	<!-- <a href="https://github.com/TapiocaFox/Daijishou">Daijishō</a> -->
	<!-- <a href="/components">[Components]</a> -->
	<a href="/projects">[Projects]</a>
	<a href="/artworks">[Artworks]</a>
	<a href="/media">[Media]</a>
	<!-- <a href="/glsl">[GLSL]</a> -->
	<!-- <a href="https://github.com/TapiocaFox">[GitHub]</a> -->
</nav>

{@render children?.()}


