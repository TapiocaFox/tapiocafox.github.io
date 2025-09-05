<script>
	import two_blocks_fox from '$lib/assets/comics/two_blocks_fox.png';
    import profile from '$lib/assets/profile.png';
    import EndingDecoration from '$lib/components/EndingDecoration.svelte';
    import spiral_1 from '$lib/assets/squares/spiral_1.png';
    import spiral_2 from '$lib/assets/squares/spiral_2.png';
    import tapiocafox from '$lib/assets/squares/tapiocafox.png';

    import github_icon from '$lib/assets/icons/github.svg';
    import email_icon from '$lib/assets/icons/email.svg';
    import resume_icon from '$lib/assets/icons/resume.svg';
</script>
<style>
    .sqaure_item {
        display: block;
        width: 125px;
        height: 125px;
        margin-right: 4px;
    }
    img.inline_icon {
        display: inline-block;
        width: .85em;
        height: .85em;
    }
    @media (max-width: 768px) {
        .sqaure_item {
            width: 125px;
            height: 125px;
        }
    }
</style>
<div class="align-with-nav">
    <h1 style:margin-block-end="0.3em">TapiocaFox 🦊</h1>
    <div class="icon_description_layout">
        <div class="icon fade-in">
            <img src={profile}
            alt="Profile"
            style:border-radius="var(--sharper-radius)"
            style:margin="1rem 0"
            style:width="125px"
            style:height="125px"/>
        </div>
        <div class="description">
            <div>
                <h3 style:margin-block-end="0.0em">Yves Chen</h3>
                <p class="bold-annotation">
                    <img class="inline_icon" alt="GitHub" src={github_icon}/>
                    GitHub: <a href="https://github.com/TapiocaFox" target="_blank">TapiocaFox</a><br>
                    <img class="inline_icon" alt="Email" src={email_icon}/>
                    Email: <a href="mailto:contact@tapiocafox.com?subject=Email%20From%20tapiocafox.com">contact@tapiocafox.com</a><br>
                    <img class="inline_icon" alt="Email" src={resume_icon}/>
                    Resume: click me<br>
                </p>
                <p class="annotation" style:margin-block-start="0.0em">*I am the one on the left.</p>
            </div>
        </div>
    </div>
    <hr class="dashed fade-in load-delay">
    <p class="compact fade-in load-delay" >Hi. This is the website of me sharing personal works and demos. Including digital <a href="/artworks">artworks</a>, previous <a href="/projects">projects</a>, and also some ongoing ones.</p>
    <p class="compact fade-in load-delay" >I’m the creator of the retro game management software <a href="https://github.com/TapiocaFox/Daijishou" target="_blank">Daijishō</a> (~1M accumalated users). I built frameworks that can interact efficiently and easy to understand.</p>
    <!-- <h3>The music I like recently</h3> -->
    <!-- <iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="150" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/2000-mixed/1829001427?i=1829001428"></iframe> -->
    <!-- <p class="annotation">The music I vibe with recently.</p> -->
    <img alt="Spiral 1" class="sqaure_item fade-in load-delay" src={spiral_1} style:float="left"/>
    <img alt="Spiral 2" class="sqaure_item fade-in load-delay" src={spiral_2}/>
    <EndingDecoration/>
</div>
<!-- <ArtDecoration/> -->
