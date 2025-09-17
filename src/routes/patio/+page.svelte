<script lang="ts">
    import { goto } from '$app/navigation';
    import ChipsWithUrlState from '$lib/components/ChipsWithUrlState.svelte';
    // import GlslCanvas from '$lib/components/GlslCanvas.svelte';

    // import fiber_bg from '$lib/assets/glsl_shaders/fiber_bg.frag?raw';
    import karaoke_icon from '$lib/assets/icons/karaoke.svg';
    import eye_icon from '$lib/assets/icons/eye.svg';
    import picture_icon from '$lib/assets/icons/picture.svg';

    import tapiocafox_icon from '$lib/assets/icons/tapiocafox.png';
    let selected_category = $state('all');

</script>

<!-- <GlslCanvas mode='background' show_code_block={false} fragment_shader={fiber_bg}/> -->

<h1>Fox's Patio <img class="inline-glyph" alt="TapiocaFox" src={tapiocafox_icon}/></h1>
<ChipsWithUrlState 
  names={['Karaoke', 'Retina', 'Pictures']} 
  values={['music', 'videos', 'pictures', 'portals', 'other']}
  inline_icons={[null, null, picture_icon]}
  selected_value={selected_category}
  callback={(value: any) => {
    // console.log(value, value == 'photos');
    if(value == 'pictures') {
      goto('/pictures');
      return false; 
    }
    else {
      selected_category = value;
      return true;
    }
  }}
/>
<!-- <p class="annotation">Personal taste. Including music, videos and other forms of content.</p> -->


{#if selected_category=="music"}
<p class="annotation">Personal music taste <img class="inline-glyph" alt="Karaoke" src={karaoke_icon}/>. Curated as an Music playlist.</p>
<iframe title="Apple Music playlist" allow="autoplay *; encrypted-media *;" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/playlist/tapiocafoxs-selection/pl.u-EdAVR7Gu5Wq7yq"></iframe>
{/if}

{#if selected_category=="videos"}
<p class="annotation">Stuffs on YouTube that are aesthetic and cool.</p>
<iframe class="youtube" src="https://www.youtube.com/embed/oCBaiNr3K9A?si=DN0rtc7AB4PJMtB_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p class="annotation compact"><a href="https://en.wikipedia.org/wiki/Susan_Kare" target="_blank">Susan Kare</a> is an American artist and graphic designer, who contributed interface elements and typefaces for the first Apple Macintosh personal computer from 1983 to 1986.</p>
<iframe class="youtube" src="https://www.youtube.com/embed/PkPSDOjhxwM?si=uxjuwaS3c0qlrfO4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p class="annotation compact">Another chill videos about <a href="https://en.wikipedia.org/wiki/Vacuum_fluorescent_display" target="_blank">VFD (Vacuum Fluorescent Display)</a>. The owner of the channel produces his own <a href="https://posy.bandcamp.com" target="_blank">music</a> for the videos.</p>
<iframe class="youtube" src="https://www.youtube.com/embed/eRbnVqTGLUc?si=YabkT3VTZUTDmLaZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p class="annotation compact"><a href="https://en.wikipedia.org/wiki/Vib-Ribbon" target="_blank">Vib-Ribbon</a>, a Japanese rhythm game on PlayStation 1. One of the interesting facts about this game is that you can eject the game disc, and place in your custom CD to generate your own game level. The game itself can be completely on RAM. Despite its geometric design. The music, animation, and character design emanate a heartwarming minimalistic vibe. The game was very ahead of its time.</p>
{/if}

{#if selected_category=="credits"}
<p class="annotation">Third party stuffs I used in this website.</p>
<!-- <img src="https://www.svgrepo.com/logo.svg"/> -->
<p class="annotation">SVG repo.</p>
{/if}

{#if selected_category=="other"}
<p>None for now.</p>
{/if}