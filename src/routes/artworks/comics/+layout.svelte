<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<div class="align-with-nav">
<h1>Comics</h1>
<a href="#" onclick={()=>{window.history.back();}}>« back to list</a>
{@render children?.()}
</div>