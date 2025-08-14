<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="align-with-nav">
<h1>🤖 Opps, something went wrong</h1>
<p>{page.status}: {page.error?.message}</p>
<p>Learn more about the <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status" target="_blank">status code</a>. Or <a href="#" onclick={()=>{window.history.back();}}>go back</a>.</p>
</div>
