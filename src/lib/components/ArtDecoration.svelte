<script>
    import decoration from '$lib/assets/squares/cacba.png';
</script>
<style>
	img.decoration {
		position: fixed;
		right: 0;
		bottom: 0;
		max-height: 40vh;
		max-width: 30vw;
		aspect-ratio: 1;
		opacity: 80%;
		z-index: -99;
	}
	@media (max-width: 768px) {
		img.decoration {
			display: none;
		}
	}
</style>

<img class="decoration" src={decoration}/>