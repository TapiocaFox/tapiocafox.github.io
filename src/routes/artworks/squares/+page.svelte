<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
    import amc_2018 from '$lib/assets/squares/amc_2018.png';
    let square_list = [amc_2018];
</script>
<BackButton/>
<h1>Squares</h1>
<p>Blocky things align in grid are captivating.</p>
<div class="flex_grid" 
    style:width="100%"
    style:margin="8px 0">
    {#each { length: 20 }, num}
        <div class="item" style:width="200px" style:height="200px"><p>{num+1}</p></div>
    {/each}
</div>