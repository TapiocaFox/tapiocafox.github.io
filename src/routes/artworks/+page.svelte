<script>
  import ChipsWithUrlHash from '$lib/components/ChipsWithUrlHash.svelte';
  import ArtDecoration from "$lib/components/ArtDecoration.svelte";
  import amc_2020 from '$lib/assets/squares/amc_2020.png';
  import mosquito_zoomed from '$lib/assets/squares/mosquito_zoomed.jpg';
  import crow from '$lib/assets/squares/crow.png';
  import hut from '$lib/assets/squares/hut.jpg';
  import snake from '$lib/assets/portraits/snake.png';
	import jyneda from '$lib/assets/portraits/jyneda.png';

	import two_blocks_cosmos from '$lib/assets/comics/two_blocks_cosmos.png';
	import border_collie from '$lib/assets/sketchings/border_collie.png';

	import phone_1 from '$lib/assets/design/phone_1.png';
	import daijishou_widget_ui from '$lib/assets/design/daijishou_widget_ui.png';

	import amc2018_cover from '$lib/assets/design/amc2018_cover.png';

  let selected_category = $state('all');
</script>
<h1>Artworks</h1>
<p class="annotation">Collection of my artworks. Some with tidbits.</p>
<ChipsWithUrlHash 
  names={['All categories', 'Colored', 'Animals', 'Characters']} 
  values={['all', 'colored', 'animals', 'characters']}
  selected_value={selected_category}
  callback={(value) => {
    selected_category = value;
  }}
/>
{#if selected_category=="all" || selected_category=='characters' || selected_category=='animals'}
<div class="card">
  <h2>Comics</h2>
  <p>Surrealism is what I am looking for right now.</p>
  <ul>
    <li><a href="/artworks/comics/two_blocks">Two Blocks</a> 📦 x 2</li>
    <li>Four Blocks 📦 x 4 (None for now.)</li>
  </ul>
  <img class="preview" src={two_blocks_cosmos}/>
</div>
{/if}
{#if selected_category=="all"}
<div class="card">
  <h2><a href="/artworks/portraits">Portraits</a></h2>
  <p>People and some significant individuals in my life.</p>
  <img class="preview outlined" src={snake}/>
  <img class="preview outlined" src={jyneda}/>
</div>
{/if}
{#if selected_category=="all" || selected_category=='colored' || selected_category=='animals' || selected_category=='characters'}
<div class="card">
  <h2><a href="/artworks/squares">Squares</a></h2>
  <p>Flashy and cartoonish blocks.</p>
  <img class="preview" src={amc_2020}/><img class="x-small" src={mosquito_zoomed}/><img class="x-small" src={crow}/>
</div>
{/if}
{#if selected_category=="all" || selected_category=='colored' || selected_category=='animals'}
<div class="card">
  <h2><a href="/artworks/design">Design</a></h2>
  <p>Posters, Blueprints, UI and stuffs.</p>
  <img class="preview" src={daijishou_widget_ui}/>
  <img class="preview outlined" src={phone_1}/>
</div>
{/if}
{#if selected_category=="all" || selected_category=='animals' || selected_category=='characters'}
<div class="card">
  <h2><a href="/artworks/sketchings">Sketchings</a></h2>
  <p>Mostly things in real life, or quirky ideas inside of my head.</p>
  <img class="preview outlined" src={hut}/>
  <img class="preview outlined" src={border_collie}/>
</div>
{/if}
{#if selected_category=="all" || selected_category=='colored'}
<div class="card">
  <h2>Handbooks</h2>
  <ul>
    <li><a href="/artworks/handbooks/amc2018">NCTU AMC 2018</a></li>
  </ul>
  <p class="annotation">* AMC stands for "Applied Mathematics Camp".</p>
  <img class="preview" src={amc2018_cover}/>
</div>
{/if}
<ArtDecoration/>