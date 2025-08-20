<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	let { children } = $props();
</script>

<BackButton/>
{@render children?.()}