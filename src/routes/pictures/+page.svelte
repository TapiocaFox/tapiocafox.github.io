<script lang="ts">
    import HeaderWithBackButton from "$lib/components/HeaderWithBackButton.svelte";

    import scooter from '$lib/assets/photos/scooter.jpg';
    import pma from '$lib/assets/photos/pma.jpg';
    import dc from '$lib/assets/photos/dc.jpg';
    import train from '$lib/assets/photos/train.jpg';
    import cat_checker from '$lib/assets/photos/cat_checker.jpg';
    import bowling from '$lib/assets/photos/bowling.jpg';
    import central_park from '$lib/assets/photos/central_park.jpg';
    import east_river from '$lib/assets/photos/east_river.jpg';
    import brooklyn from '$lib/assets/photos/brooklyn.jpg';
    import gecko from '$lib/assets/photos/gecko.jpg';
    import turtle_bay from '$lib/assets/photos/turtle_bay.jpg';
    import lindsay from '$lib/assets/photos/lindsay.jpg';
    import in_n_out from '$lib/assets/photos/in_n_out.jpg';
    import in_n_out_menu from '$lib/assets/photos/in_n_out_menu.jpg';
    import newport from '$lib/assets/photos/newport.jpg';
    import sd_zoo from '$lib/assets/photos/sd_zoo.jpg';
    import tahoe from '$lib/assets/photos/tahoe.jpg';
    import tainan from '$lib/assets/photos/tainan.jpg';
    import tainan_2 from '$lib/assets/photos/tainan_2.jpg';
    import tainan_3 from '$lib/assets/photos/tainan_3.jpg';
    import lennon_wall from '$lib/assets/photos/lennon_wall.jpg';
    import thsr from '$lib/assets/photos/thsr.jpg';
    import stuyvesant from '$lib/assets/photos/stuyvesant.jpg';
    import toufen from '$lib/assets/photos/toufen.jpg';
    import ubike from '$lib/assets/photos/ubike.jpg';
    import cat_matsu from '$lib/assets/photos/cat_matsu.jpg';
    import boat_matsu from '$lib/assets/photos/boat_matsu.jpg';
    import shirogane from '$lib/assets/photos/shirogane.jpg';
    import brit_museum from '$lib/assets/photos/brit_museum.jpg';
    import noboribetsu from '$lib/assets/photos/noboribetsu.jpg';
    import temple from '$lib/assets/photos/temple.jpg';
    import texture from '$lib/assets/photos/texture.jpg';
    import neiwan from '$lib/assets/photos/neiwan.jpg';
    import ar_15_prop from '$lib/assets/photos/ar_15_prop.jpg';
    import nycu from '$lib/assets/photos/nycu.jpg';
    // import esp32 from '$lib/assets/photos/esp32.jpg';
    // import zhubei from '$lib/assets/photos/zhubei.jpg';

    function shuffle(array: Array<any>) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    }

    const photos = $state([pma, scooter, dc, train, cat_checker, bowling, central_park, east_river, brooklyn, gecko, turtle_bay, lindsay, in_n_out, in_n_out_menu, newport, sd_zoo, tahoe, tainan, tainan_2, tainan_3, lennon_wall, thsr, stuyvesant, toufen, ubike, cat_matsu, boat_matsu, shirogane, brit_museum, noboribetsu, temple, texture, neiwan, ar_15_prop, nycu]);
</script>
<HeaderWithBackButton text="Pictures"/>
<p class="bold-annotation">The selection of the pictures I took. <button class="text" onclick={()=>{shuffle(photos);}}>Randomize</button>.</p>
<div class="flex_grid gallery center">
    {#each photos as photo}
        <div class="item gallery_item">
            <img class="center-crop" alt="Sqaure" style:width="100%" src={photo}/>
        </div>
    {/each}
</div>
<p class="annotation">*AR-15 here is just a prop for the <a href="https://www.dazadgame.com" target="_blank">shooter game</a> developed by my friend <a href="https://yenlinchen.com" target="_blank">Yen-Lin Chen</a>. Please don't report me to the police.</p>