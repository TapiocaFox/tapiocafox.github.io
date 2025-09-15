<script>
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
    
    let shaders = $state([default_shader, adhesive, mouse, balls, fiber, radiant, array, snoise]);
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
<p class="annotation">These are my personal practice of GLSL. You can try it yourself in <img class="inline-glyph" alt="Edit" src={edit_icon}/><a href="/glsl/editor">the editor</a>.</p>
<div class="flex_grid" 
    style:width="100%"
    style:gap="12px"
    style:margin="1rem 0">
    {#each shaders as shader}
        <div class="item shader_item">
            <GlslCanvas fragment_shader={shader}/>
        </div>
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