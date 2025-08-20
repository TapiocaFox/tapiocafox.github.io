<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';
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
		padding: 4px 1em 4px 0px;
		font-family: 'Courier New', Courier, monospace;
		white-space: nowrap;
		overflow-x: auto;
	}

	#main-nav::-webkit-scrollbar {
		background: transparent; /* Chrome/Safari/Webkit */
		width: 0px;
	}
	
	#main-nav > a {
		color: white;
		text-decoration: none;
		margin: 0 0px;
		border-bottom-style: none;
        border-bottom-width: 0;
	}
</style>

<nav id="main-nav">
	<a href="/">&gt; <span style:font-weight="bold">Tapioca</span><span style:font-weight="bold" style:color="darkorange">Fox</span></a>
	<!-- <a href="https://github.com/TapiocaFox/Daijishou">Daijishō</a> -->
	<!-- <a href="/components">[Components]</a> -->
	<a href="/projects">[Projects]</a>
	<a href="/artworks">[Artworks]</a>
	<!-- <a href="/glsl">[GLSL]</a> -->
	<!-- <a href="https://github.com/TapiocaFox">[GitHub]</a> -->
</nav>

{@render children?.()}


