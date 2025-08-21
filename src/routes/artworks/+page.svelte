<script>
  import ArtDecoration from "$lib/components/ArtDecoration.svelte";
  import icon from '$lib/assets/icon_black.png';
</script>
<h1>Artworks 🎨</h1>
<p class="annotation">Collection of my artworks. Some with tidbits.</p>
<div class="card">
  <h2>Comics</h2>
  <ul>
    <li><a href="/artworks/comics/two_blocks">Two Blocks</a> 📦 x 2</li>
    <li>Four Blocks 📦 x 4 (None for now.)</li>
  </ul>
</div>
<div class="card">
  <h2><a href="/artworks/portraits">Portraits</a></h2>
  <p>People and some significant individuals in my life.</p>
</div>
<div class="card">
  <h2><a href="/artworks/squares">Squares</a></h2>
  <p>Flashy and cartoonish blocks.</p>
  <!-- <pre>
  ================================================.
      .-.   .-.     .--.                         |
      | OO| | OO|   / _.-' .-.   .-.  .-.   .''.  |
      |   | |   |   \  '-. '-'   '-'  '-'   '..'  |
      '^^^' '^^^'    '--'                         |
  ===============.  .-.  .================.  .-.  |
                | |   | |                |  '-'  |
                | |   | |                |       |
                | ':-:' |                |  .-.  |
  l42            |  '-'  |                |  '-'  |
  ==============='       '================'       |
  </pre> -->
  <!-- <p class="annotation">* This ascii art is originated from <a href="https://www.asciiart.eu/video-games/pacman" target="_blank">here</a>.</p> -->
</div>

<div class="card">
  <h2><a href="/artworks/design">Design</a></h2>
  <p>Posters, Blueprints, UI and stuffs.</p>
</div>

<div class="card">
  <h2><a href="/artworks/sketchings">Sketchings</a></h2>
<p>Mostly things in real life, or quirky ideas inside of my head.</p>
</div>
<!-- <h2>Meta</h2> -->
<div class="card">
  <h2>Handbooks</h2>
  <ul>
    <li><a href="/artworks/handbooks/amc2018">NCTU AMC 2018</a></li>
  </ul>
  <p class="annotation">* AMC stands for "Applied Mathematics Camp".</p>
</div>
<div class="card">
    <h2><a href="/components">Components</a></h2>
    <div class="icon_description_layout">
        <div class="icon">
            <img class="icon" alt="Icon" src={icon}/>
        </div>
        <div class="description">
            <p>A page for debugging the components of this website. The website is written with <a href="https://svelte.dev" target="_blank">Svelte Tookit</a>.</p>
        </div>
    </div>
</div>
<!-- <h2>Game Cards</h2>
<ul>
  <li><a href="/artworks/game_cards/amc2018">NCTU AMC 2018</a></li>
</ul> -->
<ArtDecoration/>