<script lang="ts">
    import close_icon_ from '$lib/assets/icons/close.svg';
    let {names=$bindable([]), values=$bindable([]), inline_icons=$bindable([]), closable_list=$bindable([]), selected_value=$bindable(null), close_icon=close_icon_, onclose=(value: string) => {return true}, 
        functional_names=$bindable([]), functional_values=$bindable([]), functional_inline_icons=$bindable([]), onfunctional=(value: string) => {}} = $props();
    let selected_index = $derived(values.indexOf(selected_value));
</script>
<style>
    div.tab-container {
        white-space: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        margin-block-start: 12px;
    }

    div.tab-container::-webkit-scrollbar {
        display: none;
    }

    button {
        display: inline-block;
        vertical-align: middle;
        margin: 0 2px 0 0;
        border-radius: 0;
        border-bottom: 0;
        /* filter: drop-shadow(0 0.5rem 1rem grey); */
        /* border: 1px solid var(--secondary-functional-color); */
    }

    button:hover {
        background-color: whitesmoke;
    }

    button:active {
        background-color: var(--secondary-functional-color);
    }

    button:active span.text {
        color: var(--secondary-functional-text-color);
    }

    button:active span.text > img.inline-glyph {
        filter: invert(1);
    }

    button.selected {
        font-weight: bold;
        /* color: white;
        background-color: var(--secondary-functional-color); */
    }

    button.selected span.text > img.inline-glyph {
        /* filter: invert(1); */
    }

    hr {
        margin-top: 0;
    }

    div.divider {
        display: inline-block;
        border-right: 1px solid black;
        height: 1em;
        /* width: 1px; */
        /* margin-left: .25em; */
        margin-right: calc(.5em );
        margin-left: calc(.5em - 1px);
        vertical-align: middle;
    }
</style>
<div class="tab-container">
    {#each names as name, index}
        <button class="{selected_index == index?'selected':''}" 
            onclick={() => {
                const value = values[index];
                selected_value = value;
            }} 
            draggable={true}
            ondragstart={(event: DragEvent) => {
                // console.log('ondrag');
                event.dataTransfer?.setData('fromIndex', index.toString());
            }}
            ondragover={(event: DragEvent) => {event.preventDefault()}}
            ondrop={(event: DragEvent) => {
                event.preventDefault();
                const fromIndexString = event.dataTransfer?.getData('fromIndex');
                if(typeof(fromIndexString) == 'undefined' || fromIndexString == null) return;
                const fromIndex = parseInt(fromIndexString);
                const name = names[fromIndex];
                const value = values[fromIndex];
                const inline_icon = inline_icons[fromIndex];
                const closable = closable_list[fromIndex];

                names.splice(fromIndex, 1);
                values.splice(fromIndex, 1);
                inline_icons.splice(fromIndex, 1);
                closable_list.splice(fromIndex, 1);

                names.splice(index, 0, name);
                values.splice(index, 0, value);
                inline_icons.splice(index, 0, inline_icon);
                closable_list.splice(index, 0, closable);
                // console.log(`values: ${values}`);
            }}
            >
            <span class="text">
                {#if inline_icons.length>0 && inline_icons[index]!=null}
                    <img class="inline-glyph" alt="Inline Icon" src={inline_icons[index]}>
                {/if}
                {names[index]}
                {#if closable_list[index]}
                    <img class="inline-glyph" alt="Close Icon" src={close_icon} 
                    onclick={(event) => {
                        event.stopPropagation();
                        if(!onclose(values[index])) return;
                        const old_selected_index = selected_index;
                        names.splice(index, 1);
                        values.splice(index, 1);
                        inline_icons.splice(index, 1);
                        closable_list.splice(index, 1);
                        selected_value = values[Math.min(old_selected_index, values.length-1)];
                        // console.log(selected_value);
                    }}>
                {/if}
            </span>
        </button>
    {/each}
    {#if functional_names.length}<div class="divider"></div>{/if}
    {#each functional_names as name, index}
        <button 
            onclick={() => {
                onfunctional(functional_values[index]);
            }}>
            <span class="text">
                {#if functional_inline_icons.length>0 && functional_inline_icons[index]!=null}
                    <img class="inline-glyph" alt="Inline Icon" src={functional_inline_icons[index]}>
                {/if}
                {functional_names[index]}
            </span>
        </button>
    {/each}
</div>
<hr class="solid">