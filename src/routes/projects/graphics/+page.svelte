<script lang="ts">
    import Chips from '$lib/components/Chips.svelte';

    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import TapiocaFoxWebGL from '$lib/components/TapiocaFoxWebGL.svelte';
    import alter_green_red_frag from '$lib/assets/webgl/practice_1/alter_green_red.frag?raw';

    import matrix_module from '$lib/assets/webgl/modules/matrix.js?raw';
    import quadric_matrices_module from '$lib/assets/webgl/modules/quadric_matrices.js?raw';

    import default_vert_shader from '$lib/assets/webgl/default.vert?raw';
    import default_frag_shader from '$lib/assets/webgl/default.frag?raw';
    import default_modules from '$lib/assets/webgl/default_modules';
    import frame_skip_module from '$lib/assets/webgl/misc/frame_skip.js?raw';
    import passive_render_module from '$lib/assets/webgl/misc/passive_render.js?raw';
    
    import mouse from '$lib/assets/webgl/misc/mouse.frag?raw';
    import snoise from '$lib/assets/webgl/misc/snoise.frag?raw';
    import sin from '$lib/assets/webgl/misc/sin.frag?raw';
    import texture_preview_module from '$lib/assets/webgl/misc/texture_preview.js?raw';
    import texture_preview_vert from '$lib/assets/webgl/misc/texture_preview.vert?raw';
    import texture_preview_frag from '$lib/assets/webgl/misc/texture_preview.frag?raw';
    import uvmap_texture from '$lib/assets/webgl/misc/textures/uvmap_grid.jpg';
    import hl_button3_sound from '$lib/assets/webgl/misc/sounds/hl_button3.wav';

    import adhesive from '$lib/assets/webgl/practice_1/adhesive.frag?raw';
    import balls from '$lib/assets/webgl/practice_1/balls.frag?raw';
    import fiber from '$lib/assets/webgl/practice_1/fiber.frag?raw';
    import radiant from '$lib/assets/webgl/practice_1/radiant.frag?raw';
    import array from '$lib/assets/webgl/practice_1/array.frag?raw';

    import spheres_frag from '$lib/assets/webgl/practice_2/spheres.frag?raw';
    import spheres_module from '$lib/assets/webgl/practice_2/spheres.js?raw';
    import reflective_spheres_frag from '$lib/assets/webgl/practice_2/reflective_spheres.frag?raw';
    import reflective_spheres_module from '$lib/assets/webgl/practice_2/reflective_spheres.js?raw';
    import phong_reflective_spheres_frag from '$lib/assets/webgl/practice_2/phong_reflective_spheres.frag?raw';
    import phong_reflective_spheres_module from '$lib/assets/webgl/practice_2/phong_reflective_spheres.js?raw';
    import reflectice_refractive_spheres_frag from '$lib/assets/webgl/practice_2/reflective_refractive_spheres.frag?raw';
    import reflectice_refractive_spheres_module from '$lib/assets/webgl/practice_2/reflective_refractive_spheres.js?raw';
    import hl_activated_sound from '$lib/assets/webgl/practice_2/sounds/activated.wav';
    import hl_deactivated_sound from '$lib/assets/webgl/practice_2/sounds/deactivated.wav';
    
    import phong_frag from '$lib/assets/webgl/practice_2/phong.frag?raw';
    import phong_module from '$lib/assets/webgl/practice_2/phong.js?raw';
    import quadric_frag from '$lib/assets/webgl/practice_2/quadric.frag?raw';
    import quadric_module from '$lib/assets/webgl/practice_2/quadric.js?raw';
    import quadric_system_frag from '$lib/assets/webgl/practice_2/quadric_system.frag?raw';
    import quadric_system_module from '$lib/assets/webgl/practice_2/quadric_system.js?raw';

    import noise_frag from '$lib/assets/webgl/practice_3/noise.frag?raw';
    import lava_lamp_frag from '$lib/assets/webgl/practice_3/lava_lamp.frag?raw';
    import lava_lamp_module from '$lib/assets/webgl/practice_3/lava_lamp.js?raw';
    import texture_match_frag from '$lib/assets/webgl/practice_3/texture_match.frag?raw';
    import texture_match_module from '$lib/assets/webgl/practice_3/texture_match.js?raw';
    
    import simple_mesh_frag from '$lib/assets/webgl/practice_4/simple_mesh.frag?raw';
    import simple_mesh_module from '$lib/assets/webgl/practice_4/simple_mesh.js?raw';
    
    import hl_alien_blipper_sound from '$lib/assets/webgl/practice_3/sounds/alien_blipper.wav';
    import hl_alienappeal_sound from '$lib/assets/webgl/practice_3/sounds/alienappeal.wav';
    import hl_blip1_sound from '$lib/assets/webgl/practice_3/sounds/blip1.wav';
    import hl_button1_sound from '$lib/assets/webgl/practice_3/sounds/button1.wav';
    import hl_button2_sound from '$lib/assets/webgl/practice_3/sounds/button2.wav';
    import hl_industrial1_sound from '$lib/assets/webgl/practice_3/sounds/industrial1.wav';
    import hl_gman_wise_sound from '$lib/assets/webgl/practice_3/sounds/gman_wise.wav';

    import magnifier_frag from '$lib/assets/webgl/unorganized/magnifier.frag?raw';

    import edit_icon from '$lib/assets/icons/edit.svg';
    import debug_icon from '$lib/assets/icons/debug.svg';
    import { goto } from '$app/navigation';
    import type { Asset } from '$lib/components/TapiocaFoxWebGL';
    
    let selected_category = $state('all');

    type Practice = {
        vert?: string,
        frag?: string,
        modules?: Record<string, string>,
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
                    modules: {index: frame_skip_module},
                    categories: ['distortion']
                },
                {
                    frag: array,
                    modules: {index: frame_skip_module},
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
            description: 'Ray casting of spheres, phong reflection, quadric surfaces and transformations. (Part of assignment two and three.)',
            practices: [
                // {
                //     frag: spheres_frag,
                //     js: spheres_module,
                //     categories: ['raycasting']
                // },
                {
                    frag: phong_frag,
                    modules: {index: phong_module},
                    categories: ['raycasting']
                },
                // {
                //     frag: reflective_spheres_frag,
                //     js: reflective_spheres_module,
                //     assets: {
                //         'hl_deactivated': {
                //             id: 'hl_deactivated',
                //             type: 'audio',
                //             srcType: 'link',
                //             src: hl_deactivated_sound
                //         },
                //         'hl_activated': {
                //             id: 'hl_activated',
                //             type: 'audio',
                //             srcType: 'link',
                //             src: hl_activated_sound
                //         },
                //     },
                //     categories: ['noise','raycasting']
                // },
                {
                    frag: phong_reflective_spheres_frag,
                    modules: {index: phong_reflective_spheres_module},
                    assets: {
                        'hl_deactivated': {
                            id: 'hl_deactivated',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_deactivated_sound
                        },
                        'hl_activated': {
                            id: 'hl_activated',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_activated_sound
                        },
                    },
                    categories: ['noise','raycasting']
                },
                {
                    frag: reflectice_refractive_spheres_frag,
                    modules: {index: reflectice_refractive_spheres_module},
                    assets: {
                        'hl_deactivated': {
                            id: 'hl_deactivated',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_deactivated_sound
                        },
                        'hl_activated': {
                            id: 'hl_activated',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_activated_sound
                        },
                    },
                    categories: ['noise','raycasting']
                },
                // {
                //     frag: quadric_frag,
                //     js: quadric_module,
                //     categories: ['raycasting']
                // },
                {
                    frag: quadric_system_frag,
                    modules: {index: quadric_system_module, matrix: matrix_module, quadric_matrices: quadric_matrices_module},
                    assets: {
                        'hl_blip': {
                            id: 'hl_blip',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_blip1_sound
                        }
                    },
                    categories: ['raycasting']
                }
            ]
        },
        // {
        //     title: 'Practice Three',
        //     description: 'Phong reflection, quadric surfaces and transformations. (Part of assignment three.)',
        //     practices: [
                
        //     ]
        // },
        {
            title: 'Practice Three',
            description: 'Procedural texture generation. (Part of assignment four.)',
            practices: [
                {
                    frag: noise_frag,
                    categories: ['noise']
                },
                {
                    frag: lava_lamp_frag,
                    modules: {index: lava_lamp_module},
                    assets: {
                        'hl_alien_blipper': {
                            id: 'hl_alien_blipper',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_alien_blipper_sound
                        },
                        'hl_alienappeal': {
                            id: 'hl_alienappeal',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_alienappeal_sound
                        }
                    },
                    categories: ['noise']
                },
                {
                    frag: texture_match_frag,
                    modules: {index: texture_match_module, matrix: matrix_module, quadric_matrices: quadric_matrices_module},
                    assets: {
                        'hl_button1': {
                            id: 'hl_button1',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_button1_sound
                        },
                        'hl_button2': {
                            id: 'hl_button_2',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_button2_sound
                        },
                        'hl_blip1': {
                            id: 'hl_blip1',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_blip1_sound
                        }
                        ,
                        'hl_industrial1': {
                            id: 'hl_industrial1',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_industrial1_sound
                        }
                        ,
                        'hl_gman_wise': {
                            id: 'hl_gman_wise',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_gman_wise_sound
                        }
                    },
                    categories: ['noise', 'raycasting']
                }
            ]
        },
        {
            title: 'Practice Four',
            description: 'Triangles, meshes, strips and transformation matrix.',
            practices: [
                {
                    frag: simple_mesh_frag,
                    modules: {index: simple_mesh_module},
                    categories: ['mesh']
                },
            ]
        },
        {
            title: 'Unorganized',
            description: 'Things that are not organized to any cluster yet.',
            practices: [
                {
                    frag: magnifier_frag,
                    modules: {index: passive_render_module},
                    categories: ['distortion']
                },
                {
                    vert: texture_preview_vert,
                    frag: texture_preview_frag,
                    modules: {index: texture_preview_module},
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
                            src: hl_button3_sound
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
  names={['All categories', 'Noise', 'Distortion', 'Ray casting', 'Mesh', 'Debug', 'Editor']}
  inline_icons={[null, null, null, null, null, debug_icon, edit_icon, edit_icon]}
  values={['all', 'noise', 'distortion', 'raycasting', 'mesh', 'debug', 'editor']}
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
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={mouse} modules={{index: passive_render_module}}/>
    </div>
    <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={sin} modules={{index: frame_skip_module}}/>
    </div>
    <!-- <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={texture_preview_vert} fragment_shader={texture_preview_frag} modules={texture_preview_module} assets={}/>
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
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={mouse} modules={{index: passive_render_module}} mode="preview"/>
    </div>
    <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={sin} modules={{index: frame_skip_module}} mode="preview"/>
    </div>
    <div class="item webgl-item">
        <TapiocaFoxWebGL vertex_shader={default_vert_shader} fragment_shader={snoise} modules={{index: frame_skip_module}} mode="preview"/>
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
                modules={practice.modules?practice.modules:default_modules}
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