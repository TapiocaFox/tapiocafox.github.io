<script>
    import decoration from '$lib/assets/cacba_nobg.png';
</script>
<style>
	img.decoration {
		position: fixed;
		right: 0;
		bottom: 0;
		max-height: 40vh;
		max-width: 30vw;
		aspect-ratio: 1;
		/* opacity: 90%; */
		z-index: -99;
	}
	@media (max-width: 768px) {
		img.decoration {
			display: none;
		}
	}
</style>

<img alt="Decoration" class="decoration" src={decoration}/>