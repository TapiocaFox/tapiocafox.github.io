<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
    <title>TapiocaFox | WebGL Editor</title> 
</svelte:head>

<div class="align-with-nav">
{@render children?.()}
</div>