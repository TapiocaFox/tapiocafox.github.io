
<script lang="ts">
    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import TapiocaFoxWebGL from '$lib/components/TapiocaFoxWebGL.svelte';
    
    import { tick } from 'svelte';
    import { EditorView, basicSetup } from "codemirror";
    import { keymap, type KeyBinding } from '@codemirror/view';
    import { indentUnit } from "@codemirror/language";
    import { javascript } from "@codemirror/lang-javascript";
    import { indentWithTab } from "@codemirror/commands";
    import { Prec, Compartment } from "@codemirror/state";
    import { linter, type Diagnostic } from "@codemirror/lint";
    import { createShaderLinter, createEvalLinter } from './linters';
    import { onMount } from 'svelte';
    import { page } from '$app/state';

    import { type Snapshot, nextSnapshot, extension } from './snapshot';
    import storage from '$lib/store'

    import version from '$lib/version';

    import reset_icon from '$lib/assets/icons/reset.svg';
    import play_icon from '$lib/assets/icons/play.svg';
    import import_icon from '$lib/assets/icons/import.svg';
    import download_icon from '$lib/assets/icons/download.svg';
    import share_icon from '$lib/assets/icons/share.svg';
    import camera_icon from '$lib/assets/icons/camera.svg';
    import delete_icon from '$lib/assets/icons/delete.svg';

    import eye_icon from '$lib/assets/icons/eye.svg';
    import vertex_icon from '$lib/assets/icons/vertex.svg';
    import fragment_icon from '$lib/assets/icons/fragment.svg';
    import javascript_icon from '$lib/assets/icons/javascript.svg';

    import default_vert from '$lib/assets/webgl/default.vert?raw';
    import default_frag from '$lib/assets/webgl/default.frag?raw';
    import default_js from '$lib/assets/webgl/default.js?raw';
    import Chips from '$lib/components/Chips.svelte';
    // import ChipsWithUrlState from '$lib/components/ChipsWithUrlState.svelte';
    import { beforeNavigate, goto } from '$app/navigation';
    import type { TapiocaFoxGLContext } from '$lib/components/TapiocaFoxGl';
    import TapiocaFoxWebGl from '$lib/components/TapiocaFoxWebGL.svelte';

    let editor_layout: HTMLDivElement;
    let editor_layout_left: HTMLDivElement;
    let editor_layout_right: HTMLDivElement;

    let vertex_shader_editor: HTMLDivElement;
    let fragment_shader_editor: HTMLDivElement;
    let javascript_editor: HTMLDivElement;

    let vertexShaderEditorView: EditorView;
    let fragmentShaderEditorView: EditorView;
    let javascriptEditorView: EditorView;

    let foxGL: TapiocaFoxGLContext;
    let importSnapshotInput: HTMLInputElement;

    const refreshInterval = 500;


    const snapshotsStorage = storage<Snapshot[]>('webgl_editor_snapshot', []);
    const viewModeStorage = storage<string>('webgl_editor_view_mode', 'all');
    const lastSnapshot = storage<Snapshot | null>('webgl_editor_last_snapshot', null);

    let view_mode = $state($viewModeStorage);
    let javascript_error = $state<string | null>(null);
    let error_message = $state<string | null>(null);
    // let view_mode = $state('js');
    // console.log('view_mode', view_mode);
    let vert_shader_src = $state(default_vert);
    let frag_shader_src = $state(default_frag);
    let js_src = $state(default_js);
    let selected_value = $state(`view_${$viewModeStorage}`);

    let mounted = $state(false);
    let anything_changed = false;

    function scrollToTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    function scrollToEditorCursor(view: EditorView) {
        if (!view) return;

        const pos = view.state.selection.main.head;

        view.dispatch({
            effects: EditorView.scrollIntoView(pos, {
            y: "center",   // center vertically
            x: "nearest",  // only scroll horizontally if needed
            }),
        });
    }

    function openSnapshotFilePicker() {
        importSnapshotInput.click();
    }


    const keymapExtension = keymap.of([indentWithTab]);
    const modS: KeyBinding["run"] = ({ state }) => {
                // console.log(state.doc.toString()); 
                snapshot();
                return true;
            }
    const modR: KeyBinding["run"] = ({ state }) => {
                reset();
                return true;
            };
    const mod1: KeyBinding["run"] = ({ state }) => {
                selected_value = 'view_all';
                view_mode = 'all';
                viewModeStorage.set('all');
                // scrollToTop();
                tick().then(() => {
                    scrollToEditorCursor(vertexShaderEditorView);
                    vertexShaderEditorView.focus();
                });
                return true;
            }
    const mod2: KeyBinding["run"] = ({ state }) => {
                selected_value = 'view_vert';
                view_mode = 'vert';
                viewModeStorage.set('vert');
                // scrollToTop();
                tick().then(() => {
                    scrollToEditorCursor(vertexShaderEditorView);
                    vertexShaderEditorView.focus();
                });
                return true;
            }
    const mod3: KeyBinding["run"] = ({ state }) => {
                selected_value = 'view_frag';
                view_mode = 'frag';
                viewModeStorage.set('frag');
                // scrollToTop();
                tick().then(() => {
                    scrollToEditorCursor(fragmentShaderEditorView);
                    fragmentShaderEditorView.focus();
                });
                return true;
            }
    const mod4: KeyBinding["run"]  = ({ state }) => {
                selected_value = 'view_js';
                view_mode = 'js';
                viewModeStorage.set('js');
                // scrollToTop();
                tick().then(() => {
                    scrollToEditorCursor(javascriptEditorView);
                    javascriptEditorView.focus();
                });
                return true;
            }
    const modKeymapExtension = Prec.highest(keymap.of([
        {
            key: "Mod-s",
            run: modS
        }, 
        {
            key: "Ctrl-s",
            run: modS
        }, 
        {
            key: "Mod-r",
            run: modR
        }, 
        {
            key: "Ctrl-r",
            run: modR
        }, 
        {
            key: "Mod-1",
            run: mod1
        }, 
        {
            key: "Ctrl-1",
            run: mod1
        }, 
        {
            key: "Mod-2",
            run: mod2
        }, 
        {
            key: "Ctrl-2",
            run: mod2
        }, 
        {
            key: "Mod-3",
            run: mod3
        }, 
        {
            key: "Ctrl-3",
            run: mod3
        }, 
        {
            key: "Mod-4",
            run: mod4
        }, 
        {
            key: "Ctrl-4",
            run: mod4
        }
    ]));
    const indentUnitExtension = indentUnit.of('    ');
    const errorLinterCompartment = new Compartment();

    const override_message = 'Are you sure you want to override your last state?';

    onMount( async () => {
        const browserRenderMod = await import('@nuskey8/codemirror-lang-glsl');
        const glsl = browserRenderMod.glsl;

        // const snapshot = $lastSnapshot;

        const url_vert = page.url.searchParams.get("vert");
        const url_frag = page.url.searchParams.get("frag");
        const url_js = page.url.searchParams.get("js");

        if((url_vert!=null || url_frag!=null || url_js!=null)) {
            if(url_vert) vert_shader_src = url_vert;
            if(url_frag) frag_shader_src = url_frag;
            if(url_js && url_js!=js_src) {
                const use_url_js = confirm('This url contains external JavaScript source code which can be extremely dangerous. Are you sure you want to use it?');
                if(use_url_js) js_src = url_js;
            };
            anything_changed = true;
            history.replaceState(history.state, '', page.url.pathname);
        }
        else if($nextSnapshot != null) {
            vert_shader_src = $nextSnapshot.vert;
            frag_shader_src = $nextSnapshot.frag;
            js_src = $nextSnapshot.js;
            anything_changed = true;
            nextSnapshot.set(null);
        }
        else if($lastSnapshot != null) {
            vert_shader_src = $lastSnapshot.vert;
            frag_shader_src = $lastSnapshot.frag;
            js_src = $lastSnapshot.js;
        }
        
        // clears all query parameters
        // goto(page.url.pathname, { replaceState: true });

        vertexShaderEditorView = new EditorView({
            parent: vertex_shader_editor,
            doc: vert_shader_src,
            extensions: [basicSetup, glsl(), 
            keymapExtension, 
            modKeymapExtension, 
            indentUnitExtension,
            EditorView.lineWrapping,
            errorLinterCompartment.of([])]
        })

        fragmentShaderEditorView = new EditorView({
            parent: fragment_shader_editor,
            doc: frag_shader_src,
            extensions: [basicSetup, glsl(), 
            keymapExtension, 
            modKeymapExtension, 
            indentUnitExtension, 
            EditorView.lineWrapping,
            errorLinterCompartment.of([])]
        })

        javascriptEditorView = new EditorView({
            parent: javascript_editor,
            doc: js_src,
            extensions: [basicSetup, 
            javascript(), 
            keymapExtension, 
            modKeymapExtension, 
            indentUnitExtension, 
            EditorView.lineWrapping,
            errorLinterCompartment.of([])]
        })

        refreshLoop();
        mounted = true;
    });

    const refreshLoop = () => {
        refresh()
        setTimeout(refreshLoop, refreshInterval);
    };


    function refresh() {
        const vert_shader_editor_src = vertexShaderEditorView.state.doc.toString();
        if(vert_shader_editor_src!=vert_shader_src) {
            clearErrors(vertexShaderEditorView);
            vert_shader_src = vert_shader_editor_src;
            anything_changed = true;
        }

        const frag_shader_editor_src = fragmentShaderEditorView.state.doc.toString();
        if(frag_shader_editor_src!=frag_shader_src) {
            clearErrors(fragmentShaderEditorView);
            frag_shader_src = frag_shader_editor_src;
            anything_changed = true;
        }

        const js_editor_src = javascriptEditorView.state.doc.toString();
        if(js_editor_src!=js_src) {
            clearErrors(javascriptEditorView);
            javascript_error = null;
            js_src = js_editor_src;
            anything_changed = true;
        }
        // console.log('run');
        // console.log(vert_shader_src);
        // console.log(frag_shader_src);
    }

    function reset() {
        foxGL?.reset();
    }

    function share() {
        navigator.clipboard.writeText(`${page.url.origin}${page.url.pathname}?vert=${encodeURIComponent(vert_shader_src)}&frag=${encodeURIComponent(frag_shader_src)}&js=${encodeURIComponent(js_src)}`);
        alert('The URL has been copied to your clipboard!');
    }

    function downloadSnapshot(snapshot: Snapshot) {
        const json = JSON.stringify(snapshot, null, 2);

        // Use a neutral "binary" type so Safari won't meddle with the extension
        const blob = new Blob([json], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${snapshot.name}.${extension}`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    function shareSnapshot(snapshot: Snapshot) {
        navigator.clipboard.writeText(`${page.url.origin}${page.url.pathname}?vert=${encodeURIComponent(snapshot.vert)}&frag=${encodeURIComponent(snapshot.frag)}&js=${encodeURIComponent(snapshot.js)}`);
        alert('The URL has been copied to your clipboard!');
    }

    function newSnapshot() {
        const newSnapshot: Snapshot = {
                name: new Date().toISOString().slice(0, 19),
                timestamp: Date.now(),
                img: foxGL.canvas.toDataURL('image/png'),
                vert: vert_shader_src,
                frag: frag_shader_src,
                js: js_src
            };
        return newSnapshot;
    }

    function snapshot() {
        snapshotsStorage.update((snapshots) => {
            return [...snapshots, newSnapshot()]; // append the new snapshot
        });
    }

    function loadSnapshot(snapshot: Snapshot) {
        const override = confirm('Are you sure? This will override the current state.');
        if(!override) return;
        
        setEditorValue(vertexShaderEditorView, snapshot.vert);
        setEditorValue(fragmentShaderEditorView, snapshot.frag);
        setEditorValue(javascriptEditorView, snapshot.js);
        // foxGL.reset();
    }

    function importSnapshot(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];

            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const snapshot: Snapshot = JSON.parse(reader.result as string);
                    loadSnapshot(snapshot);
                } catch (err) {
                    console.error("Failed to parse snapshot:", err);
                    alert(`Invalid .${extension} file`);
                }
            };
            reader.readAsText(file);
        }
    }

    function deleteSnapshot(snapshot: Snapshot) {
        // console.log('snapshot');
        // console.log(snapshot.date.getTime());
        // console.log('snapshot items');
        snapshotsStorage.update((snapshots) => {
            return snapshots.filter((snapshotItem) => {
                // console.log(snapshotItem.getTime());
                return snapshotItem.timestamp != snapshot.timestamp;
            });
        });
    }

    // const leave_message = 'Are you sure you want to leave? Changes will not be saved!';
    const leave_message = 'Do you want to save and override as the last state?';

    function beforeUnload(event: BeforeUnloadEvent) {
        // lastSnapshot.set(newSnapshot());
        // return leave_message;
        event.preventDefault();
        if (anything_changed&&confirm(leave_message)) {
            // cancel();
            lastSnapshot.set(newSnapshot());
        }
        // else {
        //     lastSnapshot.set(newSnapshot());
        // }
        
        // return null;
    };

    beforeNavigate(({ cancel }) => {
        // lastSnapshot.set(newSnapshot());
        if (anything_changed&&confirm(leave_message)) {
            // cancel();
            lastSnapshot.set(newSnapshot());
        }
        // else {
        //     lastSnapshot.set(newSnapshot());
        // }
        // lastSnapshot.set(newSnapshot());
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

    async function onGLInit(foxGL_:TapiocaFoxGLContext) {
        foxGL = foxGL_;
    }

    async function onError(type: string, error: any) {
        // console.log(error)
        // console.trace(error);

        if(type === 'vert' || type === 'frag') {
            let view: EditorView;
            if (type === "vert") {
                // error_message = `Vertex shader error: ${error}`;
                view = vertexShaderEditorView;
            }
            else if (type === "frag") {
                // error_message = `Fragment shader error: ${error}`;
                view = fragmentShaderEditorView;
            }
            else return;

            const linterExtension = createShaderLinter(error);

            view.dispatch({
                effects: errorLinterCompartment.reconfigure(linterExtension)
            });
        }
        else if(type === 'js') {
            // console.log('JavaScript Error', error);
            javascript_error = error.toString();
            // error_message = `JavaScript shader error: ${javascript_error}`;
            const linterExtension = createEvalLinter(error);

            javascriptEditorView.dispatch({
                effects: errorLinterCompartment.reconfigure(linterExtension)
            });
        }
        else console.trace(error);
    }

    async function clearErrors(view: EditorView) {
        view.dispatch({
            effects: errorLinterCompartment.reconfigure(
                linter(() => [])
            )
        });
    }

</script>
<svelte:window onbeforeunload={beforeUnload}/>
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
        top: calc(var(--main-nav-height) + var(--page-offset));
        position: sticky;
        /* min-width: 350px; */
        display: block;
        height: fit-content;
        width: auto;
    }

    div.editor-layout > div.right > div.canvas-container > div.info-container {
        display: block;
        width: 100%;
    }
    
</style>
<input type="file" accept={`.${extension},application/octet-stream`} bind:this={importSnapshotInput} onchange={importSnapshot} style="display:none"/>
<HeaderWithBackButton text="WebGL Editor"/>
<Chips
    names={['[R]eset', '[S]napshot', 'Import', 'All | 1', 'Vert | 2', 'Frag | 3', 'JS | 4']}
    values={['reset', 'snapshot', 'import', 'view_all', 'view_vert', 'view_frag', 'view_js']}
    inline_icons={[reset_icon, camera_icon, import_icon, eye_icon, vertex_icon, fragment_icon, javascript_icon]}
    bind:selected_value={selected_value}
    dividers={['view_all']}
    sticky={true}
    callback={(value: any) => {
        if (value == 'reset') {
            reset();
            return false;
        }
        else if(value == 'share') {
            share();
            return false;
        }
        else if (value == 'import') {
            openSnapshotFilePicker();
            return false;
        }
        else if (value == 'snapshot') {
            snapshot();
            return false;
        }
        else if(value == 'view_all') {
            view_mode = 'all';
            viewModeStorage.set('all');
            scrollToTop();
        }
        else if(value == 'view_vert') {
            view_mode = 'vert';
            viewModeStorage.set('vert');
            scrollToTop();
        }
        else if(value == 'view_frag') {
            view_mode = 'frag';
            viewModeStorage.set('frag');
            scrollToTop();
        }
        else if(value == 'view_js') {
            view_mode = 'js';
            viewModeStorage.set('js');
            scrollToTop();

        }
        return true;
    }}
/>
<p class="annotation">This is a simple WebGL 2 editor with a little bits of Fox's spices.</p>
<hr class="dashed" style:margin-bottom="0">
<div bind:this={editor_layout} class="editor-layout">
    <div bind:this={editor_layout_left} class="left">
        <div class="master-container">
            <h3 style:display={(view_mode=='all' || view_mode=='vert')?'block':'none'}>Vertex Shader <img class="inline-glyph" src={vertex_icon}/></h3>
            <p class="annotation" style:display={(view_mode=='all' || view_mode=='vert')?'block':'none'}>To set source to default <button onclick={() => { setEditorValue(vertexShaderEditorView, default_vert); }} class="text">click here</button>.</p>
            <div 
            style:display={(view_mode=='all' || view_mode=='vert')?'block':'none'}
            bind:this={vertex_shader_editor} 
            class="editor-container">
            </div>
            <!-- <hr class="dashed" style:display={(view_mode=='all' || view_mode=='vert')?'block':'none'}> -->

            <h3 style:display={(view_mode=='all' || view_mode=='frag')?'block':'none'}>Fragment Shader <img class="inline-glyph" src={fragment_icon}/></h3>
            <p class="annotation" style:display={(view_mode=='all' || view_mode=='frag')?'block':'none'}>To set source to default <button onclick={() => { setEditorValue(fragmentShaderEditorView, default_frag); }} class="text">click here</button>.</p>
            <div 
            style:display={(view_mode=='all' || view_mode=='frag')?'block':'none'}
            bind:this={fragment_shader_editor} 
            class="editor-container">
            </div>
            <!-- <hr class="dashed" style:display={(view_mode=='all' || view_mode=='frag')?'block':'none'}> -->
            
            <h3 style:display={(view_mode=='all' || view_mode=='js')?'block':'none'}>JavaScript <img class="inline-glyph" src={javascript_icon}/></h3>
            <p class="annotation" style:display={(view_mode=='all' || view_mode=='js')?'block':'none'}>To set source to default <button onclick={() => { setEditorValue(javascriptEditorView, default_js); }} class="text">click here</button>. Be careful of what is pasted. It could be a Cross Site Scripting (XSS) attack.</p>
            {#if javascript_error != null}
            <p class="annotation" style:color="red">{javascript_error}</p>
            {/if}
            <div 
            style:display={(view_mode=='all' || view_mode=='js')?'block':'none'}
            bind:this={javascript_editor} 
            class="editor-container">
            </div>
            <!-- <hr class="dashed" style:display={(view_mode=='all' || view_mode=='js')?'block':'none'}> -->

            <p class="annotation">Site version: ({version})</p>
        </div>
    </div>
    <div bind:this={editor_layout_right} class="right">
        <div class="canvas-container">
            {#if mounted}
            <TapiocaFoxWebGL mode="in-editor" size={400} vertex_shader={vert_shader_src} fragment_shader={frag_shader_src} javascript={js_src} onglinit={onGLInit} onerror={onError}/>
            {/if}
            <div class="info-container">
                {#if error_message != null}
                <p class="annotation" style:width="auto" style:color="red">{error_message}</p>
                {/if}
                <h3>Snapshots <img class="inline-glyph" alt="Snapshot" src={camera_icon}/></h3>
                {#if $snapshotsStorage.length == 0}
                <!-- <p class="annotation">Saved source codes will be listed here. (Ctrl+S or ⌘+S)</p> -->
                {:else}
                <table style:width="100%">
                    <tbody>
                        {#each $snapshotsStorage.toSorted((item)=>{return item.timestamp}).reverse() as snapshot}
                        <tr>
                            <td style:white-space="nowrap"><img class="inline-glyph" alt="Preview" src={snapshot.img}/>&nbsp;<button class="text" style:white-space="nowrap" onclick={() => {
                                loadSnapshot(snapshot);
                            }}>{snapshot.name}</button></td>
                            <td style:white-space="nowrap">
                                <button class="no-style" onclick={() => {
                                    downloadSnapshot(snapshot);
                                }}><img class="inline-glyph" alt="Download" src={download_icon}/></button>
                                <button class="no-style" onclick={() => {
                                    shareSnapshot(snapshot);
                                }}><img class="inline-glyph" alt="Share" src={share_icon}/></button>
                                <button class="no-style" onclick={() => {
                                    deleteSnapshot(snapshot);
                                }}><img class="inline-glyph" alt="Delete" src={delete_icon}/></button>
                            </td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
                {/if}
                <p class="annotation">Saved states will be listed here.<br>(Shortcuts: Ctrl+Key or ⌘+Key)</p>
            </div>
        </div>
    </div>
</div>