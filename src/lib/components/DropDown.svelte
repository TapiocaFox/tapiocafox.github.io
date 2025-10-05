<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";

    let { children, element_id, division_percentage = 0.5, pointer_offset = 32, unit="px" } = $props();
    let show = $state(false);
    var pointer_block: HTMLDivElement;

    const onpointermove = async (event: PointerEvent) => {
        const element = event.currentTarget as HTMLElement;
        const elementRect = element.getBoundingClientRect();
        show = true;
        // await tick();
        // console.log("Pointer move event detected.");
        const { clientX, clientY } = event;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const pointerBlockWidth = pointer_block.offsetWidth;
        const pointerBlockHeight = pointer_block.offsetHeight;

        if((elementRect.left+elementRect.right)*0.5 <= windowWidth*division_percentage) {
            pointer_block.animate({
                left:`${Math.min(clientX+pointer_offset, windowWidth-pointerBlockWidth)}${unit}`,
                top: `${Math.min(clientY+pointer_offset, windowHeight-pointerBlockHeight)}${unit}`
            }, {fill: "forwards"});
        }
        else {
            pointer_block.animate({
                right:`${Math.max(windowWidth-clientX+pointer_offset, 0)}${unit}`,
                top: `${Math.min(clientY+pointer_offset, windowHeight-pointerBlockHeight)}${unit}`
            }, {fill: "forwards"});
        }
    };

    const onpointerleave = async (event: PointerEvent) => {
        show = false;
    }

    onMount(async () => {
        // await tick();
        const element = document.getElementById(element_id)!;
        element.addEventListener('pointermove', onpointermove);
        element.addEventListener('pointerleave', onpointerleave);
    });
    
    // onDestroy(() => {
    //     const element = document.getElementById(element_id)!;
    //     element.removeEventListener('pointermove', onpointermove);
    //     element.removeEventListener('pointermove', onpointerleave);
    // });
    
</script>

<div class="floating-block {show?'visible fade-in':''}" 
    bind:this={pointer_block}>
    {@render children?.()} 
</div>