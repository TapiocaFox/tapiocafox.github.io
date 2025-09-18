<script lang="ts">
  import BackButton from '$lib/components/BackButton.svelte';
  import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
  import EndingDecoration from '$lib/components/EndingDecoration.svelte';
	import lena from '$lib/assets/misc/lenna.png'
  import icon from '$lib/assets/icon_dark.png';
	import tapiocafox from '$lib/assets/squares/tapiocafox.png';
  import Chips from '$lib/components/Chips.svelte';
  import GlslCanvas from '$lib/components/GlslCanvas.svelte';
  import GlslCanvasThree from '$lib/components/GlslCanvasThree.svelte';
  import GlslCanvasGL2 from '$lib/components/GlslCanvasGL2.svelte';

  import mouse_frag from '$lib/assets/glsl_shaders/mouse.frag?raw';

  let chip_selected_value = $state(-1);
  let grid_item_num = $state(12);
	let item_min_width = $state(32);
	let item_max_width = $state(128);

  function getRandomInteger(min: number, max: number) {
      // console.log(min, typeof(min));
      return Math.random() * (max - min) + min;
  }
  function getRandomPx(min: number, max: number) {
      let result = getRandomInteger(min, max) + "px";
      // console.log(min, result);
      return result;
      // return getRandomInteger(min, max) + "px";
  }


</script>

<style>
</style>
<HeaderWithBackButton text="Site components"/>
<p class="annotation">An &lt;p&gt; under annotation class. The components are styled to be content focus and for micro-blogging.</p>
<h1>Header 1</h1>
<h2>Header 2</h2>
<h3>Header 3</h3>
<h4>Header 4</h4>
<h5>Header 5</h5>
<Chips 
  names={['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']} 
  values={[1, 2, 3, 4, 5, 6]}
  callback={(value: number) => {
    chip_selected_value = value;
  }}
/>
<p>"Option {chip_selected_value}" is selected.</p>
<p>I was a sublime intellectual, the cantankerous and opinionated future genius, the skulking Malevole who stood apart from the herd. I was a grotesque amalgam of timidity and arrogance, alternating between long, awkward silences and blazing fits of rambunctiousness. -- Moon Palace, Paul Auster</p>

<div class="card">
    <h2><a href="/components">Components</a></h2>
    <div class="icon-description-layout">
        <div class="icon">
            <img class="icon" alt="Icon" src={tapiocafox}/>
        </div>
        <div class="description">
            <p>A page for debugging the components of this website. The website is written with <a href="https://svelte.dev" target="_blank">Svelte Tookit</a>.</p>
        </div>
    </div>
</div>

<div class="card">
  <h2>Lorem Ipsum</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  <img alt="Lena" class="preview" src={lena}/><GlslCanvas mode="preview"/>
  <p class="annotation"><a href="https://en.wikipedia.org/wiki/Lenna" target="_blank">Lenna</a> (or Lena) is a standard test image used in the field of digital image processing, starting in 1973.</p>
</div>

<h3>GLSL Canvases</h3>
<p class="annotation">"GlslCanvasThree" is used for the left side, "GlslCanvasGL2" for the right.</p>
<GlslCanvasThree fragment_shader={mouse_frag}/>
<GlslCanvasGL2 fragment_shader={mouse_frag}/>

<hr class="solid">
<hr class="dashed">
<hr class="dotted">
<ul>
  <li>Item A</li>
  <li>Item B</li>
  <li>Item C</li>
</ul>
<ol>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ol>
<div>
  <p style:display="inline">Items count: </p>
  <input style:width="48px" type="number" bind:value={grid_item_num}/>
</div>
<div>
  <p style:display="inline">Random item width from to: </p>
  From <input style:width="48px" type="number" bind:value={item_min_width}/> to
  <input style:width="48px" type="number" bind:value={item_max_width}/>
</div>
<hr class="dashed">
<div class="grid" style:margin="8px 0" style:width="360px">
  {#each { length: grid_item_num }, num}
    <div class="item" style:width={getRandomPx(item_min_width, item_max_width)} style:height="64px"><p>{num+1}</p></div>
  {/each}
</div>
<hr class="dashed">
<div class="flex_grid" style:margin="8px 0" style:width="360px">
  {#each { length: grid_item_num }, num}
    <div class="item" style:width={getRandomPx(item_min_width, item_max_width)} style:height="64px"><p>{num+1}</p></div>
  {/each}
</div>
<hr class="dashed">
<BackButton text="A back button"/>
<EndingDecoration/>