<script lang="ts">
    import Chips from '$lib/components/Chips.svelte';

    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import TapiocaFoxWebGL from '$lib/components/TapiocaFoxWebGL.svelte';
    import alter_green_red_frag from '$lib/assets/webgl/practice_1/alter_green_red.frag?raw';

    import default_vert_shader from '$lib/assets/webgl/default.vert?raw';
    import default_frag_shader from '$lib/assets/webgl/default.frag?raw';
    import default_js from '$lib/assets/webgl/default.js?raw';
    import frame_skip_js from '$lib/assets/webgl/misc/frame_skip.js?raw';
    import passive_render_js from '$lib/assets/webgl/misc/passive_render.js?raw';
    
    import mouse from '$lib/assets/webgl/misc/mouse.frag?raw';
    import snoise from '$lib/assets/webgl/misc/snoise.frag?raw';
    import sin from '$lib/assets/webgl/misc/sin.frag?raw';
    import texture_preview_js from '$lib/assets/webgl/misc/texture_preview.js?raw';
    import texture_preview_vert from '$lib/assets/webgl/misc/texture_preview.vert?raw';
    import texture_preview_frag from '$lib/assets/webgl/misc/texture_preview.frag?raw';
    import uvmap_texture from '$lib/assets/webgl/misc/textures/uvmap_grid.jpg';
    import hl_button_sound from '$lib/assets/webgl/misc/sounds/hl_button3.wav';

    import adhesive from '$lib/assets/webgl/practice_1/adhesive.frag?raw';
    import balls from '$lib/assets/webgl/practice_1/balls.frag?raw';
    import fiber from '$lib/assets/webgl/practice_1/fiber.frag?raw';
    import radiant from '$lib/assets/webgl/practice_1/radiant.frag?raw';
    import array from '$lib/assets/webgl/practice_1/array.frag?raw';

    import spheres_frag from '$lib/assets/webgl/practice_2/spheres.frag?raw';
    import spheres_js from '$lib/assets/webgl/practice_2/spheres.js?raw';
    import reflective_spheres_frag from '$lib/assets/webgl/practice_2/reflective_spheres.frag?raw';
    import reflective_spheres_js from '$lib/assets/webgl/practice_2/reflective_spheres.js?raw';
    import phong_reflective_spheres_frag from '$lib/assets/webgl/practice_2/phong_reflective_spheres.frag?raw';
    import phong_reflective_spheres_js from '$lib/assets/webgl/practice_2/phong_reflective_spheres.js?raw';
    
    
    import phong_frag from '$lib/assets/webgl/practice_3/phong.frag?raw';
    import phong_js from '$lib/assets/webgl/practice_3/phong.js?raw';
    import quadric_frag from '$lib/assets/webgl/practice_3/quadric.frag?raw';
    import quadric_js from '$lib/assets/webgl/practice_3/quadric.js?raw';
    import quadric_system_frag from '$lib/assets/webgl/practice_3/quadric_system.frag?raw';
    import quadric_system_js from '$lib/assets/webgl/practice_3/quadric_system.js?raw';

    import magnifier_frag from '$lib/assets/webgl/unorganized/magnifier.frag?raw';

    import edit_icon from '$lib/assets/icons/edit.svg';
    import debug_icon from '$lib/assets/icons/debug.svg';
    import { goto } from '$app/navigation';
    import type { Asset } from '$lib/components/TapiocaFoxGl';
    
    let selected_category = $state('all');

    type Practice = {
        vert?: string,
        frag?: string,
        js?: string,
        assets?: Record<string, Asset>,
        categories: string[]
    };

    type Cluster = {
        title: string,
        description: string,
        practices: Array<Practice>
    };

    let clusters = $state<Array<Cluster>>([
        {
            title: 'Practice One',
            description: 'Abstract fragment shader patterns animated over time. Some of them are interactive with mouse position. (Part of assignment one.)',
            practices: [
                // {
                //     vert: default_vert_shader,
                //     frag: default_frag_shader,
                //     categories: []
                // },
                {
                    frag: adhesive,
                    categories: ['distortion']
                },
                // {
                //     shader: mouse,
                //     categories: ['debug']
                // },
                {
                    frag: balls,
                    categories: []
                },
                {
                    frag: fiber,
                    js: frame_skip_js,
                    categories: ['distortion']
                },
                {
                    frag: array,
                    js: frame_skip_js,
                    categories: []
                },
                {
                    frag: radiant,
                    categories: ['noise']
                },
                // {
                //     vert: default_vert_shader,
                //     frag: snoise,
                //     categories: ['noise']
                // }
            ]
        },
        {
            title: 'Practice Two',
            description: 'Ray casting of spheres.  Some of them are interactive with mouse position and clicks. (Part of assignment two.)',
            practices: [
                {
                    frag: spheres_frag,
                    js: spheres_js,
                    categories: ['raycasting']
                },
                {
                    frag: reflective_spheres_frag,
                    js: reflective_spheres_js,
                    categories: ['noise','raycasting']
                },
                {
                    frag: phong_reflective_spheres_frag,
                    js: phong_reflective_spheres_js,
                    categories: ['noise','raycasting']
                },
            ]
        },
        {
            title: 'Practice Three',
            description: 'Phong reflection, quadric surfaces and transformations. (Part of assignment three.)',
            practices: [
                {
                    frag: phong_frag,
                    js: phong_js,
                    categories: ['raycasting']
                },
                {
                    frag: quadric_frag,
                    js: quadric_js,
                    categories: ['raycasting']
                },
                {
                    frag: quadric_system_frag,
                    js: quadric_system_js,
                    categories: ['raycasting']
                }
            ]
        },
        {
            title: 'Unorganized',
            description: 'Things that are not organized to any cluster yet.',
            practices: [
                {
                    frag: magnifier_frag,
                    js: passive_render_js,
                    categories: ['distortion']
                },
                {
                    vert: texture_preview_vert,
                    frag: texture_preview_frag,
                    js: texture_preview_js,
                    assets: {
                        'uvmap': {
                            id: 'uvmap',
                            type: 'image',
                            srcType: 'link',
                            src: uvmap_texture
                        },
                        'hl_button': {
                            id: 'hl_button',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_button_sound
                        }
                    },
                    categories: []
                }
            ]
        }
    ]);
