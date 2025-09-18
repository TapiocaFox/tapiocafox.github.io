
<script lang="ts">
    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import GlslCanvasGl2 from '$lib/components/GlslCanvasGL2.svelte';
    
    import { EditorView, basicSetup } from "codemirror";
    import { keymap } from '@codemirror/view';
    import { indentUnit } from "@codemirror/language";
    import { javascript } from "@codemirror/lang-javascript";
    import { indentWithTab } from "@codemirror/commands";
    import { onMount } from 'svelte';
    import { page } from '$app/state';

    import play_icon from '$lib/assets/icons/play.svg';
    import share_icon from '$lib/assets/icons/share.svg';

    import eye_icon from '$lib/assets/icons/eye.svg';
    import vertex_icon from '$lib/assets/icons/vertex.svg';
    import fragment_icon from '$lib/assets/icons/fragment.svg';
    import javascript_icon from '$lib/assets/icons/javascript.svg';

    import default_vert from '$lib/assets/webgl/default.vert?raw';
    import default_frag from '$lib/assets/webgl/default.frag?raw';
    import default_js from '$lib/assets/webgl/default.js?raw';
    import Chips from '$lib/components/Chips.svelte';

    let editor_layout: HTMLDivElement;
    let editor_layout_left: HTMLDivElement;
    let editor_layout_right: HTMLDivElement;

    let vertex_shader_editor: HTMLDivElement;
    let fragment_shader_editor: HTMLDivElement;
    let javascript_editor: HTMLDivElement;

    let vertexShaderEditorView: EditorView;
    let fragmentShaderEditorView: EditorView;
    let javascriptEditorView: EditorView;

    let view_mode = $state('all');
    let vert_shader_src = $state('');
    let frag_shader_src = $state('');
    let js_src = $state('');

    onMount(async () => {
        const browserRenderMod = await import('@nuskey8/codemirror-lang-glsl');
        const glsl = browserRenderMod.glsl;

        vert_shader_src = page.url.searchParams.get("vert") || default_vert;
        frag_shader_src = page.url.searchParams.get("frag") || default_frag;
        js_src = page.url.searchParams.get("js") || default_js;

        const keymapExtension = keymap.of([indentWithTab]);
        const indentUnitExtension = indentUnit.of('    ');

        vertexShaderEditorView = new EditorView({
            parent: vertex_shader_editor,
            doc: vert_shader_src,
            extensions: [basicSetup, glsl(), keymapExtension, indentUnitExtension]
        })

        fragmentShaderEditorView = new EditorView({
            parent: fragment_shader_editor,
            doc: frag_shader_src,
            extensions: [basicSetup, glsl(), keymapExtension, indentUnitExtension]
        })

        javascriptEditorView = new EditorView({
            parent: javascript_editor,
            doc: js_src,
            extensions: [basicSetup, javascript(), keymapExtension, indentUnitExtension]
        })
    });

    function run() {
        vert_shader_src = vertexShaderEditorView.state.doc.toString();
        frag_shader_src = fragmentShaderEditorView.state.doc.toString();
        console.log('run');
        // console.log(vert_shader_src);
        // console.log(frag_shader_src);
    }

</script>
<style>
    div.editor-layout {
        display: flex;
        gap: 1em;
    }

    div.editor-layout > div.left {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }

    div.editor-layout > div.left > .editor-container {
        display: inline-block;
        position: relative;
        width: 100%;
    }
    
    div.editor-layout > div.right {
        display: flex;
        width: auto;
    }

    div.editor-layout > div.right > div.canvas-container {
        margin-top: 0;
        height: auto;
        width: auto;
    }
    
</style>
<HeaderWithBackButton text="WebGL Editor"/>
<Chips 
    names={['Run', 'Share', 'All', 'Vertex', 'Fragment', 'Javascript']}
    values={['run', 'share', 'view_all', 'view_vert', 'view_frag', 'view_js']}
    inline_icons={[play_icon, share_icon, eye_icon, vertex_icon, fragment_icon, javascript_icon]}
    dividers={['view_all']}
    selectable={false}
    callback={(value: any) => {
        if (value == 'run') {
            run();
        }
        else if(value == 'view_all') {
            view_mode = 'all';
        }
        else if(value == 'view_vert') {
            view_mode = 'vert';
        }
        else if(value == 'view_frag') {
            view_mode = 'frag';
        }
        else if(value == 'view_js') {
            view_mode = 'js';
        }
    }}
/>
<p class="annotation">This editor is targeting WebGL 2, following my own convention.</p>

<div bind:this={editor_layout} class="editor-layout">
    <div bind:this={editor_layout_left} class="left">
        <h3 style:display={(view_mode=='all' || view_mode=='vert')?'inline-block':'none'}>Vertex Shader</h3>
        <div 
        style:display={(view_mode=='all' || view_mode=='vert')?'inline-block':'none'}
        bind:this={vertex_shader_editor} 
        class="editor-container">
        </div>

        <h3 style:display={(view_mode=='all' || view_mode=='frag')?'inline-block':'none'}>Fragment Shader</h3>
        <div 
        style:display={(view_mode=='all' || view_mode=='frag')?'inline-block':'none'}
        bind:this={fragment_shader_editor} 
        class="editor-container">
        </div>
        
        <h3 style:display={(view_mode=='all' || view_mode=='js')?'inline-block':'none'}>JavaScript</h3>
        <div 
        style:display={(view_mode=='all' || view_mode=='js')?'inline-block':'none'}
        bind:this={javascript_editor} 
        class="editor-container">
        </div>

    </div>
    <div bind:this={editor_layout_right} class="right">
        <div class="canvas-container">
            <GlslCanvasGl2 mode="in-editor" size={400} vertex_shader={vert_shader_src} fragment_shader={frag_shader_src}/>
        </div>
    </div>
</div>