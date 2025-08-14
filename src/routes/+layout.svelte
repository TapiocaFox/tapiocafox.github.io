<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="icon" href="" />
</svelte:head>

<nav id="main-nav">
	<a href="/">TapiocaFox</a>
	<!-- <a href="https://github.com/TapiocaFox/Daijishou">Daijishō</a> -->
	<a href="/components">[Components]</a>
	<a href="/glsl">[GLSL]</a>
	<a href="/projects">[Projects]</a>
	<a href="/artworks">[Artworks]</a>
	<a href="https://github.com/TapiocaFox">[GitHub]</a>
</nav>

{@render children?.()}
