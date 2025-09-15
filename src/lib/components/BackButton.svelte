<script lang="ts">
  let {text = "Go back", mode='default'} = $props();
  function back() {
    window.history.back(); 
    return false;
  }
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
{#if mode == 'default'}
  <button class="back_button" onclick={back}><span class="text">« {text}</span></button>
{:else if mode == 'inline'}
  <button class="back_button back_button_inlined" onclick={back}><span class="text">« {text}</span></button>
{:else if mode == 'text'}
  <button class="no-style" onclick={back}>{text}</button>
{/if}