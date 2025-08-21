<script lang="ts">
	import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
	import skyline from '$lib/assets/sketchings/skyline.png';
	import indigenous from '$lib/assets/sketchings/indigenous.jpg';
	import garden_urn from '$lib/assets/sketchings/garden_urn.png';
	import trunk from '$lib/assets/sketchings/trunk.png';
	import osaka from '$lib/assets/sketchings/osaka.png';
	import ping_pong from '$lib/assets/sketchings/ping_pong.png';
	import border_collie from '$lib/assets/sketchings/border_collie.png';
	import canids from '$lib/assets/sketchings/canids.png';
	import fox_girl from '$lib/assets/sketchings/fox_girl.png';
	import vampire from '$lib/assets/sketchings/vampire.png';
	import demon_in_suit from '$lib/assets/sketchings/demon_in_suit.jpg';
	import birdies from '$lib/assets/sketchings/birdies.jpg';
	import miku from '$lib/assets/sketchings/miku.jpg';
	import miku_reference from '$lib/assets/sketchings/miku_reference.jpg';
	import airplane_1 from '$lib/assets/sketchings/airplane_1.jpg';
	import airplane_2 from '$lib/assets/sketchings/airplane_2.jpg';
    
</script>
<style>
    img.sketching {
        display: block;
        width: 100%;
        max-width: var(--compact-width);
        border: 1px dashed black;
    }
    img.sketching_in_row {
        display: inline-block;
        width: auto;
        max-width: 100%;
        max-height: 320px;
        margin-right: 0.5rem;
        border: 1px dashed black;
    }
</style>

<HeaderWithBackButton text="Sketchings"/>
<p>Mostly things in real life, or quirky ideas inside of my head.</p>
<img class="sketching" alt="Skyline" src={skyline}/>
<p class="annotation">A skyline view from Brooklyn promenade. It was very tedious to delineate every details of the buildings. So I only drew the parts that I think matters for the holism.</p>
<img class="sketching" alt="Indigenous" src={indigenous}/>
<p class="annotation">An imaginary person that appeared in my brain. It definitely follows a certain indigenous style, but I forgot where and what exactly I got inspired from.</p>
<img class="sketching_in_row" alt="Garden Urn" src={garden_urn}/><img class="sketching_in_row" alt="Trunk" src={trunk}/>
<p class="annotation">A garden urn in manhattan. It was a nice weather. The trunk is pretty barebone, but I like my line flow here.</p>
<img class="sketching" alt="Osaka" src={osaka}/>
<p class="annotation">An anime style girl from the "Azumanga" series. I like her nonchalant and goofy attitude.</p>
<img class="sketching" alt="Border Collie" src={border_collie}/>
<p class="annotation">I drew border collies, and plan to draw other species in canidae family. Because they share very similar features. I think the muzzles are the key here.</p>
<img class="sketching" alt="Canids" src={canids}/>
<p class="annotation">And practice always makes things better.</p>
<img class="sketching" alt="Fox girl" src={fox_girl}/>
<p class="annotation">I am not into furry. But one day I woke up with this idea.</p>
<img class="sketching" alt="The vampire" src={vampire}/>
<p class="annotation">It is techniquely not a sketch, but I don't know where to put it. I feel high while drawing this.</p>
<img class="sketching" alt="Demon in suit" src={demon_in_suit}/>
<p class="annotation">Try to draw something evil but also civilised.</p>
<img class="sketching" alt="Birdes" src={birdies}/>
<p class="annotation">Some cute birdies chatting :3.</p>
<img class="sketching" alt="Ping Pong" src={ping_pong}/>
<p class="annotation">I used to be the president of table tennis club. It was a huge part in my undergrad life. So it means something to me.</p>
<img class="sketching_in_row" alt="Miku" src={miku}/><img class="sketching_in_row" alt="Miku Reference" src={miku_reference}/>
<p class="annotation">Hatsune Miku. Got this sticker from Tokyo Japan. I like how it looks sharp and detailed.</p>
<img class="sketching_in_row" alt="Airplane 1" src={airplane_1}/><img class="sketching_in_row" alt="Airplane 2" src={airplane_2}/>
<p class="annotation">Fighter jets. I definitely know nothing about aero dynamic. But I like the precisional feeling of the fighter jet. I am amazed to think about the components of a jet require constant renewal and maintenance until it is no longer the same one. One exterme example is the F-16V model in Taiwan. Despite it's old inheriting design, and relatively long service period, the constant update of avionics make the F-16s still very competitive in the mordern combat. While keeping the cost efficiency reasonable. (Taiwanese defense budget is relatively small compare to its hostile neighbor. And the American worries about Taiwan leaking intel to China if possesses newer fighter models, due to low linguistic and cultural barrier in between.)</p>