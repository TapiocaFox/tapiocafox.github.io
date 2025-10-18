
<script lang="ts">
    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
    import TapiocaFoxWebGL from '$lib/components/TapiocaFoxWebGL.svelte';
    import PointerBlock from '$lib/components/PointerBlock.svelte';
    import WindowBlock from '$lib/components/WindowBlock.svelte';
	import EndingDecoration from '$lib/components/EndingDecoration.svelte';
    import Tabs from '$lib/components/Tabs.svelte';

    import { tick } from 'svelte';
    import { dev } from '$app/environment';
    import { EditorView, basicSetup } from "codemirror";
    import { searchKeymap } from "@codemirror/search";
    import { keymap, ViewPlugin, ViewUpdate, type KeyBinding } from '@codemirror/view';
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

    import reset_icon from '$lib/assets/icons/reset.svg';
    import info_icon from '$lib/assets/icons/info.svg';
    import shapes_icon from '$lib/assets/icons/shapes.svg';
    import import_icon from '$lib/assets/icons/import.svg';
    import download_icon from '$lib/assets/icons/download.svg';
    import new_module_tab_icon from '$lib/assets/icons/window.svg';
    import load_icon from '$lib/assets/icons/load.svg';
    import camera_icon from '$lib/assets/icons/camera.svg';
    import delete_icon from '$lib/assets/icons/delete.svg';
    import main_icon from '$lib/assets/icons/main.svg';
    import picture_icon from '$lib/assets/icons/picture.svg';
    import box_icon from '$lib/assets/icons/box.svg';
    import doc_icon from '$lib/assets/icons/document.svg';
    import upload_icon from '$lib/assets/icons/upload.svg';
    import close_icon from '$lib/assets/icons/close.svg';
    import music_icon from '$lib/assets/icons/music.svg';
    import video_icon from '$lib/assets/icons/video.svg';
    import add_icon from '$lib/assets/icons/add.svg';
    import api_icon from '$lib/assets/icons/api.svg';
    import edit_icon from '$lib/assets/icons/edit.svg';
    import bookmark_icon from '$lib/assets/icons/bookmark.svg';

    import vertex_icon from '$lib/assets/icons/vertex.svg';
    import fragment_icon from '$lib/assets/icons/fragment.svg';
    import javascript_icon from '$lib/assets/icons/javascript.svg';

    import default_vert from '$lib/assets/webgl/default.vert?raw';
    import default_frag from '$lib/assets/webgl/default.frag?raw';
    import default_modules from '$lib/assets/webgl/default_modules';
    import empty_module from '$lib/assets/webgl/modules/empty.js?raw';
    import Chips from '$lib/components/Chips.svelte';
    import { beforeNavigate, goto } from '$app/navigation';
    import type { TapiocaFoxGLContext } from '$lib/components/TapiocaFoxGLContext';
    import type { Snippet } from './snippet';

    import TapiocaFoxGLContextRaw from '$lib/components/TapiocaFoxGLContext.ts?raw';
    import type { Asset, ModuleSource } from '$lib/components/TapiocaFoxWebGL';
    import { default_module } from '$lib/components/TapiocaFoxWebGL';

    let vertex_shader_editor: HTMLDivElement;
    let fragment_shader_editor: HTMLDivElement;
    let module_editors: Record<string, HTMLDivElement> = {};
    
    let vertexShaderEditorView: EditorView;
    let fragmentShaderEditorView: EditorView;
    let moduleEditorViews: Record<string, EditorView> = {};

    let foxGL: TapiocaFoxGLContext;
    let importSnapshotInput: HTMLInputElement;

    const refreshInterval = 500;

    const {store: snapshotsStorage, ready: snapshotsStorageReady} = storage<Snapshot[]>('webgl_editor_snapshots', []);
    const {store: viewModeStorage} = storage<string>('webgl_editor_view_mode', 'modules');
    const {store: lastSnapshot, ready: lastSnapshotReady} = storage<Snapshot | null>('webgl_editor_last_snapshot', null);
    const {store: snapshotInNewTab, ready: snapshotInNewTabReady} = storage<Snapshot | null>('webgl_editor_snapshot_in_new_tab', null);

    const {store: vertexShaderSnippets} = storage<Snippet[]>('webgl_editor_vert_snippets', []);
    const {store: fragmentShaderSnippets} = storage<Snippet[]>('webgl_editor_frag_snippets', []);
    const {store: moduleSnippets} = storage<Snippet[]>('webgl_editor_module_snippets', []);

    let view_mode = $derived($viewModeStorage);
    let any_module_error = $state<any | null>(null);
    let error_message = $state<string | null>(null);
    let vert_shader_src = $state(default_vert);
    let frag_shader_src = $state(default_frag);
    let modules_src = $state<Record<string, string>>(default_modules);
    let assets = $state<Record<string, Asset>>({});
    let selected_value = $derived(`view_${$viewModeStorage}`);

    let mounted = $state(false);
    let show_foxgl_interface = $state(false);
    let show_snippets = $state(false);
    let snippets_type = $state('modules');
    let snippet_tabs_selected_value = $state('saved');
    let show_asset_configuration_dialog = $state(false);
    let anything_changed = false;

    let accumalated_tabs = 0;

    // Vertex shader tabs.
    let vertex_shader_tab_selected_value = $state('index');
    let vertex_shader_tab_names = $state(['index']);
    let vertex_shader_tab_values = $derived(['index']);
    let vertex_shader_tab_icons = $derived([main_icon]);
    let vertex_shader_tab_closable_list = $derived([false]);

    let vertex_shader_functional_tab_names = $derived((vertex_shader_tab_selected_value=='index')?['Default', 'Snippets | B']:['Rename', 'Default', 'Snippets | B']);
    let vertex_shader_functional_tab_values = $derived((vertex_shader_tab_selected_value=='index')?['reset', 'snippets']:['rename', 'reset', 'snippets']);
    let vertex_shader_functional_tab_icons = $derived((vertex_shader_tab_selected_value=='index')?[reset_icon, bookmark_icon]:[edit_icon, reset_icon, bookmark_icon]);

    // Fragment shader tabs.
    let fragment_shader_tab_selected_value = $state('index');
    let fragment_shader_tab_names = $state(['index']);
    let fragment_shader_tab_values = $derived(['index']);
    let fragment_shader_tab_icons = $derived([main_icon]);
    let fragment_shader_tab_closable_list = $derived([false]);

    let fragment_shader_functional_tab_names = $derived((fragment_shader_tab_selected_value=='index')?['Default', 'Snippets | B']:['Rename', 'Default', 'Snippets | B']);
    let fragment_shader_functional_tab_values = $derived((fragment_shader_tab_selected_value=='index')?['reset', 'snippets']:['rename', 'reset', 'snippets']);
    let fragment_shader_functional_tab_icons = $derived((fragment_shader_tab_selected_value=='index')?[reset_icon, bookmark_icon]:[edit_icon, reset_icon, bookmark_icon]);

    // Module tabs.
    let module_tab_selected_value = $state(default_module);
    let module_tab_names = $derived(Object.keys(modules_src));
    let module_tab_values = $derived(Object.keys(modules_src));
    let module_tab_icons = $derived(Object.keys(modules_src).map(key => key === default_module ? main_icon : box_icon));
    let module_tab_closable_list = $derived(Object.keys(modules_src).map(key => key !== default_module));

    let module_functional_tab_names = $derived((module_tab_selected_value==default_module)?['New', 'Default', 'Snippets | B', 'API']:['New', 'Rename', 'Default', 'Snippets | B', 'API']);
    let module_functional_tab_values = $derived((module_tab_selected_value==default_module)?['new_module', 'reset', 'snippets', 'api']:['new_module', 'rename', 'reset', 'snippets', 'api']);
    let module_functional_tab_icons = $derived((module_tab_selected_value==default_module)?[add_icon, reset_icon, bookmark_icon, api_icon]:[add_icon, edit_icon, reset_icon, bookmark_icon, api_icon]);

    module_tab_selected_value = default_module;


    // Assets tabs.
    let assets_tab_selected_value = $state('all');

    import colored_mesh_vert from '$lib/assets/webgl/shaders/colored_mesh.vert?raw';
    import colored_mesh_frag from '$lib/assets/webgl/shaders/colored_mesh.frag?raw';
    
    import default_index_module from '$lib/assets/webgl/default.js?raw';
    import frameskip_renderer_index_module from '$lib/assets/webgl/modules/frameskip_renderer_index.js?raw';
    import passive_renderer_index_module from '$lib/assets/webgl/modules/passive_renderer_index.js?raw';
    import colored_mesh_index_module from '$lib/assets/webgl/modules/colored_mesh_index.js?raw';
    
    import matrix_module from '$lib/assets/webgl/modules/matrix.js?raw';
    import geometry_module from '$lib/assets/webgl/modules/geometry.js?raw';
    import mesh_module from '$lib/assets/webgl/modules/mesh.js?raw';
    import quadric_matrices_module from '$lib/assets/webgl/modules/quadric_matrices.js?raw';

    import matrix_icon from '$lib/assets/icons/matrix.svg';
    import triangle_icon from '$lib/assets/icons/triangle.svg';
    import math_icon from '$lib/assets/icons/math.svg';

    const predefined_vertex_shader_snippets: Snippet[] = [
        {
            name: "Default Vertex Shader",
            module_name: "index",
            icon: vertex_icon,
            module_code: default_vert
        },
        {
            name: "Colored Mesh",
            module_name: "index",
            icon: vertex_icon,
            module_code: colored_mesh_vert
        },
    ];

    const predefined_fragment_shader_snippets: Snippet[] = [
        {
            name: "Default Fragment Shader",
            module_name: "index",
            icon: fragment_icon,
            module_code: default_frag
        },
        {
            name: "Colored Mesh",
            module_name: "index",
            icon: fragment_icon,
            module_code: colored_mesh_frag
        },
    ];

    const predefined_module_snippets: Snippet[] = [
        {
            name: "Default Index (Shader)",
            module_name: "index",
            icon: main_icon,
            module_code: default_index_module
        },
        {
            name: "Frameskip Renderer Index (Shader)",
            module_name: "index",
            icon: main_icon,
            module_code: frameskip_renderer_index_module
        },
        {
            name: "Passive Renderer Index (Shader)",
            module_name: "index",
            icon: main_icon,
            module_code: passive_renderer_index_module
        },
        {
            name: "Colored Mesh Index (Mesh)",
            module_name: "index",
            icon: main_icon,
            module_code: colored_mesh_index_module
        },
        {
            name: "Matrix",
            module_name: "matrix",
            icon: matrix_icon,
            module_code: matrix_module
        },
        {
            name: "Geometry",
            module_name: "geometry",
            icon: triangle_icon,
            module_code: geometry_module
        },
        {
            name: "Mesh",
            module_name: "mesh",
            icon: vertex_icon,
            module_code: mesh_module
        },
        {
            name: "Quadric Matrices",
            module_name: "quadric_matrices",
            icon: math_icon,
            module_code: quadric_matrices_module
        },
    ];

    $effect(() => {
        if(!mounted) return;
        // Remove obsolete editors.
        const modules_in_src = Object.keys(modules_src);
        const modules_in_editor_views = Object.keys(moduleEditorViews);
        
        const modules_not_in_editor_views = modules_in_src.filter(x => !modules_in_editor_views.includes(x));
        const modules_not_in_src = modules_in_editor_views.filter(x => !modules_in_src.includes(x));

        modules_not_in_src.forEach((module: string) => {
            moduleEditorViews[module].destroy();
            delete moduleEditorViews[module];
            delete module_editors[module];
        });

        modules_not_in_editor_views.forEach((module: string) => {
            const moduleEditorView = new EditorView({
                parent: module_editors[module],
                doc: modules_src[module],
                extensions: [basicSetup, 
                javascript(), 
                keymapExtension, 
                modKeymapExtension, 
                indentUnitExtension, 
                EditorView.lineWrapping,
                errorLinterCompartment.of([]),
                outlineTheme]
            })
            moduleEditorViews[module] = moduleEditorView;
        });

        for(let key in moduleEditorViews) {
            const moduleEditorView = moduleEditorViews[key];
            const module_editor_src = moduleEditorView.state.doc.toString();
            if(module_editor_src!=modules_src[key]) {
                clearErrors(moduleEditorView);
                setEditorValue(moduleEditorView, modules_src[key]);
            }
        }

        if(modules_src[module_tab_selected_value]==null) module_tab_selected_value = default_module;
        // console.log(`module_tab_values: ${module_tab_values}`);
    });

    const on_close = async (value: string) => {
        const closeOrNot = confirm(`Delete module "${value}"?`);
        if (closeOrNot) {
            modules_src = (({ [value]: _, ...rest }) => rest)(modules_src);
            await tick(); // Workaround for weird bugs that make the derived state omit the rest of the keys after index.
            modules_src = { ...modules_src };
        }
        return closeOrNot;
    };

    const new_module = (module_name: string | null = null, module_code: string=empty_module) => {
        const names = Object.keys(modules_src);
        accumalated_tabs = names.length;
        let default_name = `module ${accumalated_tabs+1}`;
        while(names.includes(default_name)) {
            accumalated_tabs += 1;
            default_name = `module ${accumalated_tabs+1}`;
        }
        if(module_name==null)
            module_name = prompt("Please enter a module name.", default_name) || default_name;
        if(names.includes(module_name)) {
            if(!confirm(`Module with name "${module_name}" already exists. Do you want to replace it?`))
                return;
        }
        modules_src = { ...modules_src, [module_name]: module_code };
        any_module_error = null;
        anything_changed = true;
    };

    const open_snippets = (type: string) => {
        // alert('Feature not implemented yet.');
        show_snippets = !show_snippets;
        snippets_type = type;
    };

    const reset_modules = () => {
        const resetOrNot = confirm('Are you sure? This will remove every JavaScript modules and reset it to default.');
        if(!resetOrNot) return;
        modules_src = default_modules;
        any_module_error = null;
        module_tab_selected_value = Object.entries(modules_src)[0][0];
    };

    const on_vertex_shader_tab_functional = (value: string) => {
        if(value=='reset') {
            setEditorValue(vertexShaderEditorView, default_vert);
        }
        else if(value=='snippets') {
            open_snippets('vert');
        }
    };

    const on_fragment_shader_tab_functional = (value: string) => {
        if(value=='reset') {
            setEditorValue(fragmentShaderEditorView, default_frag);
        }
        else if(value=='snippets') {
            open_snippets('frag');
        }
    };

    const on_module_tab_functional = (value: string) => {
        if(value=='new_module') {
            new_module()
        }
        else if(value=='reset') {
            reset_modules();
        }
        else if(value=='rename') {
            let new_module_name = prompt("Please enter new module name.", module_tab_selected_value) || module_tab_selected_value;
            if(new_module_name == module_tab_selected_value) return;
            modules_src = {
                ...modules_src,
                [new_module_name]: modules_src[module_tab_selected_value]
            };
            delete modules_src[module_tab_selected_value];
            modules_src = { ...modules_src };
            module_tab_selected_value = new_module_name;
        }
        else if(value=='snippets') {
            open_snippets('modules');
        }
        else if(value=='api') {
            show_foxgl_interface=!show_foxgl_interface;
        }
    };

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
    const runSnapshot: KeyBinding["run"] = ({ state }) => {
                snapshot();
                return true;
            }
    const runReset: KeyBinding["run"] = ({ state }) => {
                reset();
                return true;
            };
    const runAllView: KeyBinding["run"] = ({ state }) => {
                selected_value = 'view_all';
                view_mode = 'all';
                viewModeStorage.set('all');
                tick().then(() => {
                    scrollToEditorCursor(vertexShaderEditorView);
                    vertexShaderEditorView.focus();
                });
                return true;
            }
    const runVertexView: KeyBinding["run"] = ({ state }) => {
                selected_value = 'view_vert';
                view_mode = 'vert';
                snippets_type = 'vert';
                viewModeStorage.set('vert');
                tick().then(() => {
                    scrollToEditorCursor(vertexShaderEditorView);
                    vertexShaderEditorView.focus();
                });
                return true;
            }
    const runFragmentView: KeyBinding["run"] = ({ state }) => {
                selected_value = 'view_frag';
                view_mode = 'frag';
                snippets_type = 'frag';
                viewModeStorage.set('frag');
                tick().then(() => {
                    scrollToEditorCursor(fragmentShaderEditorView);
                    fragmentShaderEditorView.focus();
                });
                return true;
            }
    const runJavaScriptView: KeyBinding["run"]  = ({ state }) => {
                selected_value = 'view_modules';
                view_mode = 'modules';
                snippets_type = 'modules';
                viewModeStorage.set('modules');
                tick().then(() => {
                    scrollToEditorCursor(moduleEditorViews[module_tab_selected_value]);
                    moduleEditorViews[module_tab_selected_value].focus();
                });
                return true;
            }

    const runNewModule: KeyBinding["run"]  = ({ state }) => {
            new_module();
            return true;
        }

    const runSnippets: KeyBinding["run"]  = ({ state }) => {
            open_snippets(view_mode);
            return true;
        }

    const runSaveLastState: KeyBinding["run"]  = ({ state }) => {
            saveLastState();
            return true;
        }

    const modKeymapExtension = Prec.highest(keymap.of([
        {
            key: "Mod-s",
            run: runSnapshot
        }, 
        {
            key: "Ctrl-s",
            run: runSnapshot
        }, 
        {
            key: "Mod-Shift-s",
            run: runSaveLastState
        }, 
        {
            key: "Ctrl-Shift-s",
            run: runSaveLastState
        }, 
        {
            key: "Mod-r",
            run: runReset
        }, 
        {
            key: "Ctrl-r",
            run: runReset
        }, 
        {
            key: "Mod-1",
            run: runVertexView
        }, 
        {
            key: "Ctrl-1",
            run: runVertexView
        }, 
        {
            key: "Mod-2",
            run: runFragmentView
        }, 
        {
            key: "Ctrl-2",
            run: runFragmentView
        }, 
        {
            key: "Mod-3",
            run: runJavaScriptView
        }, 
        {
            key: "Ctrl-3",
            run: runJavaScriptView
        }, 
        {
            key: "Mod-0",
            run: runAllView
        }, 
        {
            key: "Ctrl-0",
            run: runAllView
        },
        {
            key: "Mod-b",
            run: runSnippets
        }, 
        {
            key: "Ctrl-b",
            run: runSnippets
        },
    ]));
    const outlineTheme = EditorView.theme({
        "&": {
            outline: "1px dotted var(--border-color);",
        },
        "&.cm-focused": {
            outline: "1px dotted var(--fox-background-color);",
        }
    });
    const indentUnitExtension = indentUnit.of('    ');
    const errorLinterCompartment = new Compartment();

    // const override_message = 'Are you sure you want to override your last state?';

    onMount( async () => {
        const browserRenderMod = await import('@nuskey8/codemirror-lang-glsl');
        await lastSnapshotReady;
        await snapshotInNewTabReady;
        await snapshotsStorageReady;
        const glsl = browserRenderMod.glsl;

        if($nextSnapshot != null) {
            const snapshot: Snapshot = $nextSnapshot;
            vert_shader_src = snapshot.vert;
            frag_shader_src = snapshot.frag;
            modules_src = snapshot.modules;
            assets = snapshot.assets||{};
            anything_changed = true;
            nextSnapshot.set(null);
        }
        else if($snapshotInNewTab != null) {
            const snapshot: Snapshot = $snapshotInNewTab;
            vert_shader_src = snapshot.vert;
            frag_shader_src = snapshot.frag;
            modules_src = snapshot.modules;
            assets = snapshot.assets||{};
            anything_changed = true;
            snapshotInNewTab.set(null);
        }
        else if($lastSnapshot != null) {
            vert_shader_src = $lastSnapshot.vert;
            frag_shader_src = $lastSnapshot.frag;
            modules_src = $lastSnapshot.modules;
            assets = $lastSnapshot.assets||{};
        }
        
        vertexShaderEditorView = new EditorView({
            parent: vertex_shader_editor,
            doc: vert_shader_src,
            extensions: [basicSetup, glsl(), 
            keymapExtension, 
            modKeymapExtension,
            EditorView.lineWrapping,
            errorLinterCompartment.of([]),
            outlineTheme],
        })

        fragmentShaderEditorView = new EditorView({
            parent: fragment_shader_editor,
            doc: frag_shader_src,
            extensions: [basicSetup, glsl(), 
            keymapExtension, 
            modKeymapExtension, 
            indentUnitExtension, 
            EditorView.lineWrapping,
            errorLinterCompartment.of([]),
            outlineTheme]
        })
        
        mounted = true;
        await tick();
        refreshLoop();
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

        let clear_any_module_error = false;
        for(let key in moduleEditorViews) {
            const moduleEditorView = moduleEditorViews[key];
            const module_editor_src = moduleEditorView.state.doc.toString();
            if(module_editor_src!=modules_src[key]) {
                clear_any_module_error = true;
                clearErrors(moduleEditorView);
                modules_src = { ...modules_src, [key]: module_editor_src };
                anything_changed = true;
            }
        }

        if(clear_any_module_error) {
            any_module_error = null;
        }
    }

    function reset() {
        foxGL?.reset();
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

    function newSnapshot() {
        const newSnapshot: Snapshot = {
                name: new Date().toISOString().slice(0, 19),
                timestamp: Date.now(),
                img: foxGL.canvas.toDataURL('image/png'),
                vert: vert_shader_src,
                frag: frag_shader_src,
                modules: JSON.parse(JSON.stringify(modules_src)),
                assets: JSON.parse(JSON.stringify(assets)),
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
        modules_src = snapshot.modules||default_modules;
        assets = snapshot.assets||{};
        anything_changed = true;
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
        snapshotsStorage.update((snapshots) => {
            return snapshots.filter((snapshotItem) => {
                return snapshotItem.timestamp != snapshot.timestamp;
            });
        });
    }

    function saveLastState() {
        lastSnapshot.set(newSnapshot());
            anything_changed = false;
    }

    // const leave_message = 'Are you sure you want to leave? Changes will not be saved!';
    const leave_message = 'Do you want to save and override as the last state? So the current state will be restored in the next time.';

    function beforeUnload(event: BeforeUnloadEvent) {
        event.preventDefault();
        if (anything_changed&&confirm(leave_message)) {
            saveLastState();
        }
    };

    beforeNavigate(({ cancel }) => {
        if (anything_changed&&confirm(leave_message)) {
            saveLastState()
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

    async function onGLInit(foxGL_:TapiocaFoxGLContext) {
        foxGL = foxGL_;
        return true;
    }

    async function onError(type: string, error: any) {
        if(type === 'vert' || type === 'frag') {
            let view: EditorView;
            if (type === "vert") {
                view = vertexShaderEditorView;
            }
            else if (type === "frag") {
                view = fragmentShaderEditorView;
            }
            else return;

            const linterExtension = createShaderLinter(error);

            view.dispatch({
                effects: errorLinterCompartment.reconfigure(linterExtension)
            });
        }
        else if(type === 'modules') {
            const module = error.module;
            const module_error = error.error;
            any_module_error = error;
            const linterExtension = createEvalLinter(module_error, modules_src[module]);

            moduleEditorViews[module].dispatch({
                effects: errorLinterCompartment.reconfigure(linterExtension)
            });
        }
        else console.trace(error.error);
    }

    async function clearErrors(view: EditorView) {
        view.dispatch({
            effects: errorLinterCompartment.reconfigure(
                linter(() => [])
            )
        });
    }

    function timeAgo(date: Date) {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 },
        ];

        for (const i of intervals) {
            const count = Math.floor(seconds / i.seconds);
            if (count >= 1) {
            return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
            }
        }
        return 'just now';
    }

    const chips_names = ['[R]eset', '[S]napshot', 'Import', 'Vert | 1', 'Frag | 2', 'JS | 3', 'Assets'];
    const chips_values = ['reset', 'snapshot', 'import', 'view_vert', 'view_frag', 'view_modules', 'view_assets'];
    const chips_icons = [reset_icon, camera_icon, import_icon, vertex_icon, fragment_icon, javascript_icon, shapes_icon];
    const dividers = ['view_vert'];

    // Asset configuration dialog
    let modifying_asset_id = $state<string|null>(null);
    let asset_id = $state<string|null>(null);
    let asset_type = $state<'image'| 'audio' | 'video' | 'blob'>('image');
    let asset_source_type = $state<'local' | 'link'>('local');
    let asset_source = $state<string|null>(null);
    
    const groups = [{value: 'html', label: 'HTML Element'}];
    // const groups = [{value: 'html', label: 'HTML Element'}, {value: 'other', label: 'Other'}];
    const asset_type_options = [
        {value: 'image', label: 'Image', group: 'html'},
        {value: 'audio', label: 'Audio', group: 'html'},
        {value: 'video', label: 'Video', group: 'html'},
        // {value: 'model', label: '3D Model', group: 'other'},
        // {value: 'blob', label: 'Blob', group: 'other'},
    ]

    const asset_source_type_options = [
        {value: 'local', label: 'Local'},
        {value: 'link', label: 'Link'}
    ]

    async function submitAssetConfiguration(event: SubmitEvent) {
        anything_changed = true;
        // await tick();
        event.preventDefault();
        if(modifying_asset_id != null) {
            const { [modifying_asset_id]: _, ...rest } = assets;
            assets = rest;
        }
        if(asset_id==null) {
            alert('Asset Id is missing.');
            return;
        }
        else if(asset_source==null) {
            alert('Asset source is missing.');
            return;
        }
        else {
            assets = { ...assets, [asset_id]: {
                id: asset_id,
                type: asset_type,
                srcType: asset_source_type,
                src: asset_source
            } }
            show_asset_configuration_dialog = false;
        }
        // alert(`Selected asset type: ${asset_type || "(none)"}`);
    }

    function openAssetConfigurationDialog(asset: Asset | null) {
        if(show_asset_configuration_dialog) return;
        if(asset != null) {
            modifying_asset_id = asset.id;
            asset_id = asset.id;
            asset_type = asset.type;
            asset_source_type = asset.srcType
            if(asset.srcType == 'link')
                asset_source = asset.src
            else
                asset_source = null
            show_asset_configuration_dialog = true;
        }
        else {
            modifying_asset_id = null;
            asset_id = null;
            asset_type = 'image';
            asset_source_type = 'local';
            asset_source = null;
            show_asset_configuration_dialog = true;
        }
    }

    async function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        asset_source = await fileToDataURL(file);
    }

    // Helper function
    function fileToDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    function stringToByteSize(str: string) {
        const bytes = new TextEncoder().encode(str).length;

        const units = ["B", "KB", "MB", "GB", "TB"];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
</script>
<svelte:window onbeforeunload={beforeUnload}/>
<style>
    @import './editor.css';
</style>
<input type="file" accept={`.${extension},application/octet-stream`} bind:this={importSnapshotInput} onchange={importSnapshot} style="display:none"/>
<HeaderWithBackButton text="FoxGL Editor"/>
<Chips
    names={chips_names}
    values={chips_values}
    inline_icons={chips_icons}
    bind:selected_value={selected_value}
    dividers={dividers}
    sticky={true}
    callback={(value: any) => {
        if (value == 'reset') {
            reset();
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
            snippets_type = 'vert';
            viewModeStorage.set('vert');
            scrollToEditorCursor(vertexShaderEditorView);
        }
        else if(value == 'view_frag') {
            view_mode = 'frag';
            snippets_type = 'frag';
            viewModeStorage.set('frag');
            scrollToEditorCursor(fragmentShaderEditorView);
        }
        else if(value == 'view_modules') {
            view_mode = 'modules';
            snippets_type = 'modules';
            viewModeStorage.set('modules');
            scrollToEditorCursor(moduleEditorViews[module_tab_selected_value]);
        }
        else if(value == 'view_assets') {
            view_mode = 'assets';
            viewModeStorage.set('assets');
            scrollToTop();
        }
        return true;
    }}
/>
<p class="annotation">This is a clean and simple editor for small WebGL 2 projects. (Experimental)</p>
<hr class="dotted" style:margin-bottom="0">
<div class="editor-layout">
    <div class="left">
        <div class="master-container">
            <div class="row fade-in" style:display={(view_mode=='all' || view_mode=='vert')?'block':'none'}>
                <h3>Vertex Shader <img alt="Vertex" class="inline-glyph" src={vertex_icon}/></h3>
                <Tabs 
                bind:names={vertex_shader_tab_names} 
                bind:values={vertex_shader_tab_values}
                bind:inline_icons={vertex_shader_tab_icons}
                bind:selected_value={vertex_shader_tab_selected_value}
                bind:closable_list={vertex_shader_tab_closable_list}
                onclose={on_close}

                bind:functional_names={vertex_shader_functional_tab_names} 
                bind:functional_values={vertex_shader_functional_tab_values}
                bind:functional_inline_icons={vertex_shader_functional_tab_icons}
                onfunctional={on_vertex_shader_tab_functional}
                />
                <!-- <p class="annotation"><button onclick={() => { setEditorValue(vertexShaderEditorView, default_vert); }} class="text">Click here</button> to reset source to default.</p> -->
                <div bind:this={vertex_shader_editor} class="editor-container code-block-background"></div>
            </div>

            <!-- <hr class="dashed" style:display={(view_mode=='all' || view_mode=='vert')?'block':'none'}> -->
            <div class="row fade-in" style:display={(view_mode=='all' || view_mode=='frag')?'block':'none'}>
                <h3>Fragment Shader <img alt="Fragment" class="inline-glyph" src={fragment_icon}/></h3>
                <Tabs 
                bind:names={fragment_shader_tab_names} 
                bind:values={fragment_shader_tab_values}
                bind:inline_icons={fragment_shader_tab_icons}
                bind:selected_value={fragment_shader_tab_selected_value}
                bind:closable_list={fragment_shader_tab_closable_list}
                onclose={on_close}

                bind:functional_names={fragment_shader_functional_tab_names} 
                bind:functional_values={fragment_shader_functional_tab_values}
                bind:functional_inline_icons={fragment_shader_functional_tab_icons}
                onfunctional={on_fragment_shader_tab_functional}
                />
                <!-- <p class="annotation"><button onclick={() => { setEditorValue(fragmentShaderEditorView, default_frag); }} class="text">Click here</button> to reset source to default.</p> -->
                <div bind:this={fragment_shader_editor} class="editor-container code-block-background"></div>
            </div>

            <!-- <hr class="dashed" style:display={(view_mode=='all' || view_mode=='frag')?'block':'none'}> -->
            <div class="row fade-in" style:display={(view_mode=='all' || view_mode=='modules')?'block':'none'}>
                <!-- <h3 style:display={view_mode=='all'?'block':'none'}>JavaScript <img class="inline-glyph" src={javascript_icon}/></h3> -->
                <h3>JavaScript <img class="inline-glyph" src={javascript_icon}/></h3>
                {#if any_module_error != null}
                <p class="annotation" style:color="red">{any_module_error.error} <span id="module-error" class="underline">(At module "{any_module_error.module}")</span></p>
                <PointerBlock element_id="module-error">
                    <h4>Error at module "{any_module_error.module}"</h4>
                    <p class="annotation">{any_module_error.error.stack}</p>
                </PointerBlock>
                {/if}
                <Tabs 
                bind:names={module_tab_names} 
                bind:values={module_tab_values}
                bind:inline_icons={module_tab_icons}
                bind:selected_value={module_tab_selected_value}
                bind:closable_list={module_tab_closable_list}
                onclose={on_close}

                bind:functional_names={module_functional_tab_names} 
                bind:functional_values={module_functional_tab_values}
                bind:functional_inline_icons={module_functional_tab_icons}
                onfunctional={on_module_tab_functional}
                />
                {#each Object.entries(modules_src) as [module, code] (module)}
                <!-- <p class="annotation">{module}</p> -->
                <div bind:this={module_editors[module]} class="editor-container code-block-background" style:display={(module_tab_selected_value==module)?'block':'none'}></div>
                {/each}
            </div>

            <div class="row fade-in" style:display={(view_mode=='assets')?'block':'none'}>
                <h3>Assets <img class="inline-glyph" alt="Assets" src={shapes_icon}/></h3>
                <!-- <p class="annotation">Manage your image, audio or video assets.</p> -->
                <Tabs 
                names={['All Assets', 'Image', 'Audio', 'Video']} 
                values={[ 'all', 'image', 'audio', 'video']}
                inline_icons={[shapes_icon, picture_icon, music_icon, video_icon]}
                bind:selected_value={assets_tab_selected_value}
                closable_list={[false, false, false, false]}
                />
                <hr style:margin-top={0} class="dotted"/>
                <div class="flex_grid gallery">
                    <div class="item html-item code-block-background">
                        <div>
                            <h3><button class="text" onclick={() => {openAssetConfigurationDialog(null);}}><img class="inline-glyph" src={ upload_icon }/>&nbsp;Import</button></h3>
                            <p class="annotation">Click to upload or link a new asset file.</p>
                        </div>
                    </div>
                    {#each Object.entries(assets).reverse() as [id, asset] (id)}
                    {#if assets_tab_selected_value == 'all' || asset.type==assets_tab_selected_value}
                    {#if asset.type == 'image' }
                    <div id={`asset-img-${id}`} class="item image-item" role="button" tabindex="0" 
                    onclick={() => {
                        openAssetConfigurationDialog(asset);
                    }} onkeydown={(e) => {
                        openAssetConfigurationDialog(asset);
                    }}>
                        <img alt={id} src={asset.src} />
                    </div>
                    <PointerBlock element_id={`asset-img-${id}`}>
                        <h4 class="annotation">Image Asset ({id})</h4>
                        <p class="annotation">Id: {id}<br>Source Type: {asset.srcType}<br>{#if asset.srcType=='link'}Asset linked by an url.{:else if asset.srcType=='local'}Size: {stringToByteSize(asset.src)}{/if}</p>
                    </PointerBlock>
                    {/if}

                    {#if asset.type == 'audio' }
                    <div class="item audio-item code-block-background">
                        <div>
                            <h3><button onclick={() => {
                                openAssetConfigurationDialog(asset);
                            }} class="text">Audio Asset <img class="inline-glyph" alt="Audio" src={music_icon}/></button></h3>
                            <p class="annotation">Id: {id}<br>Source Type: {asset.srcType}<br>{#if asset.srcType=='link'}Asset linked by an url.{:else if asset.srcType=='local'}Size: {stringToByteSize(asset.src)}{/if}</p>
                            <audio controls>
                                <source src={asset.src}>
                            </audio>
                        </div>
                    </div>
                    {/if}

                    {#if asset.type == 'video' }
                    <div class="item video-item code-block-background">
                        <div>
                            <h3><button onclick={() => {
                                openAssetConfigurationDialog(asset);
                            }} class="text">Video Asset <img class="inline-glyph" alt="Video" src={video_icon}/></button></h3>
                            <p class="annotation">Id: {id}, {#if asset.srcType=='link'}Asset linked by an url.{:else if asset.srcType=='local'}size: {stringToByteSize(asset.src)}{/if}</p>
                            <video controls>
                                <source src={asset.src}>
                            </video>
                        </div>
                    </div>
                    {/if}
                    {/if}
                    {/each}
                </div>
            </div>
            <hr class="dotted">
            <EndingDecoration/>
        </div>
    </div>
    <div class="right">
        <div class="canvas-container">
            {#if mounted}
            <TapiocaFoxWebGL mode="in-editor" size={400} bind:vertex_shader={vert_shader_src} bind:fragment_shader={frag_shader_src} bind:modules={modules_src} bind:assets={assets} onglinit={onGLInit} onerror={onError}/>
            {/if}
            <div class="info-container">
                {#if error_message != null}
                <p id="error-message" class="annotation" style:width="auto" style:color="red">{error_message}</p>
                <PointerBlock element_id={``}>
                    <h4 class="annotation">Image Asset</h4>
                    <p class="annotation"></p>
                </PointerBlock>
                {/if}
                <h3>Snapshots <img class="inline-glyph" alt="Snapshot" src={camera_icon}/></h3>
                {#if mounted}
                <table class="functional-list" style:width="100%">
                    <tbody>
                        <tr>
                            <td style:white-space="nowrap"><img id={`snap-img-last-saved-state`} class="inline-glyph" alt="Preview" src={$lastSnapshot?.img || camera_icon}/>&nbsp;<button class="text" style:white-space="nowrap" onclick={() => {
                                if($lastSnapshot) loadSnapshot($lastSnapshot);
                            }}>Last Saved State <span class="annotation"></span></button>
                            {#if $lastSnapshot}
                            <PointerBlock element_id={`snap-img-last-saved-state`}>
                                <p class="annotation">Snapshot: {$lastSnapshot.name}<br>Time: {timeAgo(new Date($lastSnapshot?.timestamp || 0))}</p>
                                <img alt="Preview" src={$lastSnapshot?.img} style:max-height="300px"/>
                            </PointerBlock>
                            {/if}
                            </td>
                            <td class="glyphs">
                                <button class="no-style" onclick={() => {
                                    if($lastSnapshot) {
                                        snapshotInNewTab.set($lastSnapshot);
                                        window.open('/webgl_editor', '_blank', 'noopener,noreferrer');
                                    }
                                }}><img class="inline-glyph" alt="New Tab" src={new_module_tab_icon}/></button>
                                <button class="no-style" onclick={() => {
                                    if($lastSnapshot) downloadSnapshot($lastSnapshot);
                                }}><img class="inline-glyph" alt="Download" src={download_icon}/></button>
                                <button id="last-saved-state-info-button" class="no-style"><img class="inline-glyph" alt="Info" src={info_icon}/></button>
                            </td>
                        </tr>
                        <PointerBlock element_id={`last-saved-state-info-button`}>
                            <!-- <h3>About Last Saved State</h3> -->
                            <p class="annotation">Ctrl+Shift+S or ⌘+Shift+S to save current state as the last state. Your progress will be automatically restored when you return to the editor. Ctrl+S or ⌘+S to save a snapshot into the list.</p>
                        </PointerBlock>
                        
                        {#each $snapshotsStorage.toSorted((item)=>{return item.timestamp}).reverse() as snapshot}
                        <tr>
                            <td style:white-space="nowrap"><img id={`snap-img-${snapshot.timestamp}`} class="inline-glyph" alt="Preview" src={snapshot.img}/>&nbsp;<button class="text" style:white-space="nowrap" onclick={() => {
                                loadSnapshot(snapshot);
                            }}>{snapshot.name}</button>
                            <PointerBlock element_id={`snap-img-${snapshot.timestamp}`}>
                                <p class="annotation">Snapshot: {snapshot.name}<br>Time: {timeAgo(new Date(snapshot.timestamp))}</p>
                                <img alt="Preview" src={snapshot.img} style:max-height="300px"/>
                            </PointerBlock>
                            </td>
                            <td class="glyphs">

                                <button class="no-style" onclick={() => {
                                    snapshotInNewTab.set(snapshot);
                                    window.open('/webgl_editor', '_blank', 'noopener,noreferrer');
                                }}><img class="inline-glyph" alt="New Tab" src={new_module_tab_icon}/></button>
                                <button class="no-style" onclick={() => {
                                    downloadSnapshot(snapshot);
                                }}><img class="inline-glyph" alt="Download" src={download_icon}/></button>
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

<WindowBlock grab_element_id="foxgl-interface-grabable" bind:show={show_foxgl_interface} open_location="right">
    <h3 id="foxgl-interface-grabable"><button class="no-style" onclick={()=>{show_foxgl_interface=false}}><img class="inline-glyph" alt="Close" src={close_icon}/></button>&nbsp;JavaScript API Definitions</h3>
    <p class="annotation">This is foxGL's interface definition.</p>
    <pre>{TapiocaFoxGLContextRaw}</pre>
</WindowBlock>

<WindowBlock grab_element_id="asset-config-grabable" bind:show={show_asset_configuration_dialog} open_location="center">
    <h3 id="asset-config-grabable"><button class="no-style" onclick={()=>{show_asset_configuration_dialog=false}}><img class="inline-glyph" alt="Close" src={close_icon}/></button>&nbsp;{#if modifying_asset_id}Asset's Configuration{:else}Import New Asset{/if}</h3>
    
    <p class="annotation">Configure the settings for the asset file. Please make sure the id is unique to avoid conflicts. Consider the "link" source type if the file is larger than 16MB.</p>
    
    <form onsubmit={submitAssetConfiguration}>
        <label for="asset-name">Id:</label>
        <input id="asset-name" type="text" bind:value={asset_id} placeholder="Enter your id" required/>
        <br>
        <label for="asset-type">Type:</label>
        <select id="asset-type" bind:value={asset_type} required>
            {#each groups as group}
                <optgroup label={group.label}>
                {#each asset_type_options as option}
                {#if option.group == group.value}
                <option value={option.value} disabled={option.value === ""} selected={option.value === ""}>
                    {option.label}
                </option>
                {/if}
                {/each}
                </optgroup>
            {/each}
        </select>
        <br>
        <label for="source-type">Source type:</label>
        <select id="source-type" bind:value={asset_source_type} required>
            {#each asset_source_type_options as option}
            <option value={option.value} disabled={option.value === ""} selected={option.value === ""}>
                {option.label}
            </option>
            {/each}
        </select>
        {#if asset_source_type=='link'}
        <br>
        <label for="asset-link">Link:</label>
        <input id="asset-link" type="text" placeholder="Enter the link" bind:value={asset_source}/>
        {:else if asset_source_type=='local'}
        <br>
        {#if asset_type == 'image'}
        <input type="file" accept="image/*" onchange={handleFileSelect} />
        {/if}
        {#if asset_type == 'audio'}
        <input type="file" accept="audio/*" onchange={handleFileSelect} />
        {/if}
        {#if asset_type == 'video'}
        <input type="file" accept="video/*" onchange={handleFileSelect} />
        {/if}
        {/if}

        <br><br>
        <button type="submit">Confirm</button>
        <button type="button" onclick={() => {show_asset_configuration_dialog=false}}>Cancel</button>
        {#if modifying_asset_id != null}
        | <button type="button" style:color="red" onclick={() => {
            const { [modifying_asset_id!]: _, ...rest } = assets;
            assets = rest;
            show_asset_configuration_dialog=false;
        }}>Delete</button>
        {/if}
    </form>
</WindowBlock>

<WindowBlock grab_element_id="bookmark-grabable" bind:show={show_snippets} open_location="center">
    <h3 id="bookmark-grabable"><button class="no-style" onclick={()=>{show_snippets=false}}><img class="inline-glyph" alt="Close" src={close_icon}/></button>&nbsp;{(snippets_type=='modules')?'JavaScript':(snippets_type=='vert')?'Vertex Shader':'Fragment Shader'}&nbsp;Snippets&nbsp;<img class="inline-glyph" alt="Snippet" src={bookmark_icon}/></h3>
    <p class="annotation" style:min-width="100%">Load, save and manage your snippets. Hover mouse on top to preview.</p>
    <Tabs 
    names={['Saved', 'Predefined', 'All']} 
    values={['saved', 'predefined', 'all']}
    inline_icons={[bookmark_icon, null, null]}
    bind:selected_value={snippet_tabs_selected_value}
    closable_list={[false, false]}
    />
    <hr style:margin-top={0} class="dotted"/>
    {#if snippet_tabs_selected_value == 'saved' || snippet_tabs_selected_value == 'all' }
    <h4>Saved by You</h4>
    <p class="annotation">Your saved snippets will be here.</p>
    <table class="functional-list" style:width="100%">
        <tbody>
            {#each (
            (snippets_type == 'vert')
                ? $vertexShaderSnippets
                : (snippets_type == 'frag')
                ? $fragmentShaderSnippets
                : $moduleSnippets
            ).toSorted((a, b) => a.name.localeCompare(b.name)) as snippet (snippet.name)}
            <tr>
                <td style:white-space="nowrap"><img class="inline-glyph" alt="Icon" src={snippet.icon}/>&nbsp;<span id={`${snippets_type}-snippet-${snippet.name}`} class="underline">{snippet.name}&nbsp;({snippet.module_name})</span></td>
                <td class="glyphs">
                    <button class="no-style" onclick={() => {
                        if(snippets_type == 'vert') {
                            setEditorValue(vertexShaderEditorView, snippet.module_code);
                        }
                        else if(snippets_type == 'frag') {
                            setEditorValue(fragmentShaderEditorView, snippet.module_code);
                        }
                        else if(snippets_type == 'modules') {
                            new_module(snippet.module_name, snippet.module_code);
                        }
                    }}><img class="inline-glyph" alt="Load" src={load_icon}/></button>
                    <button class="no-style" onclick={() => {
                        if(snippets_type == 'vert') {
                            vertexShaderSnippets.update((snippets) => {
                                return snippets.filter((snippetItem) => {
                                    return snippetItem.name != snippet.name;
                                });
                            });
                        }
                        else if(snippets_type == 'frag') {
                            fragmentShaderSnippets.update((snippets) => {
                                return snippets.filter((snippetItem) => {
                                    return snippetItem.name != snippet.name;
                                });
                            });
                        }
                        else if(snippets_type == 'modules') {
                            moduleSnippets.update((snippets) => {
                                return snippets.filter((snippetItem) => {
                                    return snippetItem.name != snippet.name;
                                });
                            });
                        }
                    }}><img class="inline-glyph" alt="Delete" src={delete_icon}/></button>
                </td>
            </tr>
            <PointerBlock element_id={`${snippets_type}-snippet-${snippet.name}`}>
                    <h3><img class="inline-glyph" alt="Icon" src={snippet.icon}/>&nbsp;{snippet.name}&nbsp;({snippet.module_name})</h3>
                    <p class="annotation">{(snippets_type=='modules')?'JavaScript':(snippets_type=='vert')?'Vertex Shader':'Fragment Shader'}&nbsp;Snippet. Size: {stringToByteSize(snippet.module_code)}</p>
                    <hr class="dotted"/>
                    <pre>{snippet.module_code}</pre>
            </PointerBlock>
            {/each}
        </tbody>
    </table>
    {/if}
    {#if snippet_tabs_selected_value == 'predefined' || snippet_tabs_selected_value == 'all' }    
    <h4>Predefined</h4>
    <p class="annotation">Snippets here are meant to be like a support library.</p>
    <table class="functional-list" style:width="100%">
        <tbody>
            {#each (snippets_type=='modules')?predefined_module_snippets:(snippets_type=='vert')?predefined_vertex_shader_snippets:predefined_fragment_shader_snippets as snippet}
            <tr>
                <td style:white-space="nowrap"><img class="inline-glyph" alt="Icon" src={snippet.icon}/>&nbsp;<span id={`predefined-snippet-${snippet.name}`} class="underline">{snippet.name}</span></td>
                <td class="glyphs">
                    <button class="no-style" onclick={() => {
                        if(snippets_type == 'vert') {
                            setEditorValue(vertexShaderEditorView, snippet.module_code);
                        }
                        else if(snippets_type == 'frag') {
                            setEditorValue(fragmentShaderEditorView, snippet.module_code);
                        }
                        else if(snippets_type == 'modules') {
                            new_module(snippet.module_name, snippet.module_code);
                        }
                    }}><img class="inline-glyph" alt="Load" src={load_icon}/></button>
                </td>
            </tr>
            <PointerBlock element_id={`predefined-snippet-${snippet.name}`}>
                    <h3><img class="inline-glyph" alt="Icon" src={snippet.icon}/>&nbsp;{snippet.name}</h3>
                    <p class="annotation">{(snippets_type=='modules')?'JavaScript':(snippets_type=='vert')?'Vertex Shader':'Fragment Shader'}&nbsp;Snippet. Size: {stringToByteSize(snippet.module_code)}</p>
                    <hr class="dotted"/>
                    <pre>{snippet.module_code}</pre>
            </PointerBlock>
            {/each}
        </tbody>
    </table>
    {/if}
    <br>
    <!-- <hr class="dotted"/> -->
    
    <button type="button" onclick={() => {show_snippets=false}}>Close</button>
    {#if snippet_tabs_selected_value == 'saved' || snippet_tabs_selected_value == 'all' }
    <button type="button" onclick={() => {
        let editor_src = '';
        let snippetsStorage = vertexShaderSnippets;
        let module_name = '';
        if(snippets_type=='vert') {
            editor_src = vertexShaderEditorView.state.doc.toString();
            snippetsStorage = vertexShaderSnippets;
            module_name = vertex_shader_tab_selected_value;
        }
        else if(snippets_type=='frag') {
            editor_src = fragmentShaderEditorView.state.doc.toString();
            snippetsStorage = fragmentShaderSnippets;
            module_name = fragment_shader_tab_selected_value;
        }
        else if(snippets_type=='modules') {
            editor_src = moduleEditorViews[module_tab_selected_value].state.doc.toString();
            snippetsStorage = moduleSnippets;
            module_name = module_tab_selected_value;
        }

        snippetsStorage.update((snippets) => {
            const name = prompt("Enter a name for the snippet:", module_name);
            if (!name) return snippets; // cancel if user presses Cancel or leaves empty

            const newSnippet = {
                name: name,
                module_name: module_name,
                icon: doc_icon,
                module_code: editor_src
            };

            const index = snippets.findIndex(
                s => s.name === newSnippet.name && s.module_name === newSnippet.module_name
            );

            if (index !== -1) {
                const shouldReplace = confirm(
                `A snippet named "${newSnippet.name}" already exists in module "${newSnippet.module_name}".\nDo you want to replace it?`
                );

                if (!shouldReplace) return snippets; // cancel update
                const updated = [...snippets];
                updated[index] = newSnippet;
                return updated;
            } else {
                return [...snippets, newSnippet];
            }
        });
    }}>Save Current</button>
    {/if}
</WindowBlock>