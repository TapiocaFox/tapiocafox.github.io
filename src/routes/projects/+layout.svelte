<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import EndingDecoration from '$lib/components/EndingDecoration.svelte';
	let { children } = $props();
</script>

<div class="align-with-nav">
{@render children?.()}
<EndingDecoration/>
</div>