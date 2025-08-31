<script  lang="ts">
  let {text = "Go back", inline=false} = $props();
</script>
<style>
  button.back_button {
    display: block;
    margin: 12px 0;
  }
  button.back_button_inlined {
    display: inline-block;
    vertical-align: middle;
    margin: auto 1em;
  }
  button span.text {
    color: var(--primary-functional-color);
  }
</style>
{#if inline}
  <button class="back_button back_button_inlined" onclick={()=>{window.history.back(); return false;}}><span class="text">« {text}</span></button>
{:else}
  <button class="back_button" onclick={()=>{window.history.back(); return false;}}><span class="text">« {text}</span></button>
{/if}