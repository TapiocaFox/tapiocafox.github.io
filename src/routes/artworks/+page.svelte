<script lang="ts">
  import ChipsWithUrlState from '$lib/components/ChipsWithUrlState.svelte';
  import ArtDecoration from "$lib/components/ArtDecoration.svelte";
  import amc_2020 from '$lib/assets/squares/amc_2020.jpg';
  import mosquito_zoomed from '$lib/assets/squares/mosquito_zoomed.jpg';
  import crow from '$lib/assets/squares/crow.jpg';
  import hut from '$lib/assets/squares/hut.jpg';
  import snake from '$lib/assets/portraits/snake.png';
	import jyneda from '$lib/assets/portraits/jyneda.png';

	import two_blocks_cosmos from '$lib/assets/comics/two_blocks_cosmos.png';
	import border_collie from '$lib/assets/sketchings/border_collie.png';

	import phone_1 from '$lib/assets/design/phone_1.png';
	import daijishou_widget_ui from '$lib/assets/design/daijishou_widget_ui.png';

	import amc2018_cover from '$lib/assets/design/amc2018_cover.png';

  import decoration from '$lib/assets/cacba_nobg.png';

  import palette_icon from '$lib/assets/icons/palette.svg';
  import android_icon from '$lib/assets/icons/android.svg';
  import bulb_icon from '$lib/assets/icons/bulb.svg';
  import stack_icon from '$lib/assets/icons/stack.svg';
  import blueprint_icon from '$lib/assets/icons/blueprint.svg';
  import grid_icon from '$lib/assets/icons/grid.svg';
  // import sword_icon from '$lib/assets/icons/sword.svg';
  // import grid_icon from '$lib/assets/icons/grid.svg';
  import person_icon from '$lib/assets/icons/person.svg';
  import pen_swirl_icon from '$lib/assets/icons/pen-swirl.svg';

  // import palette_icon from '$lib/assets/icons/palette.svg';

  let selected_category = $state('all');
</script>

<svelte:head>
    <title>TapiocaFox | Artworks</title> 
</svelte:head>

<h1>Artworks</h1>
<ChipsWithUrlState 
  names={['All categories', 'Colorful', 'Kingdom']} 
  values={['all', 'colored', 'animals', 'characters']}
  dividers={['colored']}
  selected_value={selected_category}
  callback={(value: any) => {
    selected_category = value;
  }}
/>
{#if selected_category == "colored"}
<p class="annotation">Artworks that come with awesome colors <img class="inline-glyph" alt="Palette" src={palette_icon}/>.</p>
{:else if selected_category == "animals"}
<p class="annotation">Artworks that come with goofy animals <img class="inline-glyph" alt="Animal" src={android_icon}/>.</p>
{:else}
<p class="annotation">Collection of my artworks. Some with tidbits <img class="inline-glyph" alt="Tibits" src={bulb_icon}/>.</p>
{/if}

{#if selected_category=="all"}
<div class="card">
  <h2><a href="/artworks/portraits">Portraits</a></h2>
  <p>Potraits of people. Sketeched in black and white.</p>
  <div class="preview-row">
    <img class="preview outlined" src={snake}/>
    <img class="preview outlined" src={jyneda}/>
  </div>
</div>
{/if}
{#if selected_category=="all" || selected_category=='colored' || selected_category=='animals' || selected_category=='characters'}
<div class="card">
  <h2><a href="/artworks/squares">Squares</a></h2>
  <p>Flashy and cartoonish blocks. It can be animals, houses, hot anime girls and else.</p>
  <div class="preview-row">
    <img class="preview" src={amc_2020}/>
    <img class="preview" src={mosquito_zoomed}/>
    <img class="preview" src={crow}/>
  </div>
</div>
{/if}
{#if selected_category=="all" || selected_category=='characters' || selected_category=='animals'}
<div class="card">
  <h2>Comics</h2>
  <p>The surrealism is what I am looking for. Not much over here right now.</p>
  <ul>
    <li><a href="/artworks/comics/two_blocks">Two Blocks</a> 📦 x 2</li>
    <li>Four Blocks 📦 x 4 (None for now.)</li>
  </ul>
  <img class="preview outlined" src={two_blocks_cosmos}/>
</div>
{/if}
{#if selected_category=="all" || selected_category=='colored' || selected_category=='animals'}
<div class="card">
  <h2><a href="/artworks/design">Design</a></h2>
  <p>In forms of handbooks, posters, blueprints, UI and other stuffs.</p>
  <div class="preview-row">
    <img class="preview" src={amc2018_cover}/>
    <img class="preview" src={daijishou_widget_ui}/>
    <img class="preview outlined" src={phone_1}/>
  </div>
</div>
{/if}
{#if selected_category=="all" || selected_category=='animals' || selected_category=='characters'}
<div class="card">
  <h2><a href="/artworks/sketchings">Sketchings</a></h2>
  <p>Mostly things in real life, or quirky ideas inside of my head.</p>
  <div class="preview-row">
    <img class="preview outlined" src={hut}/>
    <img class="preview outlined" src={border_collie}/>
  </div>
</div>
{/if}
<!-- {#if selected_category=="all" || selected_category=='colored'}
<div class="card">
  <h2>Handbooks</h2>
  <p>AMC stands for "Applied Mathematics Camp".</p>
  <ul>
    <li><a href="/artworks/handbooks/amc2018">NCTU AMC 2018</a></li>
  </ul>
  <img class="preview" src={amc2018_cover}/>
</div>
{/if} -->
<ArtDecoration src={decoration}/>