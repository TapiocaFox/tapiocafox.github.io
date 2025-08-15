<script>
	import two_blocks_fox from '$lib/assets/comics/two_blocks_fox.png';
</script>
<style>
    img.two_block {
        display: block;
        width: 100%;
        max-width: 640px;
    }
</style>
<div class="align-with-nav">
    <h1>TapiocaFox 🦊</h1>
    <p>Hi. This is the website of me sharing personal projects and demos. Including digital artworks, previous projects that I've done, and some ongoing experimental works. (Still under construction and very barebone; Please visit my <a href="https://github.com/TapiocaFox">GitHub</a> instead.)</p>
    <p>
        GitHub: <a href="https://github.com/TapiocaFox">TapiocaFox</a><br>
        Email: contact@tapiocafox.com
    </p>

    <div class="grid" 
        style:display="inline-grid"
        style:margin="8px 0">
        {#each { length: 8 }, num}
            <div class="item" 
                style:background-color="black"
                style:width="12px"
                style:height="12px">
            </div>
        {/each}
    </div>
</div>

