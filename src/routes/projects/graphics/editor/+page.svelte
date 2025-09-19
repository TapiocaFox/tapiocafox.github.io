<script>
    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    // import GlslEditor from 'glslEditor/build/glslEditor.js';
    import { onMount } from 'svelte';
    import { beforeNavigate } from '$app/navigation';
    import { page } from '$app/state';

    
    // console.log(frag);
    onMount(async () => {
        // Import ONLY on the client
        // const { default: GlslEditor } = await import('glslEditor/build/glslEditor.js');
        // await import('glslEditor/build/glslEditor.css');
        const frag = page.url.searchParams.get("frag");
        
        // const glslEditor = new GlslEditor('#glsl_editor', { 
        //     canvas_size: 500,
        //     canvas_draggable: true,
        //     theme: 'default',
        //     multipleBuffers: true,
        //     watchHash: true,
        //     fileDrops: true,
        //     menu: false
        // });
        // if(frag) glslEditor.open(frag);
    });

    const leave_message = 'Are you sure you want to leave? Changes will not be saved!';

    function beforeUnload() {
        return leave_message;
    };

    beforeNavigate(async function name({ to, cancel }) {
        const leave_or_not = confirm(leave_message);
        if(!leave_or_not) cancel();
    });
</script>
<svelte:window on:beforeunload={beforeUnload}/>
<!-- <style>
    @import '../glsl.css';
</style> -->
<HeaderWithBackButton text="GLSL Editor"/>
<p class="annotation">The editor is from <a href="https://github.com/patriciogonzalezvivo/glslEditor" target="_blank">patriciogonzalezvivo/glslEditor</a>.</p>
<!-- <canvas class="glsl">Your browser does not seem to support HTML canvas.</canvas> -->
<div id="glsl_editor"></div>