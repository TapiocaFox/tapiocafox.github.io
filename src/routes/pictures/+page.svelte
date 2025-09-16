<script lang="ts">
    import HeaderWithBackButton from "$lib/components/HeaderWithBackButton.svelte";

    import scooter from '$lib/assets/photos/scooter.jpeg';
    import pma from '$lib/assets/photos/pma.jpeg';
    import dc from '$lib/assets/photos/dc.jpeg';
    import train from '$lib/assets/photos/train.jpeg';
    import cat_checker from '$lib/assets/photos/cat_checker.jpeg';
    import bowling from '$lib/assets/photos/bowling.jpeg';
    import central_park from '$lib/assets/photos/central_park.jpeg';
    import east_river from '$lib/assets/photos/east_river.jpeg';
    import brooklyn from '$lib/assets/photos/brooklyn.jpeg';
    import gecko from '$lib/assets/photos/gecko.jpeg';
    import turtle_bay from '$lib/assets/photos/turtle_bay.jpeg';
    import lindsay from '$lib/assets/photos/lindsay.jpeg';
    import in_n_out from '$lib/assets/photos/in_n_out.jpeg';
    import newport from '$lib/assets/photos/newport.jpeg';
    import sd_zoo from '$lib/assets/photos/sd_zoo.jpeg';
    import tahoe from '$lib/assets/photos/tahoe.jpeg';
    import tainan from '$lib/assets/photos/tainan.jpeg';
    import tainan_2 from '$lib/assets/photos/tainan_2.jpeg';
    import tainan_3 from '$lib/assets/photos/tainan_3.jpeg';
    import lennon_wall from '$lib/assets/photos/lennon_wall.jpeg';
    import thsr from '$lib/assets/photos/thsr.jpeg';
    import stuyvesant from '$lib/assets/photos/stuyvesant.jpeg';
    import toufen from '$lib/assets/photos/toufen.jpeg';
    import ubike from '$lib/assets/photos/ubike.jpeg';
    import cat_matsu from '$lib/assets/photos/cat_matsu.jpeg';
    import boat_matsu from '$lib/assets/photos/boat_matsu.jpeg';
    import shirogane from '$lib/assets/photos/shirogane.jpeg';
    import brit_museum from '$lib/assets/photos/brit_museum.jpeg';
    import noboribetsu from '$lib/assets/photos/noboribetsu.jpeg';
    import temple from '$lib/assets/photos/temple.jpeg';
    import texture from '$lib/assets/photos/texture.jpeg';
    import neiwan from '$lib/assets/photos/neiwan.jpeg';
    import nycu from '$lib/assets/photos/nycu.jpeg';
    // import esp32 from '$lib/assets/photos/esp32.jpeg';
    // import zhubei from '$lib/assets/photos/zhubei.jpeg';

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

    const photos = $state([pma, scooter, dc, train, cat_checker, bowling, central_park, east_river, brooklyn, gecko, turtle_bay, lindsay, in_n_out, newport, sd_zoo, tahoe, tainan, tainan_2, tainan_3, lennon_wall, thsr, stuyvesant, toufen, ubike, cat_matsu, boat_matsu, shirogane, brit_museum, noboribetsu, temple, texture, neiwan, nycu]);
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