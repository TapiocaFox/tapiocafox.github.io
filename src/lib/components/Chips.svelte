<script lang="ts">
  let {names = [], values = [], inline_icons=[], dividers=[], selected_value=$bindable(null), callback = () => {}, selectable = true, sticky=false} = $props();
  let selected_index = $derived(values.indexOf(selected_value));
  // whenever selected_value changes, update selected_index
    // $: selected_index = values.indexOf(selected_value);
</script>
<style>
    div.chip-container {
        white-space: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        margin-block-end: 12px;
        margin-block-start: 12px;
    }

    div.chip-container.sticky {
        position: sticky;
        top: calc(var(--main-nav-height) + var(--page-offset));
        z-index: 99;
    }

    /* div.chip-container.sticky:stuck {
        filter: drop-shadow(0 0.5rem 0.5rem lightgrey);
    } */

    div.chip-container::-webkit-scrollbar {
        display: none;
    }
    button {
        display: inline-block;
        vertical-align: middle;
        margin: 1px 0.5em 1px 0;
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
        border-right: 1px solid black;
        height: 1em;
        /* width: 1px; */
        /* margin-left: .25em; */
        margin-right: calc(.5em - 1px);
        vertical-align: middle;
    }
</style>
<div class="chip-container {sticky?'sticky':''}">
    {#each names as name, index}
        {#if dividers.includes(values[index])}<div class="divider"></div>{/if}{#if selectable && selected_index == index}
            <button class="selected" onclick={() => {
                const default_behaviour = callback(values[index]);
                if(default_behaviour==null||default_behaviour) selected_value = values[index];
            }}><span class="text">
                {#if inline_icons.length>0 && inline_icons[index]!=null}
                    <img class="inline-glyph inverted" alt="Inline Icon" src={inline_icons[index]}>
                {/if}
                {names[index]}
            </span></button>
        {:else}
            <button class="" onclick={() => {
                const default_behaviour = callback(values[index]);
                if(default_behaviour==null||default_behaviour) selected_value = values[index];
            }}><span class="text">
                {#if inline_icons.length>0 && inline_icons[index]!=null}
                    <img class="inline-glyph" alt="Inline Icon" src={inline_icons[index]}>
                {/if}
                {names[index]}
            </span></button>
        {/if}
    {/each}
</div>