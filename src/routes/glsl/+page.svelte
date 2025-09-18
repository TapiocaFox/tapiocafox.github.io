<script lang="ts">
    import Chips from '$lib/components/Chips.svelte';

    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import GlslCanvasGL2 from '$lib/components/GlslCanvasGL2.svelte';
    import alter_green_red_frag from '$lib/assets/glsl_shaders/alter_green_red.frag?raw';

    import default_vert_shader from '$lib/assets/glsl_shaders/default.vert?raw';
    import default_frag_shader from '$lib/assets/glsl_shaders/default.frag?raw';
    import sin from '$lib/assets/glsl_shaders/sin.frag?raw';
    import mouse from '$lib/assets/glsl_shaders/mouse.frag?raw';
    import adhesive from '$lib/assets/glsl_shaders/adhesive.frag?raw';
    import balls from '$lib/assets/glsl_shaders/balls.frag?raw';
    import fiber from '$lib/assets/glsl_shaders/fiber.frag?raw';
    import radiant from '$lib/assets/glsl_shaders/radiant.frag?raw';
    import array from '$lib/assets/glsl_shaders/array.frag?raw';
    import snoise from '$lib/assets/glsl_shaders/snoise.frag?raw';

    import edit_icon from '$lib/assets/icons/edit.svg';
    import debug_icon from '$lib/assets/icons/debug.svg';
    import { goto } from '$app/navigation';
    
    let selected_category = $state('all');

    let shaders_1 = $state([
        {
            vert_shader: default_vert_shader,
            frag_shader: default_frag_shader,
            categories: []
        },
        {
            vert_shader: default_vert_shader,
            frag_shader: adhesive,
            categories: ['distortion']
        },
        // {
        //     shader: mouse,
        //     categories: ['debug']
        // },
        {
            vert_shader: default_vert_shader,
            frag_shader: balls,
            categories: []
        },
        {
            vert_shader: default_vert_shader,
            frag_shader: fiber,
            categories: ['distortion']
        },
        {
            vert_shader: default_vert_shader,
            frag_shader: array,
            categories: []
        },
        {
            vert_shader: default_vert_shader,
            frag_shader: radiant,
            categories: ['noise']
        },
        {
            vert_shader: default_vert_shader,
            frag_shader: snoise,
            categories: ['noise']
        }
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
<HeaderWithBackButton text="GLSL Shader"/>
<Chips 
  names={['All categories', 'Noise', 'Distortion', 'Debug', 'Editor']}
  inline_icons={[null, null, null, debug_icon, edit_icon, edit_icon]}
  values={['all', 'noise', 'distortion', 'debug', 'editor']}
  dividers={['debug']}
  selected_value={selected_category}
  callback={(value: any) => {
    if(value == 'editor') {
        goto('/webgl_editor');
    }
    // else if(value == 'editor_webgl') {
    //     goto('/webgl_editor');
    // }
    else selected_category = value;
  }}
/>
<!-- <p class="annotation">These are my personal practice of GLSL. You can try it yourself in <img class="inline-glyph" alt="Edit" src={edit_icon}/><a href="/glsl/editor">the editor</a>.</p> -->
{#if selected_category == 'debug'}
<h3>Debug</h3>
<p class="annotation">WebGL2 shaders for debugging.</p>
<div class="flex_grid gallery">
    <div class="item shader_item">
        <GlslCanvasGL2 vertex_shader={default_vert_shader} fragment_shader={mouse}/>
    </div>
    <div class="item shader_item">
        <GlslCanvasGL2 vertex_shader={default_vert_shader} fragment_shader={sin}/>
    </div>
</div>
<h3>Debug (Preview mode)</h3>
<p class="annotation">WebGL2 shaders for debugging.</p>
<div class="flex_grid gallery">
    <div class="item shader_item">
        <GlslCanvasGL2 vertex_shader={default_vert_shader} fragment_shader={mouse} mode="preview"/>
    </div>
    <div class="item shader_item">
        <GlslCanvasGL2 vertex_shader={default_vert_shader} fragment_shader={sin} mode="preview"/>
    </div>
</div>
{/if}

{#if shaders_1.filter((shader) => {
    return selected_category =='all' || shader.categories.includes(selected_category);
}).length > 0}
<h3>Practice One</h3>
<p class="annotation">Abstract patterns animated over time. (Part of Assignment One.)</p>
<div class="flex_grid gallery">
    {#each shaders_1 as shader}
        {#if selected_category =='all' || shader.categories.includes(selected_category)} 
        <div class="item shader_item">
            <GlslCanvasGL2 vertex_shader={shader.vert_shader} fragment_shader={shader.frag_shader}/>
        </div>
        {/if}
    {/each}
</div>
{/if}
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