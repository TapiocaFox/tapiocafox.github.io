<script lang="ts">
    import Chips from '$lib/components/Chips.svelte';

    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import TapiocaFoxWebGL from '$lib/components/TapiocaFoxWebGL.svelte';
    import alter_green_red_frag from '$lib/assets/webgl/practice_1/alter_green_red.frag?raw';

    import default_vert_shader from '$lib/assets/webgl/default.vert?raw';
    import default_frag_shader from '$lib/assets/webgl/default.frag?raw';
    import default_js from '$lib/assets/webgl/default.js?raw';
    import passive_utime_js from '$lib/assets/webgl/passive_utime.js?raw';
    
    import sin from '$lib/assets/webgl/practice_1/sin.frag?raw';
    import mouse from '$lib/assets/webgl/practice_1/mouse.frag?raw';
    import adhesive from '$lib/assets/webgl/practice_1/adhesive.frag?raw';
    import balls from '$lib/assets/webgl/practice_1/balls.frag?raw';
    import fiber from '$lib/assets/webgl/practice_1/fiber.frag?raw';
    import radiant from '$lib/assets/webgl/practice_1/radiant.frag?raw';
    import array from '$lib/assets/webgl/practice_1/array.frag?raw';
    import snoise from '$lib/assets/webgl/practice_1/snoise.frag?raw';

    import spheres_vert from '$lib/assets/webgl/practice_2/spheres.vert?raw';
    import spheres_frag from '$lib/assets/webgl/practice_2/spheres.frag?raw';
    import spheres_js from '$lib/assets/webgl/practice_2/spheres.js?raw';
    import reflective_spheres_vert from '$lib/assets/webgl/practice_2/reflective_spheres.vert?raw';
    import reflective_spheres_frag from '$lib/assets/webgl/practice_2/reflective_spheres.frag?raw';
    import reflective_spheres_js from '$lib/assets/webgl/practice_2/reflective_spheres.js?raw';

    import edit_icon from '$lib/assets/icons/edit.svg';
    import debug_icon from '$lib/assets/icons/debug.svg';
    import { goto } from '$app/navigation';
    
    let selected_category = $state('all');

    let practice_1 = $state([
        // {
        //     vert: default_vert_shader,
        //     frag: default_frag_shader,
        //     categories: []
        // },
        {
            vert: default_vert_shader,
            frag: adhesive,
            js: passive_utime_js,
            categories: ['distortion']
        },
        // {
        //     shader: mouse,
        //     categories: ['debug']
        // },
        {
            frag: balls,
            js: passive_utime_js,
            categories: []
        },
        {
            frag: fiber,
            js: passive_utime_js,
            categories: ['distortion']
        },
        {
            frag: array,
            js: passive_utime_js,
            categories: []
        },
        {
            frag: radiant,
            js: passive_utime_js,
            categories: ['noise']
        },
        // {
        //     vert: default_vert_shader,
        //     frag: snoise,
        //     categories: ['noise']
        // }
    ]);

    let practice_2 = $state([
        // {
        //     vert: spheres_vert,
        //     frag: spheres_frag,
        //     js: spheres_js,
        //     categories: []
        // },
        {
            vert: reflective_spheres_vert,
            frag: reflective_spheres_frag,
            js: reflective_spheres_js,
            categories: ['noise']
        },
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
<HeaderWithBackButton text="Graphics"/>
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
<!-- <hr style:margin-top="1em" class="dashed"> -->
<!-- <p class="annotation">These are my personal practice of GLSL. You can try it yourself in <img class="inline-glyph" alt="Edit" src={edit_icon}/><a href="/glsl/editor">the editor</a>.</p> -->
{#if selected_category == 'debug'}
<h3>Debug</h3>
<p class="annotation">WebGL2 shaders for debugging.</p>
<div class="flex_grid gallery">
    <div class="item shader_item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={mouse}/>
    </div>
    <div class="item shader_item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={sin}/>
    </div>
    <!-- <div class="item shader_item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={snoise}/>
    </div>
    <div class="item shader_item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={balls}/>
    </div> -->
</div>
<h3>Debug (Preview mode)</h3>
<p class="annotation">WebGL2 shaders for debugging.</p>
<div class="flex_grid gallery">
    <div class="item shader_item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={mouse} mode="preview"/>
    </div>
    <div class="item shader_item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={sin} mode="preview"/>
    </div>
    <div class="item shader_item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={snoise} mode="preview"/>
    </div>
    <!-- <div class="item shader_item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={balls} mode="preview"/>
    </div> -->
</div>
{/if}

{#if practice_1.filter((practice) => {
    return selected_category =='all' || practice.categories.includes(selected_category);
}).length > 0}
<!-- <hr class="dashed"> -->
<h3>Practice One</h3>
<p class="annotation">Abstract fragment shader patterns animated over time. Some of them are interactive with mouse position. (Part of assignment one.)</p>
<div class="flex_grid gallery">
    {#each practice_1 as practice}
        {#if selected_category =='all' || practice.categories.includes(selected_category)} 
        <div class="item shader_item">
            <TapiocaFoxWebGL 
            vertex_shader={practice.vert?practice.vert:default_vert_shader} 
            fragment_shader={practice.frag}
            javascript={practice.js?practice.js:default_js}
            />
        </div>
        {/if}
    {/each}
</div>
{/if}

{#if practice_2.filter((practice) => {
    return selected_category =='all' || practice.categories.includes(selected_category);
}).length > 0}
<!-- <hr class="dashed"> -->
<h3>Practice Two</h3>
<p class="annotation">Raytracing of spheres.  Some of them are interactive with mouse position and clicks. (Part of assignment two.)</p>
<div class="flex_grid gallery">
    {#each practice_2 as practice}
        {#if selected_category =='all' || practice.categories.includes(selected_category)} 
        <div class="item shader_item">
            <TapiocaFoxWebGL vertex_shader={practice.vert} fragment_shader={practice.frag} javascript={practice.js}/>
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