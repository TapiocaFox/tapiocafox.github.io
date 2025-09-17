<script lang="ts">
	import EndingDecoration from '$lib/components/EndingDecoration.svelte';
	let { children } = $props();
</script>

<svelte:head>
    <title>TapiocaFox | Projects</title> 
</svelte:head>

<div class="align-with-nav">
{@render children?.()}
<EndingDecoration/>
</div>