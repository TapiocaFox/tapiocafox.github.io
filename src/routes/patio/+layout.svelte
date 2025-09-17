<script lang="ts">
	import EndingDecoration from '$lib/components/EndingDecoration.svelte';
	let { children } = $props();
</script>

<svelte:head>
    <title>TapiocaFox | Patio</title> 
</svelte:head>

<div class="align-with-nav">
{@render children?.()}
<!-- <p class="annotation">(*These media are not created or owned by me.)</p> -->
<EndingDecoration/>
</div>