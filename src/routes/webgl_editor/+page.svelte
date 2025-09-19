
<script lang="ts">
    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import TapiocaFoxWebGL from '$lib/components/TapiocaFoxWebGL.svelte';
    
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
    import { beforeNavigate, goto } from '$app/navigation';

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
    let vert_shader_src = $state(default_vert);
    let frag_shader_src = $state(default_frag);
    let js_src = $state(default_js);

    const refreshInterval = 250;

    onMount( async () => {
        const browserRenderMod = await import('@nuskey8/codemirror-lang-glsl');
        const glsl = browserRenderMod.glsl;
        
        const url_vert = page.url.searchParams.get("vert");
        if(url_vert) vert_shader_src = url_vert;
        const url_frag = page.url.searchParams.get("frag");
        if(url_frag) frag_shader_src = url_frag;
        const url_js = page.url.searchParams.get("js");
        if(url_js && url_js!=js_src) {
            const use_url_js = confirm('This url contains external JavaScript source code which can be extremely dangerous. Are you sure you want to use it?');
            if(use_url_js) js_src = url_js
        };

        // clears all query parameters
        // goto(page.url.pathname, { replaceState: true });

        const keymapExtension = keymap.of([indentWithTab]);
        const indentUnitExtension = indentUnit.of('    ');

        vertexShaderEditorView = new EditorView({
            parent: vertex_shader_editor,
            doc: vert_shader_src,
            extensions: [basicSetup, glsl(), keymapExtension, indentUnitExtension, EditorView.lineWrapping]
        })

        fragmentShaderEditorView = new EditorView({
            parent: fragment_shader_editor,
            doc: frag_shader_src,
            extensions: [basicSetup, glsl(), keymapExtension, indentUnitExtension, EditorView.lineWrapping]
        })

        javascriptEditorView = new EditorView({
            parent: javascript_editor,
            doc: js_src,
            extensions: [basicSetup, javascript(), keymapExtension, indentUnitExtension, EditorView.lineWrapping]
        })

        refreshLoop();
    });

    const refreshLoop = () => {
        run()
        setTimeout(refreshLoop, refreshInterval);
    };

    function run() {
        const vert_shader_editor_src = vertexShaderEditorView.state.doc.toString();
        if(vert_shader_editor_src!=vert_shader_src) vert_shader_src = vert_shader_editor_src;

        const frag_shader_editor_src = fragmentShaderEditorView.state.doc.toString();
        if(frag_shader_editor_src!=frag_shader_src) frag_shader_src = frag_shader_editor_src;

        const js_editor_src = javascriptEditorView.state.doc.toString();
        if(js_editor_src!=js_src) js_src = js_editor_src;
        // console.log('run');
        // console.log(vert_shader_src);
        // console.log(frag_shader_src);
    }

    const leave_message = 'Are you sure you want to leave? Changes will not be saved!';
    const selected_index = $state('view_all');

    function beforeUnload() {
        return leave_message;
    };

    beforeNavigate(({ cancel }) => {
        if (!confirm(leave_message)) {
            cancel();
        }
    });

    function setEditorValue(view: EditorView, value: string) {
        view.dispatch({
            changes: {
            from: 0,
            to: view.state.doc.length,
            insert: value
            }
        });
    }
</script>
<svelte:window on:beforeunload={beforeUnload}/>
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

    div.editor-layout > div.left > .master-container {
        display: block;
        /* width: 100%; */
    }

    div.editor-layout > div.left > .master-container :first-child {
        /* margin-top: 1rem; */
    }
    
    div.editor-layout > div.right {
        display: flex;
        flex-grow: 0;
        width: auto;
        /* overflow-y: auto; */
    }

    div.editor-layout > div.right > div.canvas-container {
        margin-top: 1em;
        top: calc(var(--main-nav-font-size) + 2*var(--main-nav-vertical-padding) + var(--page-offset) + 4px);
        position: sticky;
        /* min-width: 350px; */
        display: block;
        height: fit-content;
        width: auto;
    }
    
</style>
<HeaderWithBackButton text="WebGL Editor"/>
<Chips 
    names={['Run', 'Share', 'All', 'Vertex', 'Fragment', 'Javascript']}
    values={['run', 'share', 'view_all', 'view_vert', 'view_frag', 'view_js']}
    inline_icons={[play_icon, share_icon, eye_icon, vertex_icon, fragment_icon, javascript_icon]}
    selected_value={selected_index}
    dividers={['view_all']}
    callback={(value: any) => {
        if (value == 'run') {
            run();
            return false;
        }
        else if(value == 'share') {
            navigator.clipboard.writeText(`${page.url.origin}${page.url.pathname}?vert=${encodeURIComponent(vert_shader_src)}&frag=${encodeURIComponent(frag_shader_src)}&js=${encodeURIComponent(js_src)}`);
            alert('The URL has been copied to your clipboard!');
            return false;
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
        return true;
    }}
/>
<p class="annotation">This editor targets WebGL 2 and follows my own conventions. Open web console to see bug reports.</p>
<hr class="dashed">
<div bind:this={editor_layout} class="editor-layout">
    <div bind:this={editor_layout_left} class="left">
        <div class="master-container">
            <h3 style:display={(view_mode=='all' || view_mode=='vert')?'block':'none'}>Vertex Shader <img class="inline-glyph" src={vertex_icon}/></h3>
            <p class="annotation" style:display={(view_mode=='all' || view_mode=='vert')?'block':'none'}>To reset to default <button onclick={() => { setEditorValue(vertexShaderEditorView, default_vert); }} class="text">click here</button>.</p>
            <div 
            style:display={(view_mode=='all' || view_mode=='vert')?'block':'none'}
            bind:this={vertex_shader_editor} 
            class="editor-container">
            </div>

            <h3 style:display={(view_mode=='all' || view_mode=='frag')?'block':'none'}>Fragment Shader <img class="inline-glyph" src={fragment_icon}/></h3>
            <p class="annotation" style:display={(view_mode=='all' || view_mode=='frag')?'block':'none'}>To reset to default <button onclick={() => { setEditorValue(fragmentShaderEditorView, default_frag); }} class="text">click here</button>.</p>
            <div 
            style:display={(view_mode=='all' || view_mode=='frag')?'block':'none'}
            bind:this={fragment_shader_editor} 
            class="editor-container">
            </div>
            
            <h3 style:display={(view_mode=='all' || view_mode=='js')?'block':'none'}>JavaScript <img class="inline-glyph" src={javascript_icon}/></h3>
            <p class="annotation" style:display={(view_mode=='all' || view_mode=='js')?'block':'none'}>Be careful of what is pasted. It could be a Cross Site Scripting (XSS) attack. To reset to default <button onclick={() => { setEditorValue(javascriptEditorView, default_js); }} class="text">click here</button>.</p>
            <div 
            style:display={(view_mode=='all' || view_mode=='js')?'block':'none'}
            bind:this={javascript_editor} 
            class="editor-container">
            </div>
        </div>
    </div>
    <div bind:this={editor_layout_right} class="right">
        <div class="canvas-container">
            <TapiocaFoxWebGL mode="in-editor" size={400} vertex_shader={vert_shader_src} fragment_shader={frag_shader_src} javascript={js_src}/>
        </div>
    </div>
</div>