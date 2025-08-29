<script>
    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import GlslCanvas from '$lib/components/GlslCanvas.svelte';
    import alter_green_red_frag from '$lib/assets/glsl_shaders/alter_green_red.frag?raw';
    import shader_toy_demo from '$lib/assets/glsl_shaders/shader_toy_demo.frag?raw';
    
</script>
<HeaderWithBackButton text="GLSL shader"/>
<p class="annotation">Personal practice of GLSL. Try it in <a href="/glsl/editor">editor</a>.</p>
<GlslCanvas/>
<GlslCanvas fragment_shader={alter_green_red_frag}/>
<GlslCanvas fragment_shader={shader_toy_demo}/>
<p class="annotation">The third one is <a href="https://www.shadertoy.com/view/XsXGRS" target="_blank">The Blob</a> from shadertoy. (Using it to see if GLSL uniforms in three.js is translatable.)</p>