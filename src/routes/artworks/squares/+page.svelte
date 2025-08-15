<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
    import amc_2018 from '$lib/assets/squares/amc_2018.png';
    import amc_2020 from '$lib/assets/squares/amc_2020.png';
    import spooky from '$lib/assets/squares/spooky.png';
    import dukk from '$lib/assets/squares/dukk.png';
    import nooxy_art from '$lib/assets/squares/nooxy_art.png';
    import faucet from '$lib/assets/squares/faucet.png';
    import lunar_new_year from '$lib/assets/squares/lunar_new_year.png';
    import tna from '$lib/assets/squares/tna.png';
    import chihuahua from '$lib/assets/squares/chihuahua.png';
    import crow from '$lib/assets/squares/crow.png';
    import old_man from '$lib/assets/squares/old_man.png';
    import shell_with_eye from '$lib/assets/squares/shell_with_eye.png';
    import eye_with_uuid from '$lib/assets/squares/eye_with_uuid.png';
    import brain from '$lib/assets/squares/brain.jpg';
    import games from '$lib/assets/squares/games.png';
    import rag from '$lib/assets/squares/rag.jpg';
    import demon from '$lib/assets/squares/demon.jpg';
    import nsf from '$lib/assets/squares/nsf.png';
    import wasp from '$lib/assets/squares/wasp.jpg';
    // import mosquito from '$lib/assets/squares/mosquito.jpg';
    // import indigenous from '$lib/assets/squares/indigenous.jpg';
    import mushroom from '$lib/assets/squares/mushroom.png';
    import chill_cat from '$lib/assets/squares/chill_cat.jpg';
    import nooxy from '$lib/assets/squares/nooxy.jpg';
    import spiral_1 from '$lib/assets/squares/spiral_1.png';
    import spiral_2 from '$lib/assets/squares/spiral_2.png';
    import magic_mountain from '$lib/assets/squares/magic_mountain.png';
    import mini_disc from '$lib/assets/squares/mini_disc.png';
    import nala_cat from '$lib/assets/squares/nala_cat.png';
    import ping_pong from '$lib/assets/squares/ping_pong.png';
    import mosquito_zoomed from '$lib/assets/squares/mosquito_zoomed.jpg';
    import border_collie from '$lib/assets/squares/border_collie.jpg';
    
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

    let squares = $state([amc_2018, amc_2020, dukk, faucet, spooky, lunar_new_year, tna, chihuahua, old_man, shell_with_eye, crow, eye_with_uuid, brain, games, demon, nsf, wasp, mushroom, chill_cat, nooxy, spiral_1, spiral_2, magic_mountain, mini_disc, nala_cat, ping_pong, mosquito_zoomed, border_collie]);
    shuffle(squares);
</script>
<style>
    .sqaure_item {
        width: 250px;
        height: 250px;
        transition: transform .1s
    }
    .sqaure_item:hover {
        transform: scale(1.25);
        z-index: 99;
    }
    @media (max-width: 768px) {
        .sqaure_item {
            width: 150px;
            height: 150px;
        }
    }
</style>
<BackButton/>
<h1>Squares</h1>
<p>Blocky things align with grid are captivating. <a href="#" onclick={()=>{shuffle(squares);}}>Randomize</a>.</p>
<div class="flex_grid" 
    style:align-items="center"
    style:justify-content="center"
    style:width="100%"
    style:gap="12px"
    style:margin="8px 0">
    {#each squares as square}
        <div class="item sqaure_item">
            <img style:width="100%" src={square}/>
        </div>
    {/each}
</div>