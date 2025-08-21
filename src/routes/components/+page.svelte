<script lang="ts">
  import BackButton from '$lib/components/BackButton.svelte';
  import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
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

<h1>Header 1</h1>
<h2>Header 2</h2>
<h3>Header 3</h3>
<h4>Header 4</h4>
<h5>Header 5</h5>
<HeaderWithBackButton text="Header"/>
<p>I was a sublime intellectual, the cantankerous and opinionated future genius, the skulking Malevole who stood apart from the herd. I was a grotesque amalgam of timidity and arrogance, alternating between long, awkward silences and blazing fits of rambunctiousness. -- Moon Palace, Paul Auster</p>

<div class="card">
  <h2>Lorem Ipsum</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>

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