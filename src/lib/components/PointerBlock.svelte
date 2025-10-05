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

        let division = windowWidth*division_percentage;
        // const parentElement = element.parentElement;
        // if(parentElement) {
        //     const parentElementRect = parentElement.getBoundingClientRect();
        //     division = parentElementRect.left+(parentElementRect.right-parentElementRect.left)*division_percentage;
        //     // console.log(division);
        // }

        if((elementRect.left+elementRect.right)*0.5 <= division) {
            pointer_block.style.left = `${Math.min(clientX+pointer_offset, windowWidth-pointerBlockWidth)}${unit}`;
            pointer_block.style.top  = `${Math.min(clientY+pointer_offset, windowHeight-pointerBlockHeight)}${unit}`;
        }
        else {
            pointer_block.style.right = `${Math.max(windowWidth-clientX+pointer_offset, 0)}${unit}`;
            pointer_block.style.top  = `${Math.min(clientY+pointer_offset, windowHeight-pointerBlockHeight)}${unit}`;
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