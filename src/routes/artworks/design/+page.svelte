<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import phone_1 from '$lib/assets/design/phone_1.png';
	import phone_2 from '$lib/assets/design/phone_2.jpg';
	import handheld_1 from '$lib/assets/design/handheld_1.png';
	import handheld_2 from '$lib/assets/design/handheld_2.png';
	import retro_achievements from '$lib/assets/design/retro_achievements.png';
	import retro_achievements_ui from '$lib/assets/design/retro_achievements_ui.png';
	import daijishou_wallpaper from '$lib/assets/design/daijishou_wallpaper.png';
	import daijishou_widget from '$lib/assets/design/daijishou_widget.png';
	import daijishou_widget_ui from '$lib/assets/design/daijishou_widget_ui.png';
	import projector_1 from '$lib/assets/design/projector_1.png';
	import projector_2 from '$lib/assets/design/projector_2.png';
	import amc2018_cover from '$lib/assets/design/amc2018_cover.png';
	import daijishou from '$lib/assets/design/daijishou.png';
	import tna_wallpaper from '$lib/assets/design/tna_wallpaper.png';
	import nala_cat from '$lib/assets/design/nala_cat.png';
</script>
<style>
    img.design {
        display: block;
        width: 100%;
        max-width: 640px;
        border: 1px dashed black;
    }
    img.design_in_row {
        display: inline-block;
        width: 100%;
        max-width: 320px;
        margin-right: 0.5rem;
        border: 1px dashed black;
    }
</style>
<BackButton/>
<h1>Design/Blueprints/Posters</h1>
<p>Posters, Blueprints for UI, engineering design and stuffs.</p>
<img class="design_in_row" alt="Phone 1" src={phone_1}/><img class="design_in_row" alt="Phone 2" src={phone_2}/>
<p class="annotation">A phone I drew in 2013. It was inspired by the design of iPod nano 6th gen.</p>
<img class="design" alt="Handheld 1" src={handheld_1}/>
<p class="annotation">A friend of mine from China, who manufactures hardware parts asked me to design something, so I show him this.</p>
<img class="design" alt="Handheld 2" src={handheld_2}/>
<p class="annotation">And also this. (They are quite generic imo.)</p>
<img class="design" alt="Handbook" src={amc2018_cover}/>
<p class="annotation">Cover for <a href="/artworks/handbooks/amc2018">AMC 2018 handbook</a>.</p>
<img class="design" alt="Nara Cat" src={nala_cat}/>
<p class="annotation">This is <a href="https://www.facebook.com/nalacatshow" target="_blank">nala cat</a>. I used this color palette without knowing transgenderism. The palette just comes out naturally.</p>
<img class="design" alt="TNA Wallpaper" src={tna_wallpaper}/>
<p class="annotation">Nationalism has its utility purpose in Taiwanese geopolitics in my opinion. Because we constantly in threat, very diverse and easliy influenced due to a rather weak cultural rooting.</p>
<img class="design" alt="Daijishō" src={daijishou}/>
<p class="annotation">Poster art for <a href="https://github.com/TapiocaFox/Daijishou" target="_blank">Daijishō</a>.</p>
<img class="design" alt="RA" src={retro_achievements}/>
<p class="annotation">UI design for RetroAchievements in <a href="https://github.com/TapiocaFox/Daijishou" target="_blank">Daijishō</a>.</p>
<img class="design" alt="RA UI" src={retro_achievements_ui}/>
<p class="annotation">The actual UI for RetroAchievements.</p>
<img class="design" alt="Daijishō Widget" src={daijishou_widget}/>
<p class="annotation">Sketches before Daijishō widgets being implemented.</p>
<img class="design" alt="Daijishō Widget" src={daijishou_widget_ui}/>
<p class="annotation">Daijishō widgets actually being implemented.</p>
<img class="design" alt="Daijishō Wallpaper" src={daijishou_wallpaper}/>
<p class="annotation">Guideline for people to design <a href="https://daijishou.github.io/Gallery/" target="_blank">wallpeper pack</a> for Daijishō. (The whiter the area the more you want to put things that attract eyeballs.)</p>
<img class="design" alt="Projector" src={projector_1}/>
<p class="annotation">My dad asked me to design the pedestal for our new home projector. While I also tried to draw something with complicated shapes. It ended up being a monolithic hardass slab of polished Hinoki. Because we figured out simple things with good texture tend to be more visually sustainable. And we don't want the thing distracts, while watching TV.</p>
<img class="design" alt="Projector 2" src={projector_2}/>
<p class="annotation">It ended up in a pile of everything. (Listened to KMFDM, but I am not a serial killer or anything. It was purely musical and aesthetic.)</p>


