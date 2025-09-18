<script lang="ts">
  let {names = [], values = [], inline_icons=[], dividers=[], selected_value=null, callback = () => {}, selectable = true} = $props();
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

    button:active {
        border: 1px solid black;
        background-color: var(--secondary-functional-color);
    }

    button:active span.text {
        color: var(--secondary-functional-text-color);
    }

    button:active span.text > img.inline-glyph {
        filter: invert(1);
    }

    button.selected {
        border: 1px solid black;
        background-color: var(--secondary-functional-color);
    }

    button.selected span.text > img.inline-glyph {
        filter: invert(1);
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
        {#if dividers.includes(values[index])}<div class="divider"></div>{/if}{#if selectable && selected_index == index}
            <button class="selected" onclick={() => {
                const default_behaviour = callback(values[index]);;
                if(default_behaviour) selected_index = index;
            }}><span class="text">
                {#if inline_icons.length>0 && inline_icons[index]!=null}
                    <img class="inline-glyph inverted" alt="Inline Icon" src={inline_icons[index]}>
                {/if}
                {names[index]}
            </span></button>
        {:else}
            <button class="" onclick={() => {
                const default_behaviour = callback(values[index]);;
                if(default_behaviour) selected_index = index;
            }}><span class="text">
                {#if inline_icons.length>0 && inline_icons[index]!=null}
                    <img class="inline-glyph" alt="Inline Icon" src={inline_icons[index]}>
                {/if}
                {names[index]}
            </span></button>
        {/if}
    {/each}
</div>