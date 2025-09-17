<script lang="ts">
    import Chips from '$lib/components/Chips.svelte';

    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import GlslCanvas from '$lib/components/GlslCanvas.svelte';
    import alter_green_red_frag from '$lib/assets/glsl_shaders/alter_green_red.frag?raw';

    import default_shader from '$lib/assets/glsl_shaders/default.frag?raw';
    import sin from '$lib/assets/glsl_shaders/sin.frag?raw';
    import mouse from '$lib/assets/glsl_shaders/mouse.frag?raw';
    import adhesive from '$lib/assets/glsl_shaders/adhesive.frag?raw';
    import balls from '$lib/assets/glsl_shaders/balls.frag?raw';
    import fiber from '$lib/assets/glsl_shaders/fiber.frag?raw';
    import radiant from '$lib/assets/glsl_shaders/radiant.frag?raw';
    import array from '$lib/assets/glsl_shaders/array.frag?raw';
    import snoise from '$lib/assets/glsl_shaders/snoise.frag?raw';

    import edit_icon from '$lib/assets/icons/edit.svg';
    import { goto } from '$app/navigation';
    
    let selected_category = $state('all');

    let shaders_1 = $state([
        {
            shader: default_shader,
            categories: []
        },
        // {
        //     shader: adhesive,
        //     categories: ['distortion']
        // },
        // {
        //     shader: mouse,
        //     categories: []
        // },
        // {
        //     shader: balls,
        //     categories: []
        // },
        // {
        //     shader: fiber,
        //     categories: ['distortion']
        // },
        // {
        //     shader: array,
        //     categories: []
        // },
        // {
        //     shader: radiant,
        //     categories: ['noise']
        // },
        // {
        //     shader: snoise,
        //     categories: ['noise']
        // }
    ]);
</script>
<style>
    .shader_item {
        border: none !important;
        display: flex;
        align-items: stretch;
        /* aspect-ratio: 1; */
    }
</style>
<HeaderWithBackButton text="GLSL shader"/>
<Chips 
  names={['All categories', 'Editor', 'Noise', 'Distortion']} 
  values={['all', 'editor', 'noise', 'distortion']}
  selected_value={selected_category}
  callback={(value: any) => {
    if(value == 'editor') {
        goto('/glsl/editor');
    }
    else selected_category = value;
  }}
/>
<!-- <p class="annotation">These are my personal practice of GLSL. You can try it yourself in <img class="inline-glyph" alt="Edit" src={edit_icon}/><a href="/glsl/editor">the editor</a>.</p> -->

<h3>Practice One</h3>
<p class="annotation">Abstract patterns animated over time.</p>
<div class="flex_grid gallery">
    {#each shaders_1 as shader}
        {#if selected_category =='all' || shader.categories.includes(selected_category)} 
            <div class="item shader_item">
            <GlslCanvas fragment_shader={shader.shader}/>
        </div>
        {/if}
    {/each}
</div>
<!-- <GlslCanvas/> -->
<!-- <GlslCanvas fragment_shader={alter_green_red_frag}/> -->
<!-- <GlslCanvas fragment_shader={shader_toy_demo}/> -->
<!-- <GlslCanvas fragment_shader={adhesive}/> -->
<!-- <GlslCanvas fragment_shader={sin}/> -->
<!-- <GlslCanvas fragment_shader={mouse}/>
<GlslCanvas fragment_shader={balls}/>
<GlslCanvas fragment_shader={fiber}/>
<GlslCanvas fragment_shader={radiant}/>
<GlslCanvas fragment_shader={array}/> -->
<p class="annotation compact">Some of them are interactable with the mouse. I like to "vibe code" shaders with my <a href="https://music.apple.com/us/playlist/psychedelic/pl.u-r2yBAdYCAMeYoe" target="_blank">music playlist</a>.</p>