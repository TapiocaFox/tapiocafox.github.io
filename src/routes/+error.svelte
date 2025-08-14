<script lang="ts">
	import { page } from '$app/state';
	import BackButton from '$lib/components/BackButton.svelte';
</script>

<div class="align-with-nav">
	<h1>🤖 Opps, something went wrong</h1>
	<p>{page.status}: {page.error?.message}. Learn more about the <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status" target="_blank">status code</a>.</p>
	<BackButton text="or go back"/>
</div>
