<script lang="ts">
	import Chips from '$lib/components/Chips.svelte';
	import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
	import phone_1 from '$lib/assets/design/phone_1.png';
	import phone_2 from '$lib/assets/design/phone_2.jpg';
	import handheld_1 from '$lib/assets/design/handheld_1.png';
	import handheld_2 from '$lib/assets/design/handheld_2.png';
	import retro_achievements from '$lib/assets/design/retro_achievements.png';
	import retro_achievements_ui from '$lib/assets/design/retro_achievements_ui.png';
	import nsf from '$lib/assets/design/nsf.png';
	import daijishou_wallpaper from '$lib/assets/design/daijishou_wallpaper.png';
	import daijishou_widget from '$lib/assets/design/daijishou_widget.png';
	import daijishou_widget_ui from '$lib/assets/design/daijishou_widget_ui.png';
	import projector_1 from '$lib/assets/design/projector_1.png';
	import projector_2 from '$lib/assets/design/projector_2.png';
	import amc2018_cover from '$lib/assets/design/amc2018_cover.png';
	import daijishou from '$lib/assets/design/daijishou.png';
	import tna_wallpaper from '$lib/assets/design/tna_wallpaper.png';
	import nala_cat from '$lib/assets/design/nala_cat.png';
	import donuts from '$lib/assets/design/donuts.png';
	import goto_and_play_1 from '$lib/assets/design/goto_and_play_1.jpg';
	import goto_and_play_2 from '$lib/assets/design/goto_and_play_2.jpg';
	import nooxy from '$lib/assets/design/nooxy.png';
	import nsf_icon from '$lib/assets/icons/nsf.png';
	import vampire from '$lib/assets/design/vampire.png';

	let selected_category = $state('posters');
</script>
<style>
    img.design {
        display: block;
        width: 100%;
        max-width: var(--compact-width);
        border: 1px dashed black;
    }
    img.design_in_row {
        display: inline-block;
        width: auto;
        max-width: 100%;
        max-height: 320px;
        margin-right: 0.5rem;
        border: 1px dashed black;
    }
</style>
<HeaderWithBackButton text="Design"/>
<Chips 
  names={['Posters', 'Hardware', 'Software']} 
  values={['posters','hardware', 'software']}
  selected_value={selected_category}
  callback={(value: any) => {
    selected_category = value;
  }}
/>
<!-- <p class="annotation">Designs in forms of handbooks, posters, blueprints, UI.</p> -->

