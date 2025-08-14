<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import BackButton from '$lib/components/BackButton.svelte';
	let { children } = $props();
</script>

<BackButton/>
{@render children?.()}