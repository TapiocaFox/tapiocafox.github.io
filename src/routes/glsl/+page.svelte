<script>
    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import GlslCanvas from '$lib/components/GlslCanvas.svelte';
    import alter_green_red_frag from '$lib/assets/glsl_shaders/alter_green_red.frag?raw';
    import shader_toy_demo from '$lib/assets/glsl_shaders/shader_toy_demo.frag?raw';

    import sin from '$lib/assets/glsl_shaders/sin.frag?raw';
    import mouse from '$lib/assets/glsl_shaders/mouse.frag?raw';
    import abstract from '$lib/assets/glsl_shaders/abstract.frag?raw';
    import balls from '$lib/assets/glsl_shaders/balls.frag?raw';

    import edit_icon from '$lib/assets/icons/edit.svg';
    
</script>
<HeaderWithBackButton text="GLSL shader"/>
<p class="annotation">Personal practice of GLSL. Try it in <img class="inline-icon" alt="Edit" src={edit_icon}/><a href="/glsl/editor">editor</a>.</p>
<GlslCanvas/>
<!-- <GlslCanvas fragment_shader={alter_green_red_frag}/> -->
<!-- <GlslCanvas fragment_shader={shader_toy_demo}/> -->
<GlslCanvas fragment_shader={abstract}/>
<GlslCanvas fragment_shader={sin}/>
<GlslCanvas fragment_shader={mouse}/>
<GlslCanvas fragment_shader={balls}/>
<p class="annotation">My <a href="https://music.apple.com/us/playlist/psychedelic/pl.u-r2yBAdYCAMeYoe" target="_blank">Music</a> playlist to match the shader coding vibe.</p>