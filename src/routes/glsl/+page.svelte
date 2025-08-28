<script>
    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import GlslCanvas from '$lib/components/GlslCanvas.svelte';
    import alter_green_red_frag from '$lib/assets/glsl_shaders/alter_green_red.frag?raw';
</script>
<HeaderWithBackButton text="GLSL shader"/>
<p class="annotation">Personal practice of GLSL. Try it in <a href="/glsl/editor">editor</a>.</p>
<GlslCanvas/>
<GlslCanvas fragment_shader={alter_green_red_frag}/>