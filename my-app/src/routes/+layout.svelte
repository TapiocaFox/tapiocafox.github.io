<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<style>
	#main-nav {
		background-color: black;
		color: white;
		padding: 4px 8px;
		font-family: 'Courier New', Courier, monospace;
	}
	
	#main-nav > a {
		color: white;
		text-decoration: none;
		margin: 0 0px;
	}
</style>

<nav id="main-nav">
	<a href="/">TapiocaFox</a>
	<!-- <a href="https://github.com/TapiocaFox/Daijishou">Daijishō</a> -->
	<a href="/css">[Site CSS]</a>
	<a href="/glsl">[GLSL]</a>
	<a href="/artworks">[Artworks]</a>
	<a href="https://github.com/TapiocaFox">[GitHub]</a>
</nav>

{@render children?.()}
