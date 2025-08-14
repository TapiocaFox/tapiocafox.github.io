<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<div class="align-with-nav">
{@render children?.()}
</div>