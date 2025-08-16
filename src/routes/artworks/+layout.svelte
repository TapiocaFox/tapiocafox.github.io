<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
	import EndingDecoration from '$lib/components/EndingDecoration.svelte';
</script>

<div class="align-with-nav">
{@render children?.()}
<EndingDecoration/>
</div>