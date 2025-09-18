<script lang="ts">
  let {names = [], values = [], inline_icons=[], dividers=[], selected_value=null, callback = () => {}, selection = true} = $props();
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
        /* filter: drop-shadow(0 0.5rem 1rem grey); */
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
    div.divider {
        display: inline-block;
        border-left: 1px solid black;
        height: 1em;
        width: 1px;
        /* margin-left: .25em; */
        margin-right: calc(.5em - 1px);
        vertical-align: middle;
    }
</style>
<div class="chip_container">
    {#each names as name, index}
        {#if dividers.includes(values[index])}<div class="divider"></div>{/if}{#if selected_index == index}
            <button class="selected" onclick={() => {
                selected_index = index;
                callback(values[index]);
            }}><span class="text">
                {#if inline_icons.length>0 && inline_icons[index]!=null}
                    <img class="inline-glyph inverted" alt="Inline Icon" src={inline_icons[index]}>
                {/if}
                {names[index]}
            </span></button>
        {:else}
            <button class="" onclick={() => {
                selected_index = index;
                callback(values[index]);
            }}><span class="text">
                {#if inline_icons.length>0 && inline_icons[index]!=null}
                    <img class="inline-glyph" alt="Inline Icon" src={inline_icons[index]}>
                {/if}
                {names[index]}
            </span></button>
        {/if}
    {/each}
    
</div>