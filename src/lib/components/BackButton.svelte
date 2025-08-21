<script  lang="ts">
  let {text = "go back", inline=false} = $props();
</script>
<style>
  button.back_button {
    display: block;
    width: fit-content;
    padding: 0.1em 0.5em;
    /* border-radius: var(--sharper-radius); */
    border: 1px solid black;
    font-size: small;
    margin: 12px 0;
    background-color: unset;
    text-decoration: none;
    transition: var(--normal-transition);
  }
  button.back_button:hover {
    background-color: whitesmoke;
  }
  button.back_button_inlined {
    display: inline-block;
    vertical-align: middle;
    margin: auto 1em;
  }
  button span.text {
    color: royalblue;
  }
</style>
{#if inline}
  <button class="back_button back_button_inlined" onclick={()=>{window.history.back(); return false;}}><span class="text">« {text}</span></button>
{:else}
  <button class="back_button" onclick={()=>{window.history.back(); return false;}}><span class="text">« {text}</span></button>
{/if}