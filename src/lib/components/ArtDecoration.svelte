<script>
    import decoration from '$lib/assets/squares/cacba.png';
</script>
<style>
	img.decoration {
		position: fixed;
		right: 0;
		bottom: 0;
		max-height: 40vh;
		max-width: 40vw;
		aspect-ratio: 1;
		opacity: 80%;
		z-index: -99;
	}
</style>

<img class="decoration" src={decoration}/>