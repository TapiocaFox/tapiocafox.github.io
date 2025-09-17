<script lang="ts">
    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
	import two_blocks_cosmos from '$lib/assets/comics/two_blocks_cosmos.png';
	import two_blocks_fox from '$lib/assets/comics/two_blocks_fox.png';
</script>
<style>
    img.two_block {
        display: block;
        width: 100%;
        max-width: var(--compact-width);
    }
</style>
<HeaderWithBackButton text="Comics: Two blocks"/>
<p class="bold-annotation">Surrealism is what I am looking for. And I want to focus on the transitions and motions.</p>
<img class="two_block" alt="Cosmos" src={two_blocks_cosmos}/>
<hr class="dashed"/>
<img class="two_block" alt="Fox" src={two_blocks_fox}/>
<hr class="dashed"/>