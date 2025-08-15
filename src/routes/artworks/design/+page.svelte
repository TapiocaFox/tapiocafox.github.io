<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import phone_1 from '$lib/assets/design/phone_1.png';
	import phone_2 from '$lib/assets/design/phone_2.jpg';
	import handheld_1 from '$lib/assets/design/handheld_1.png';
	import handheld_2 from '$lib/assets/design/handheld_2.png';
	import retro_achievements from '$lib/assets/design/retro_achievements.png';
	import retro_achievements_ui from '$lib/assets/design/retro_achievements_ui.png';
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
<h1>Design/Blueprints</h1>
<p>Blueprints for UI, engineering design and stuffs.</p>
<img class="design_in_row" alt="Phone 1" src={phone_1}/><img class="design_in_row" alt="Phone 2" src={phone_2}/>
<p class="annotation">A phone I drew in 2013. It was inspired by the design of iPod nano 6th gen.</p>
<img class="design" alt="Handheld 1" src={handheld_1}/>
<p class="annotation">A friend of mine from China, who manufactures hardware parts asked me to design something, so I show him this.</p>
<img class="design" alt="Handheld 2" src={handheld_2}/>
<p class="annotation">And also this. (They are quite generic imo.)</p>
<img class="design" alt="RA" src={retro_achievements}/>
<p class="annotation">UI design for RetroAchievements in <a href="https://github.com/TapiocaFox/Daijishou" target="_blank">Daijishō</a>.</p>
<img class="design" alt="RA UI" src={retro_achievements_ui}/>
<p class="annotation">The actual UI for RetroAchievements.</p>
