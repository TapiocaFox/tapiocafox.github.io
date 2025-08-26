<script>
    import ChipsWithUrlHash from '$lib/components/ChipsWithUrlHash.svelte';
    let selected_category = $state('all');
</script>
<h1>Media</h1>
<ChipsWithUrlHash 
  names={['Music', 'Videos']} 
  values={['music', 'videos', 'other']}
  selected_value={selected_category}
  callback={(value) => {
    selected_category = value;
  }}
/>
<p class="annotation">Personal taste. Including music, videos and other forms of content.</p>

{#if selected_category=="music"}
<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/playlist/tapiocafoxs-selection/pl.u-EdAVR7Gu5Wq7yq"></iframe>
{/if}

{#if selected_category=="videos"}
<iframe class="youtube" src="https://www.youtube.com/embed/oCBaiNr3K9A?si=DN0rtc7AB4PJMtB_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p class="annotation"><a href="https://en.wikipedia.org/wiki/Susan_Kare" target="_blank">Susan Kare</a> is an American artist and graphic designer, who contributed interface elements and typefaces for the first Apple Macintosh personal computer from 1983 to 1986.</p>
<iframe class="youtube" src="https://www.youtube.com/embed/PkPSDOjhxwM?si=uxjuwaS3c0qlrfO4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p class="annotation">Another chill videos about <a href="https://en.wikipedia.org/wiki/Vacuum_fluorescent_display" target="_blank">VFD (Vacuum Fluorescent Display)</a>. The owner of the channel produces his own <a href="https://posy.bandcamp.com" target="_blank">music</a> for the videos.</p>
{/if}

{#if selected_category=="other"}
<p>None for now.</p>
{/if}