{#if selected_category=="all" || selected_category=="posters"}
<p class="annotation">Handbook cover, posters and wallpapers.</p>
<img class="design" alt="Handbook" src={amc2018_cover}/>
<p class="annotation compact">Cover for NCTU AMC 2018 handbook. Please check out the full version in <a href="/artworks/handbooks/amc2018" target="_blank">PDF here</a>.</p>
<img class="design" alt="Daijishō" src={daijishou}/>
<p class="annotation compact">Poster art for <a href="https://github.com/TapiocaFox/Daijishou" target="_blank">Daijishō</a>.</p>
<img class="design" alt="TNA Wallpaper" src={tna_wallpaper}/>
<p class="annotation compact">Nationalism has its utility purpose in Taiwanese geopolitics. Because we are constantly in threat, very diverse and easliy influenced due to a rather weak cultural rooting.</p>
<img class="design" alt="NSF" src={nsf}/>
<p class="annotation compact">A poster for the content management system (CMS) <a href="https://github.com/NOOXY-research/NoService" target="_blank">"<img class="inline-glyph" alt="NoService" src={nsf_icon}/>NoService"</a> written from scratch.</p>
<img class="design" alt="The vampire" src={vampire}/>
<p class="annotation compact">I feel high while drawing this.</p>
<img class="design" alt="Guru Donuts" src={donuts}/>
<p class="annotation compact">This is the <a href="https://music.apple.com/us/album/donuts/1579957195?i=1579957279" target="_blank">theme music</a> of the making of these <a href="https://youtube.com/playlist?list=PLjEaoINr3zgEPv5y--4MKpciLaoQYZB1Z&si=coiWaHRukeLmpfQ8" target="_blank">guru donuts</a>.</p>
<img class="design" alt="Nara Cat" src={nala_cat}/>
<p class="annotation compact">This is <a href="https://www.facebook.com/nalacatshow" target="_blank">nala cat</a>. I used this color palette without knowing transgenderism. The palette just comes out naturally.</p>
{/if}


{#if selected_category=="all" || selected_category=="hardware"}
<p class="annotation">Something that are tangible and touchable.</p>
<img class="design_in_row" alt="Phone 1" src={phone_1}/><img class="design_in_row" alt="Phone 2" src={phone_2}/>
<p class="annotation compact">A phone I drew in 2013. It was inspired by the design of iPod nano 6th gen.</p>
<img class="design" alt="Handheld 1" src={handheld_1}/>
<p class="annotation compact">A friend of mine from China, who manufactures hardware parts asked me to design something, so I show him this.</p>
<img class="design" alt="Handheld 2" src={handheld_2}/>
<p class="annotation compact">And also this. (They are quite generic imo.)</p>
<img class="design" alt="Projector" src={projector_1}/>
<p class="annotation compact">My dad asked me to design the pedestal for our new home projector. While I also tried to draw something with complicated shapes. It ended up being a monolithic hardass slab of polished Hinoki. Because we figured out the stuff with a simple geometry with good texture tend to be more visually sustainable. And we don't want the pedestal distracts while watching TV.</p>
<img class="design" alt="Projector 2" src={projector_2}/>
<p class="annotation compact">It ended up in a pile of everything. (Listened to KMFDM, but I am not a serial killer or anything. It was purely musical and aesthetic.)</p>
{/if}

{#if selected_category=="all" || selected_category=="software"}
<p class="annotation">Something that are also tangible but in imagination.</p>

<img class="design" alt="goto&Play" src={goto_and_play_1}/>
<p class="annotation compact">NCTU's radio station "goto&Play". The site was for broadcasting music, scheduling programs and chatting with the DJ. Includes a <a href="/projects#:~:text=A%20full%20stack%20chatting%20software.%20Written%20in%20React.js%20with%20a%20microservice%20that%20provide%20realtime%20chat%2C%20channel%20management%2C%20permission%20control%2C%20user%20authentication%20and%20other%20features.%20The%20service%20is%20built%20on%20top%20of%20%22NoService%22%2C%20a%20content%20management%20system%20(CMS)%20written%20from%20scratch." target="_blank">fullstack chatting software</a> for the chatting feature and site's backend management.</p>
<img class="design" alt="goto&Play" src={goto_and_play_2}/>
<p class="annotation compact">And the second one. We spend a lot of time to make it feel cozy and welcoming, but only about half of the elements were implemented. Because it is difficult to maintain the style for mobile size's screens.</p>


<img class="design" alt="Daijishō Widget" src={daijishou_widget}/>
<p class="annotation compact">Sketches before Daijishō widgets being implemented.</p>
<img class="design" alt="Daijishō Widget" src={daijishou_widget_ui}/>
<p class="annotation compact">Daijishō widgets actually being implemented.</p>
<img class="design" alt="RA" src={retro_achievements}/>
<p class="annotation compact">UI design for RetroAchievements in <a href="https://github.com/TapiocaFox/Daijishou" target="_blank">Daijishō</a>.</p>
<img class="design" alt="RA UI" src={retro_achievements_ui}/>
<p class="annotation compact">The actual UI for RetroAchievements.</p>
<img class="design" alt="Daijishō Wallpaper" src={daijishou_wallpaper}/>
<p class="annotation compact">Guideline for people to design <a href="https://daijishou.github.io/Gallery/" target="_blank">wallpeper pack</a> for Daijishō. (The whiter the area the more you want to put things that attract eyeballs.)</p>
<img class="design" alt="NOOXY" src={nooxy}/>
<p class="annotation compact">This was my personal website during undergrad to manage a minecraft server for math majors. I was fortunate to get feedbacks to bring more improvements. And later developed a content management system (CMS) mentioned in <a href="/projects">projects</a>. Our dorms had Gigabit network because we are part of the internet backbone.</p>
{/if}

<!-- <ArtDecoration/> -->

