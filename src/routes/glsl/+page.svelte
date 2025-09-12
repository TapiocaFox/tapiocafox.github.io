<script>
    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import GlslCanvas from '$lib/components/GlslCanvas.svelte';
    import alter_green_red_frag from '$lib/assets/glsl_shaders/alter_green_red.frag?raw';

    import sin from '$lib/assets/glsl_shaders/sin.frag?raw';
    import mouse from '$lib/assets/glsl_shaders/mouse.frag?raw';
    import adhesive from '$lib/assets/glsl_shaders/adhesive.frag?raw';
    import balls from '$lib/assets/glsl_shaders/balls.frag?raw';
    import fiber from '$lib/assets/glsl_shaders/fiber.frag?raw';
    import radiate from '$lib/assets/glsl_shaders/radiate.frag?raw';

    import edit_icon from '$lib/assets/icons/edit.svg';
    
</script>
<HeaderWithBackButton text="GLSL shader"/>
<p class="annotation">These are my personal practice of GLSL. You can try it yourself in <img class="inline-glyph" alt="Edit" src={edit_icon}/><a href="/glsl/editor">the editor</a>.</p>
<GlslCanvas/>
<!-- <GlslCanvas fragment_shader={alter_green_red_frag}/> -->
<!-- <GlslCanvas fragment_shader={shader_toy_demo}/> -->
<GlslCanvas fragment_shader={adhesive}/>
<!-- <GlslCanvas fragment_shader={sin}/> -->
<GlslCanvas fragment_shader={mouse}/>
<GlslCanvas fragment_shader={balls}/>
<GlslCanvas fragment_shader={fiber}/>
<GlslCanvas fragment_shader={radiate}/>
<p class="annotation compact">Some of them are interactable with the mouse. I like to "vibe code" shaders with my <a href="https://music.apple.com/us/playlist/psychedelic/pl.u-r2yBAdYCAMeYoe" target="_blank">music playlist</a>.</p>