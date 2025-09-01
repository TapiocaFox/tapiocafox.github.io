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
  	#main-nav {
		background-color: var(--fox-background-color);
		/* background-color: black; */
		color: white;
		padding: 4px 1em 4px 0px;
		font-family: 'Courier New', Courier, monospace;
		white-space: nowrap;
		overflow-x: auto;
		white-space: nowrap;
        scrollbar-width: none;
        -ms-overflow-style: none;
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


