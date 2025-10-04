<script lang="ts">
  import WindowBlock from '$lib/components/WindowBlock.svelte';
  import PointerBlock from '$lib/components/PointerBlock.svelte';
  import BackButton from '$lib/components/BackButton.svelte';
  import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
  import EndingDecoration from '$lib/components/EndingDecoration.svelte';
	import lena from '$lib/assets/misc/lenna.png'
	import tapiocafox from '$lib/assets/squares/tapiocafox.png';
  import Chips from '$lib/components/Chips.svelte';
  // import GlslCanvasThree from '$lib/components/GlslCanvasThree.svelte';
  import TapiocaFoxWebGL from '$lib/components/TapiocaFoxWebGL.svelte';

  import mouse_frag from '$lib/assets/webgl/misc/mouse.frag?raw';
  import window_icon from '$lib/assets/icons/window.svg';
  import close_icon from '$lib/assets/icons/close.svg';

  import version from '$lib/version';

  let chip_selected_value = $state(-1);
  let grid_item_num = $state(12);
	let item_min_width = $state(32);
	let item_max_width = $state(128);
  
  let list_item_num = $state(12);
  let show_lena_window = $state(false);

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
            <p>This is a page for debugging the components of this website. The website is written with <a href="https://svelte.dev" target="_blank">Svelte Tookit</a>. ({version})</p>
        </div>
    </div>
</div>

<div class="card">
  <h2>Lorem Ipsum</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  <p><button class="text" onclick={() => {show_lena_window=!show_lena_window}}>Open the article in window <img class="inline-glyph" alt="Window" src={window_icon}/></button> (show: {show_lena_window})</p>
  <WindowBlock grab_element_id="lena-grabable" bind:show={show_lena_window} open_location="right">
    <h2 id="lena-grabable"><button class="no-style" onclick={()=>{show_lena_window=false}}><img class="inline-glyph" alt="Close" src={close_icon}/></button>&nbsp;Window: Lorem Ipsum</h2>
    <p class="annotation">Grab the title to drag the window around.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor odio eu ullamcorper consectetur. Integer malesuada mauris vel ipsum semper dictum. Mauris quis sem ut velit mollis interdum. Aliquam et eros ac nunc suscipit bibendum. Phasellus finibus urna sit amet lorem posuere, non volutpat urna tristique. Sed auctor, quam a fringilla imperdiet, ligula urna ornare urna, at sodales urna mauris sit amet dui. Curabitur auctor interdum aliquet.

Suspendisse potenti. Aliquam egestas pharetra bibendum. In dignissim ante ligula. Donec pretium purus sed suscipit sodales. Sed malesuada eget nulla in auctor. Aenean vel tristique augue. Sed erat nulla, tempor ac metus nec, euismod interdum ligula. Proin pellentesque enim et porta posuere.

Phasellus quis lorem accumsan, luctus ex non, ultricies lacus. Aenean semper lorem ut eros scelerisque suscipit. Vivamus maximus nibh aliquam quam ultricies interdum. Aenean facilisis quis nulla quis faucibus. Donec gravida volutpat nisl, ac consequat enim feugiat a. Nulla dui erat, laoreet ut iaculis at, pharetra non nunc. Nunc fermentum ipsum eget dapibus fermentum. Etiam volutpat congue velit ac facilisis. Aliquam vitae placerat odio, ultricies dignissim justo. Fusce id efficitur odio, sed venenatis est. Vestibulum rutrum est sapien, quis suscipit leo sodales tincidunt. In a vestibulum felis. Donec et dolor non metus condimentum suscipit eu sit amet sapien. Sed aliquet finibus rhoncus. Curabitur interdum a elit sed fringilla.

In pulvinar, libero in vulputate facilisis, tortor nunc tempor nibh, eget consequat nunc neque a nibh. Maecenas lacus mauris, commodo id lacus non, vulputate volutpat nibh. Sed elit orci, convallis ut gravida vel, fermentum quis urna. Etiam vestibulum lacus eu ligula tempus, bibendum sodales sem pulvinar. Proin vulputate maximus condimentum. Sed feugiat lorem velit. Integer suscipit mauris eget dapibus tempus. Nam eleifend suscipit metus vel lobortis. Nunc semper vel libero eu finibus. Suspendisse feugiat vulputate ligula, nec ullamcorper nibh ornare eu. Curabitur mattis tincidunt eleifend.

Sed ullamcorper sed quam ac fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras ornare dapibus augue id aliquam. Praesent lorem velit, malesuada id dictum eget, lacinia et erat. Quisque imperdiet nunc et imperdiet mollis. Cras tempus orci non pellentesque porta. Etiam rhoncus hendrerit magna. Maecenas ac elit faucibus, volutpat nulla ac, tempor mi. Nunc nec iaculis ipsum. Sed ut dictum sem. Nunc quam ligula, commodo eget fermentum vel, luctus quis orci.</p>
    <div class="preview-row">
      <img id="lena-img" alt="Lena" class="preview" src={lena}/>
      <PointerBlock element_id="lena-img">
        <h3>Lenna</h3>
        <p>Lenna (or Lena) is a standard test image used in the field of digital image processing, starting in 1973. It is a picture of the Swedish model Lena Forsén, shot by photographer Dwight Hooker and cropped from the centerfold of the November 1972 issue of Playboy magazine. The image has attracted controversy in recent years because of its subject matter, and many journals have deemed it inappropriate and discouraged its use, while others have banned it from publication outright. Forsén herself has called for it to be retired, saying "It's time I retired from tech."</p>
      </PointerBlock>
      <TapiocaFoxWebGL mode="preview"/>
      <TapiocaFoxWebGL mode="preview" fragment_shader={mouse_frag}/>
    </div>
    <p class="annotation"><a href="https://en.wikipedia.org/wiki/Lenna" target="_blank">Lenna</a> (or Lena) is a standard test image used in the field of digital image processing, starting in 1973.</p>
  </WindowBlock>
  <div class="preview-row">
    <img id="lena-img" alt="Lena" class="preview" src={lena}/>
    <PointerBlock element_id="lena-img">
      <h3>Lenna</h3>
      <p>Lenna (or Lena) is a standard test image used in the field of digital image processing, starting in 1973. It is a picture of the Swedish model Lena Forsén, shot by photographer Dwight Hooker and cropped from the centerfold of the November 1972 issue of Playboy magazine. The image has attracted controversy in recent years because of its subject matter, and many journals have deemed it inappropriate and discouraged its use, while others have banned it from publication outright. Forsén herself has called for it to be retired, saying "It's time I retired from tech."</p>
    </PointerBlock>
    <TapiocaFoxWebGL mode="preview"/>
    <TapiocaFoxWebGL mode="preview" fragment_shader={mouse_frag}/>
  </div>
  <p class="annotation"><a href="https://en.wikipedia.org/wiki/Lenna" target="_blank">Lenna</a> (or Lena) is a standard test image used in the field of digital image processing, starting in 1973.</p>
</div>

<!-- <h3>GLSL Canvases</h3> -->
<!-- <p class="annotation">"GlslCanvasThree" is used for the left side, "TapiocaFoxWebGL" for the right.</p> -->
<!-- <GlslCanvasThree fragment_shader={mouse_frag}/> -->

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
<div>
  <p style:display="inline">List items count: </p>
  <input style:width="48px" type="number" bind:value={list_item_num}/>
</div>

<hr class="dashed">
<BackButton text="A back button"/>
<EndingDecoration/>