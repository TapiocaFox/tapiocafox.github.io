<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
	let grid_item_num = $state('grid_item_num');
</script>

<div class="align-with-nav">
{@render children?.()}
</div>