<script lang="ts">
    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
	import snake from '$lib/assets/portraits/snake.png';
	import lin_yi_bing from '$lib/assets/portraits/lin_yi_bing.png';
	import jyneda from '$lib/assets/portraits/jyneda.png';
	import stubbs from '$lib/assets/portraits/stubbs.png';
    
</script>
<style>
    img.portrait {
        display: block;
        width: 100%;
        max-width: var(--compact-width);
        border: 1px dashed black;
    }
</style>
<HeaderWithBackButton text="Portraits"/>
<p class="bold-annotation">Potraits of people. Sketeched in black and white.</p>
<img class="portrait" alt="Snake" src={snake}/>
<p class="annotation compact">A woman with a snake wrapped around her neck. There was a reference picture on Pinterest, but I've lost it.</p>
<img class="portrait" alt="jyneda" src={jyneda}/>
<p class="annotation compact">Prof. Jyneda (Yun-Wei Lin), he was a very informed, talkative and engaging person. He introduced me many concepts like micro-service and other internet paradigms. He was a very pragmatic, humble, and patient person. He wrote me a recommandation letter that get me into NYU.</p>
<img class="portrait" alt="Lin Yi-Bing" src={lin_yi_bing}/>
<p class="annotation compact">Prof. Lin Yi-Bing (林一平), he was the vice president of my undergrade university NCTU. He is a very insightful person, who also enjoys sketching and other forms of arts. He was very insisting in his own belief; having a lots of pride, but also a very open-minded person. I was invited into his lab, wrote me a recommandation letter as well.</p>
<img class="portrait" alt="stubbs" src={stubbs}/>
<p class="annotation compact">Mr. Stubbs, the founder and the manager of the largest retro gamming community "Retro Handhelds". He is very good at communicating and connecting people and developers from different backgrounds. Has a very sweet family and seems to live in the woods? He kindly wrote me a recommandation letter as well.</p>
