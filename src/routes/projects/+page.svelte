<script lang="ts">
    import icon from '$lib/assets/squares/tapiocafox.png';
    import ArtDecoration from '$lib/components/ArtDecoration.svelte';
    import ChipsWithUrlState from '$lib/components/ChipsWithUrlState.svelte';
    import GlslCanvas from '$lib/components/TapiocaFoxWebGL.svelte';

    import talksy_poster from '$lib/assets/projects/talksy_poster.png';
    import talksy from '$lib/assets/projects/talksy.png';

    import reversi_talk from '$lib/assets/projects/reversi_talk.png';
    import reversi_talk_terminal from '$lib/assets/projects/reversi_talk_terminal.png';

    import note_g_editor from '$lib/assets/projects/note_g_editor.jpg';
    import note_g_arduino from '$lib/assets/projects/note_g_arduino.jpg';

    // import default_vert from '$lib/assets/webgl/practice_1/default.vert?raw';
    import balls from '$lib/assets/webgl/practice_1/balls.frag?raw';
    import spiral from '$lib/assets/webgl/practice_1/radiant.frag?raw';
    import adhesive from '$lib/assets/webgl/practice_1/adhesive.frag?raw';

    import lava_lamp_frag from '$lib/assets/webgl/practice_4/lava_lamp.frag?raw';
    import lava_lamp_js from '$lib/assets/webgl/practice_4/lava_lamp.js?raw';
    import hl_alien_blipper_sound from '$lib/assets/webgl/practice_4/sounds/alien_blipper.wav';
    import hl_alienappeal_sound from '$lib/assets/webgl/practice_4/sounds/alienappeal.wav';

    import reflective_spheres_frag from '$lib/assets/webgl/practice_2/reflective_spheres.frag?raw';
    import reflective_spheres_js from '$lib/assets/webgl/practice_2/reflective_spheres.js?raw';

    import github_icon from '$lib/assets/icons/github.svg';
    import google_play_icon from '$lib/assets/icons/google_play.svg';
    import discord_icon from '$lib/assets/icons/discord.svg';
	import nsf_icon from '$lib/assets/icons/nsf.png';
    import edit_icon from '$lib/assets/icons/edit.svg';
    // import info_icon from '$lib/assets/icons/info.svg';

    import decoration from '$lib/assets/tea.png';
    import version from '$lib/version';

    let selected_category = $state('all');
</script>
<h1>Projects</h1>
<ChipsWithUrlState 
  names={['All categories', 'Highlights', 'Ongoing', 'Other']} 
  values={['all', 'highlights', 'ongoing', 'other']}
  dividers={['highlights']}
  selected_value={selected_category}
  callback={(value: any) => {
    selected_category = value;
  }}
