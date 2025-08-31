<script lang="ts">
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
        margin: 0 0.5em 0 0;
        /* border: 1px solid var(--secondary-functional-color); */
    }
    
    button:hover {
        border: 1px solid black;
        background-color: whitesmoke;
    }

    button.selected {
        border: 1px solid black;
        background-color: var(--secondary-functional-color);
    }
    button:last-child {
        margin: 0;
    }
    button.selected:hover {
        background-color: var(--secondary-functional-color);
    }
    button span.text {
        color: black;
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
            <button class="" onclick={() => {
                selected_index = index;
                callback(values[index]);
            }}><span class="text">{name}</span></button>
        {/if}
    {/each}
    
</div>