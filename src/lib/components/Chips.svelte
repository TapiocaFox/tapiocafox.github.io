<script  lang="ts">
  let {names = [], values = [], selected_value=null, callback = () => {}, selection = true} = $props();
  let selected_index = $state(values.indexOf(selected_value));
</script>
<style>
    div.chip_container {
        white-space: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        margin-block-end: 13px;
        margin-block-start: 13px;
    }
    div.chip_container::-webkit-scrollbar {
        display: none;
    }
    button {
        display: inline-block;
        vertical-align: middle;
        width: fit-content;
        padding: 0.1em 0.5em;
        /* border-radius: var(--sharper-radius); */
        border: 1px solid black;
        font-size: small;
        margin: 12px 0;
        background-color: unset;
        text-decoration: none;
        transition: var(--normal-transition);
        margin: 0 0.5em 0 0;
    }
    button.selected {
        /* border: 1px solid var(--secondary-functional-color); */
        background-color: var(--secondary-functional-color);
    }
    button:last-child {
        margin: 0;
    }
    button:hover {
        border: 1px solid black;
        background-color: whitesmoke;
    }
    button.selected:hover {
        background-color: var(--secondary-functional-color);
    }
    button span.text {
        color: var(--secondary-functional-color);
    }
    button.selected span.text {
        color: var(--secondary-functional-text-color);
    }
</style>
<div class="chip_container">
    {#each names as name, index}
        {#if selected_index == index}
            <button class="selected" onclick={() => {
                selected_index = index;
                callback(values[index]);
            }}><span class="text">{name}</span></button>
        {:else}
            <button onclick={() => {
                selected_index = index;
                callback(values[index]);
            }}><span class="text">{name}</span></button>
        {/if}
    {/each}
</div>