</script>
<style>
    .webgl-item {
        border: none !important;
        display: flex;
        align-items: stretch;
        /* aspect-ratio: 1; */
    }
</style>
<HeaderWithBackButton text="Graphics"/>
<Chips 
  names={['All categories', 'Noise', 'Distortion', 'Ray casting', 'Debug', 'Editor']}
  inline_icons={[null, null, null, null, debug_icon, edit_icon, edit_icon]}
  values={['all', 'noise', 'distortion', 'raycasting', 'debug', 'editor']}
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
<!-- <p class="annotation">These are my personal practice of WebGL.</p> -->
<!-- <hr style:margin-top="1em" class="dotted"> -->
{#if selected_category == 'debug'}
<h3>Debug</h3>
<p class="annotation">WebGL2 shaders for debugging.</p>
<div class="flex_grid gallery">
    <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={mouse} javascript={passive_render_js}/>
    </div>
    <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={sin} javascript={frame_skip_js}/>
    </div>
    <!-- <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={texture_preview_vert} fragment_shader={texture_preview_frag} javascript={texture_preview_js} assets={}/>
    </div> -->
    <!-- <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={snoise}/>
    </div>
    <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={balls}/>
    </div> -->
</div>
<h3>Debug (Preview mode)</h3>
<p class="annotation">WebGL2 shaders for debugging.</p>
<div class="flex_grid gallery">
    <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={mouse} javascript={passive_render_js} mode="preview"/>
    </div>
    <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={sin} javascript={frame_skip_js} mode="preview"/>
    </div>
    <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={snoise} javascript={frame_skip_js} mode="preview"/>
    </div>
    <!-- <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={balls} mode="preview"/>
    </div> -->
</div>
{/if}

{#each clusters as cluster}
    {#if cluster.practices.filter((practice) => {
        return selected_category =='all' || practice.categories.includes(selected_category);
    }).length > 0}
    <!-- <hr class="dashed"> -->
    <h3>{cluster.title}</h3>
    <p class="annotation">{cluster.description}</p>
    <div class="flex_grid gallery">
        {#each cluster.practices as practice}
            {#if selected_category =='all' || practice.categories.includes(selected_category)} 
            <div class="item webgl-item">
                <TapiocaFoxWebGL 
                vertex_shader={practice.vert?practice.vert:default_vert_shader} 
                fragment_shader={practice.frag?practice.frag:default_frag_shader}
                javascript={practice.js?practice.js:default_js}
                assets={practice.assets?practice.assets:{}}
                />
            </div>
            {/if}
        {/each}
    </div>
    {/if}
{/each}

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