<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<style>
	#main-nav {
		background-color: grey;
		color: white;
		padding: 4px 8px;
		font-family: 'Courier New', Courier, monospace;
	}
	
	#main-nav > a {
		color: white;
		text-decoration: none;
		margin: 0 0px;
	}

	:global {
		.align-with-nav {
			padding: 0 8px;	
		}
		/* Dashed border */
		hr.dashed {
			border-top: 1px dashed black;
			border-bottom: 0px;
		}

		/* Dotted border */
		hr.dotted {
			border-top: 1px dotted black;
			border-bottom: 0px;
		}

		/* Solid border */
		hr.solid {
			border-top: 1px solid black;
			border-bottom: 0px;
		}

		a {
			color: inherit;
		}

		/* a:visited, a:hover, a:active {
			color: rgb(0, 0, 0);
		} */

		/* h1, h2, h3, h4, h5 {
			margin-block-start: 0.67em;
			margin-block-end: 0.67em;
		} */
	}
</style>

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
