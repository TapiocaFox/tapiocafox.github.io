<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="" />
</svelte:head>

<style>
  	@import 'main.css';
  	#main-nav {
		/* background-color: rgb(72, 72, 72); */
		background-color: dimgrey;
		color: white;
		padding: 4px 12px 4px 12px;
		font-family: 'Courier New', Courier, monospace;
	}
	
	#main-nav > a {
		color: white;
		text-decoration: none;
		margin: 0 0px;
	}
</style>

<nav id="main-nav">
	<a href="/"><span style:font-weight="bold">Tapioca</span><span style:font-weight="bold" style:color="darkorange">Fox</span></a>
	<!-- <a href="https://github.com/TapiocaFox/Daijishou">Daijishō</a> -->
	<!-- <a href="/components">[Components]</a> -->
	<a href="/projects">[Projects]</a>
	<a href="/artworks">[Artworks]</a>
	<a href="/glsl">[GLSL]</a>
	<!-- <a href="https://github.com/TapiocaFox">[GitHub]</a> -->
</nav>

{@render children?.()}
