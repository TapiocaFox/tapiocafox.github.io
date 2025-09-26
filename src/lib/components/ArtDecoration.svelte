<script>
	let {src} = $props();
</script>
<style>
	img.decoration {
		position: fixed;
		right: 8px;
		bottom: 8px;
		max-height: 35vh;
		max-width: 25vw;
		aspect-ratio: 1;
		/* opacity: 90%; */
		z-index: calc(-1 * var(--large-z-index));
	}
	@media (max-width: 768px) {
		img.decoration {
			display: none;
		}
	}
</style>

<img alt="Decoration" class="decoration" src={src}/>