/>
{#if selected_category == "highlights"}
<p class="annotation">Projects that can showcase my core skills.</p>
{:else if selected_category == "ongoing"}
<p class="annotation">Projects that are still onging, including experimental ones.</p>
{:else if selected_category == "other"}
<p class="annotation">Other uncategorized stuffs belong to here.</p>
{:else}
<p class="annotation">Please visit <a href="https://github.com/TapiocaFox" target="_blank"><img class="inline-glyph" alt="GitHub" src={github_icon}/>GitHub</a>. If you are interested for more.</p>
{/if}

{#if selected_category=="all" || selected_category=='ongoing'}
<div class="card">
    <h2><a href="/projects/graphics">Graphics</a></h2>
    <p>Personal practice of WebGL with the <a href="/webgl_editor"><img class="inline-glyph" alt="Editor" src={edit_icon}/>online editor</a> written with CodeMirror by myself. GLSL is a special OpenGL Shading Language with syntax similar to C, <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">learn more</a>.</p>
    <div class="preview-row">
        <!-- <GlslCanvas mode='preview'/> -->
        <GlslCanvas mode='preview' fragment_shader={adhesive}/>
        <GlslCanvas mode='preview' fragment_shader={balls}/>
        <!-- <GlslCanvas mode='preview' fragment_shader={reflective_spheres_frag} javascript={reflective_spheres_js}/> -->
        <GlslCanvas mode='preview' fragment_shader={spiral}/>
        <GlslCanvas mode='preview' fragment_shader={lava_lamp_frag} javascript={lava_lamp_js} assets={{
                        'hl_alien_blipper': {
                            id: 'hl_alien_blipper',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_alien_blipper_sound
                        },
                        'hl_alienappeal': {
                            id: 'hl_alienappeal',
                            type: 'audio',
                            srcType: 'link',
                            src: hl_alienappeal_sound
                        }
                    }}/>
    </div>
</div>
{/if}

{#if selected_category=="all" || selected_category=='highlights' || selected_category=='ongoing'}
<div class="card">
    <h2><a href="https://github.com/TapiocaFox/Daijishou" target="_blank">Daijishō</a></h2>
    <p>Daijishō is <span class="emphasize">an android launcher that let you manage your retro games libraries</span>. The App is written in Kotlin, Room database, Jsoup, Javet and various other tools. Designed <span class="emphasize">with responsiveness, modularity and tight integration in mind</span>.</p>
    <p>Features included multi-language, meta data fetching, items synchronization, Google Drive backup, <a href="https://retroachievements.org/" target="_blank">RetroAchievements</a> and a simple theming system. Daijishō has <span class="emphasize">1M+ accumalated downloads</span> on <a href="https://play.google.com/store/apps/details?id=com.magneticchen.daijishou" target="_blank"><img class="inline-glyph" alt="Google Play" src={google_play_icon}/>Google Play Store</a>. <span class="emphasize">A&nbsp;</span><a href="https://discord.com/invite/nJbxdT3QQE" target="_blank"><img class="inline-glyph" alt="Discord" src={discord_icon}/>Discord</a> community with 2k+ members.</p>
    <img alt="Daijishō Banner" src="https://raw.githubusercontent.com/TapiocaFox/Daijishou/main/imgs/cover_new.png"/>
    <iframe src="https://ghbtns.com/github-btn.html?user=tapiocafox&repo=Daijishou&type=star&count=true" frameborder="0" scrolling="0" width="150" height="20" title="GitHub"></iframe>
</div>
{/if}

{#if selected_category=="all" || selected_category=='highlights'}
<div class="card">
    <h2><a href="https://github.com/NOOXY-research/Talksy" target="_blank">Talksy</a></h2>
    <p>A <span class="emphasize">full stack chatting software</span>. Written in React.js with a <a href="https://github.com/NOOXY-research/NoTalk" target="_blank">microservice</a> provides realtime chat, channel management, permission control, authentication and more features. The service is built on top of <a href="https://github.com/NOOXY-research/NoService" target="_blank"><img class="inline-glyph" alt="NoService" src={nsf_icon}/>NoService</a>, <span class="emphasize">a content management system (CMS) written from scratch</span>.</p>
    <p>It was used by my university's radio station "goto&Play". Embeded as a chatting bubble binded to a channel. Admins have fine-grained control through the UI as shown. Users can also access the interface, but only with the channels where the permissions are granted.</p>
    <div class="preview-row">
        <img class="preview-large outlined" alt="Talksy Poster" src={talksy_poster}/>
        <img class="preview-large outlined" alt="Talksy" src={talksy}/>
    </div>
</div>
{/if}

{#if selected_category=="all" || selected_category=='highlights'}
<div class="card">
    <h2><a href="http://tapiocafox.github.io/Note-G" target="_blank">Note-G</a></h2>
    <p>A simple rhythm game console made with Arduino UNO. You can edit your music sheet in browser and <span class="emphasize">upload it to Arduino via bluetooth BLE</span>. The editor also supports the importation from the <span class="emphasize">Open Music XML format</span> through conversion.</p>
    <div class="preview-row">
        <img class="preview-large" alt="Note G Arduino" src={note_g_arduino}/>
        <img class="preview-large outlined" alt="Note G Editor" src={note_g_editor}/>
    </div>
</div>
{/if}

{#if selected_category=="all"}
<div class="card">
    <h2><a href="http://tapiocafox.github.io/ReversiTalk" target="_blank">ReversiTalk</a></h2>
    <p><span class="emphasize">A reversi game stack</span> that can be controlled by various IoT devices, and can be displayed on the webpage. The AI agent uses CNN model, and <span class="emphasize">the library was written <a href="https://github.com/TapiocaFox/NodeNet" target="_blank">purely in NumPy</a></span>. It was my second year undergrad project.</p>
    <div class="preview-row">
        <img class="preview-large" alt="Reversi Talk" src={reversi_talk}/>
        <img class="preview-large" alt="Reversi Talk Terminal" src={reversi_talk_terminal}/>
    </div>
</div>
{/if}

{#if selected_category=='other'}
<div class="card">
    <h2><a href="/components">Components</a></h2>
    <div class="icon-description-layout">
        <div class="icon">
            <img class="icon" alt="Icon" src={icon}/>
        </div>
        <div class="description">
            <p>This is a page for debugging the components of this website. The website is written with <a href="https://svelte.dev" target="_blank">Svelte Tookit</a>. ({version})</p>
        </div>
    </div>
</div>
{/if}

<ArtDecoration src={decoration}/>