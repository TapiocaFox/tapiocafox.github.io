<script>
	import two_blocks_fox from '$lib/assets/comics/two_blocks_fox.png';
    import profile from '$lib/assets/profile.png';
    import EndingDecoration from '$lib/components/EndingDecoration.svelte';
    import ArtDecoration from '$lib/components/ArtDecoration.svelte';
</script>
<style>
    img.two_block {
        display: block;
        width: 100%;
        max-width: 660px;
    }

    div.profile_row {
        display: flex;
        gap: 12px;
    }

    div.profile_row > div.profile {
        display: flex;
        justify-content: center;
        align-items: center;
        width: auto;
    }
    
    div.profile_row > div.description {
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: column;
        /* flex-wrap: nowrap; */
        flex-grow: 1;
    }
</style>
<div class="align-with-nav">
    <h1>TapiocaFox 🦊</h1>
    <div class="profile_row">
        <div class="profile">
            <img src={profile} 
            alt="Profile"
            style:width="125px"
            style:height="125px"/>
        </div>
        <div class="description">
            <div>
                <h3>Yves Chen</h3>
                <p>
                    GitHub: <a href="https://github.com/TapiocaFox" target="_blank">TapiocaFox</a><br>
                    Email: <a href="mailto:contact@tapiocafox.com?subject=Email%20From%20tapiocafox.com">contact@tapiocafox.com</a><br>
                    Resume: click me<br>
                </p>
                <p class="annotation">*I am the one on the left.</p>
            </div>
        </div>
    </div>
    <hr class="dashed">
    <p style:max-width="660px" >Hi. This is the website of me sharing personal projects and demos. Including digital artworks, previous projects that I've done, and some ongoing experimental works.</p>
    <!-- <h3>The music I like recently</h3> -->
     
    <iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="150" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/2000-mixed/1829001427?i=1829001428"></iframe>
    <p class="annotation">The music I vibe with recently.</p>
    <EndingDecoration/>
</div>
<ArtDecoration/>
