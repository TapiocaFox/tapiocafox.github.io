<script lang="ts">
    import icon from '$lib/assets/squares/tapiocafox.png';
    import ArtDecoration from '$lib/components/ArtDecoration.svelte';
    import ChipsWithUrlState from '$lib/components/ChipsWithUrlState.svelte';
    import GlslCanvas from '$lib/components/TapiocaFoxWebGL.svelte';

    import talksy_poster from '$lib/assets/projects/talksy_poster.png';
    import talksy from '$lib/assets/projects/talksy.png';

    import reversi_talk from '$lib/assets/projects/reversi_talk.png';
    import reversi_talk_terminal from '$lib/assets/projects/reversi_talk_terminal.png';

    import note_g_editor from '$lib/assets/projects/note_g_editor.png';
    import note_g_arduino from '$lib/assets/projects/note_g_arduino.jpg';

    import default_vert from '$lib/assets/webgl/practice_1/default.vert?raw';
    import balls from '$lib/assets/webgl/practice_1/balls.frag?raw';
    import spiral from '$lib/assets/webgl/practice_1/radiant.frag?raw';
    import adhesive from '$lib/assets/webgl/practice_1/adhesive.frag?raw';

    import reflective_spheres_vert from '$lib/assets/webgl/practice_2/reflective_spheres.vert?raw';
    import reflective_spheres_frag from '$lib/assets/webgl/practice_2/reflective_spheres.frag?raw';
    import reflective_spheres_js from '$lib/assets/webgl/practice_2/reflective_spheres.js?raw';

    import github_icon from '$lib/assets/icons/github.svg';
    import google_play_icon from '$lib/assets/icons/google_play.svg';
    import discord_icon from '$lib/assets/icons/discord.svg';
	import nsf_icon from '$lib/assets/icons/nsf.png';
    import edit_icon from '$lib/assets/icons/edit.svg';
    // import info_icon from '$lib/assets/icons/info.svg';

    // import decoration from '$lib/assets/mejiro.png';

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
    <p>Personal practice of WebGL with the <a href="/webgl_editor"><img class="inline-glyph" alt="Editor" src={edit_icon}/>online editor</a> written with CodeMirror by myself. GLSL is a special OpenGL Shading Language with syntax similar to C. <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/webgl/practice_1" target="_blank">Learn more</a>.</p>
    <div class="preview-row">
        <!-- <GlslCanvas mode='preview'/> -->
        <GlslCanvas mode='preview' vertex_shader={default_vert} fragment_shader={adhesive}/>
        <GlslCanvas mode='preview' vertex_shader={default_vert} fragment_shader={balls}/>
        <GlslCanvas mode='preview' vertex_shader={reflective_spheres_vert} fragment_shader={reflective_spheres_frag} javascript={reflective_spheres_js}/>
        <GlslCanvas mode='preview' vertex_shader={default_vert} fragment_shader={spiral}/>
    </div>
</div>
{/if}

{#if selected_category=="all" || selected_category=='highlights' || selected_category=='ongoing'}
<div class="card">
    <h2><a href="https://github.com/TapiocaFox/Daijishou" target="_blank">Daijishō</a></h2>
    <p>Daijishō is <span class="emphasize">an android launcher that let you manage your retro games libraries</span>. The App is written in Kotlin, Room database, Jsoup, Javet and various other tools. Designed <span class="emphasize">with responsiveness, modularity and tight integration in mind</span>.</p>
    <p>Features included multi-language, meta data fetching, items synchronization, Google Drive backup, <a href="https://retroachievements.org/" target="_blank">RetroAchievements</a> and a rather simple theming system. Daijishō has <span class="emphasize">1M+ accumalated downloads</span> on <a href="https://play.google.com/store/apps/details?id=com.magneticchen.daijishou" target="_blank"><img class="inline-glyph" alt="Google Play" src={google_play_icon}/>Google Play Store</a>. And <span class="emphasize">a community with 2k+ members</span> on <a href="https://discord.com/invite/nJbxdT3QQE" target="_blank"><img class="inline-glyph" alt="Discord" src={discord_icon}/>Discord</a>.</p>
    <img alt="Daijishō Banner" src="https://raw.githubusercontent.com/TapiocaFox/Daijishou/main/imgs/cover_new.png"/>
    <iframe src="https://ghbtns.com/github-btn.html?user=tapiocafox&repo=Daijishou&type=star&count=true" frameborder="0" scrolling="0" width="150" height="20" title="GitHub"></iframe>
</div>
{/if}

{#if selected_category=="all" || selected_category=='highlights'}
<div class="card">
    <h2><a href="https://github.com/NOOXY-research/Talksy" target="_blank">Talksy</a></h2>
    <p>A <span class="emphasize">full stack chatting software</span>. Written in React.js with a <a href="https://github.com/NOOXY-research/NoTalk" target="_blank">microservice</a> that provide realtime chat, channel management, permission control, user authentication and other features. The service is built on top of "<a href="https://github.com/NOOXY-research/NoService" target="_blank"><img class="inline-glyph" alt="NoService" src={nsf_icon}/>NoService</a>", <span class="emphasize">a content management system (CMS) written from scratch</span>.</p>
    <p>It was used by my university's radio station "goto&Play". Embeded as a chatting bubble binded to a channel. Admins have fine-grained control through the interface as shown. Users can login to access the interface, but only with the channels where the permissions are given.</p>
    <div class="preview-row">
        <img class="preview-large outlined" alt="Talksy Poster" src={talksy_poster}/>
        <img class="preview-large outlined" alt="Talksy" src={talksy}/>
    </div>
</div>
{/if}

{#if selected_category=="all" || selected_category=='highlights'}
<div class="card">
    <h2><a href="https://github.com/TapiocaFox/Note-G" target="_blank">Note-G</a></h2>
    <p>A simple rhythm game console made with Arduino UNO. You can edit your music sheet in browser and <span class="emphasize">upload it to Arduino via bluetooth BLE</span>. The editor also support the importation from the <span class="emphasize">Open Music XML format</span> through conversion.</p>
    <div class="preview-row">
        <img class="preview-large" alt="Note G Arduino" src={note_g_arduino}/>
        <img class="preview-large outlined" alt="Note G Editor" src={note_g_editor}/>
    </div>
</div>
{/if}

{#if selected_category=="all"}
<div class="card">
    <h2><a href="https://github.com/TapiocaFox/ReversiTalk" target="_blank">ReversiTalk</a></h2>
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
            <p>A page for debugging the components of this website. The website is written with <a href="https://svelte.dev" target="_blank">Svelte Tookit</a>.</p>
        </div>
    </div>
</div>
{/if}

<!-- <ArtDecoration src={decoration}/> -->