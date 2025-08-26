<script>
    import icon from '$lib/assets/icon.png';

    import ChipsWithUrlHash from '$lib/components/ChipsWithUrlHash.svelte';
    let selected_category = $state('all');
</script>
<h1>Projects</h1>
<p class="annotation">The website is still very barebone; Please visit <a href="https://github.com/TapiocaFox" target="_blank">GitHub</a>.</p>
<ChipsWithUrlHash 
  names={['All categories', 'Highlights', 'Other']} 
  values={['all', 'highlights', 'other']}
  selected_value={selected_category}
  callback={(value) => {
    selected_category = value;
  }}
/>

{#if selected_category=="all"}
<div class="card">
    <h2><a href="/glsl">GLSL</a></h2>
    <p>Personal practice of GLSL. Shaders use GLSL (OpenGL Shading Language), a special OpenGL Shading Language with syntax similar to C. <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">more…</a></p>
</div>
{/if}

{#if selected_category=="all" || selected_category=='highlights'}
<div class="card">
    <h2><a href="https://github.com/TapiocaFox/Daijishou" target="_blank">Daijishō</a></h2>
    <p>Daijishō is a android launcher that let you manage your retro games libraries. This repo is for assets and served as a main page. It has 1M+ accumalated downloads on <a href="https://play.google.com/store/apps/details?id=com.magneticchen.daijishou" target="_blank">Google Play Store</a>.</p>
    <img alt="Daijishō Banner" src="https://raw.githubusercontent.com/TapiocaFox/Daijishou/main/imgs/cover_new.png"/>
    <iframe src="https://ghbtns.com/github-btn.html?user=tapiocafox&repo=Daijishou&type=star&count=true" frameborder="0" scrolling="0" width="150" height="20" title="GitHub"></iframe>
</div>
{/if}

{#if selected_category=='other'}
<div class="card">
    <h2><a href="/components">Components</a></h2>
    <div class="icon_description_layout">
        <div class="icon">
            <img class="icon" alt="Icon" src={icon}/>
        </div>
        <div class="description">
            <p>A page for debugging the components of this website. The website is written with <a href="https://svelte.dev" target="_blank">Svelte Tookit</a>.</p>
        </div>
    </div>
</div>
{/if}
