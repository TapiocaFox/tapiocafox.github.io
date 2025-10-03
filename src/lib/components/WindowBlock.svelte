<script lang="ts">
    import { onMount } from "svelte";

    let { children, grab_element_id=null, show=$bindable(false), open_location="center" } = $props();
    var window_block: HTMLDivElement;

    let moving = false;
    let mouse_down_offset_x = 0;
    let mouse_down_offset_y = 0;

    const onPointerMove = async (event: PointerEvent) => {
        if(!moving) return;
        const element = event.currentTarget as HTMLElement;
        // const elementRect = element.getBoundingClientRect();

        // await tick();
        // console.log("Pointer move event detected.");
        const { clientX, clientY } = event;

        // const windowWidth = window.innerWidth;
        // const windowHeight = window.innerHeight;

        // const pointerBlockWidth = window_block.offsetWidth;
        // const pointerBlockHeight = window_block.offsetHeight;

        window_block.style.left = `${clientX - mouse_down_offset_x}px`;
        window_block.style.top  = `${clientY - mouse_down_offset_y}px`;

        // window_block.animate({
        //     left:`${clientX-mouse_down_offset_x}px`,
        //     top: `${clientY-mouse_down_offset_y}px`
        // }, {fill: "forwards"});
        // window_block.animate({
        //     left:`${clientX}px`,
        //     top: `${clientY}px`
        // }, {fill: "forwards"});
    };

    const onMouseDown = async (event: MouseEvent) => {
        moving = true;
        const { clientX, clientY } = event;
        const rect = window_block.getBoundingClientRect();
        mouse_down_offset_x = clientX-rect.left;
        mouse_down_offset_y = clientY-rect.top;


        const blockWidth = Math.ceil(window_block.offsetWidth)+1;
        window_block.style.width = blockWidth + "px"; // Lock the width to avoid resizing during dragging.

        // console.log(`Mouse down event detected. (${clientX}, ${clientY}), offset: (${mouse_down_offset_x}, ${mouse_down_offset_y})`);
    }

    const onMouseUp = async (event: MouseEvent) => {
        moving = false;
        // window_block.style.width  = "auto"; // Release the width lock after dragging.
        // console.log("Mouse up event detected.");

    }

    onMount(async () => {
        window_block.style.width  = "auto"; // Initial width lock to avoid resizing during first drag.
        if(grab_element_id!=null) {
            const element = document.getElementById(grab_element_id)!;
            element.style.userSelect = "none";
            element.style.webkitUserSelect = "none";
            element.style.cursor = "grab";
            element.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('pointermove', onPointerMove);
        }
    });

    $effect(() => {
        if(show) {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const pointerBlockWidth = window_block.offsetWidth;
            const pointerBlockHeight = window_block.offsetHeight;
            
            if(open_location.includes("left")) {
                window_block.style.left = `var(--page-offset)`;
            }
            else if(open_location.includes("right")) {
                window_block.style.left = `calc(${windowWidth - pointerBlockWidth}px - var(--page-offset))`;
            }
            else {
                window_block.style.left = `${windowWidth/2 - pointerBlockWidth/2}px`;
            }

            if (open_location.includes("top")) {
                window_block.style.top  = `calc(var(--main-nav-height) + var(--page-offset))`;
            }
            else if (open_location.includes("bottom")) {
                window_block.style.top  = `calc(${windowHeight - pointerBlockHeight}px - var(--page-offset))`;
            }
            else {
                window_block.style.top  = `calc(.5 * var(--main-nav-height) + ${windowHeight/2 - pointerBlockHeight/2}px)`;
            }
            // window_block.animate({
            //     left:`${windowWidth/2-pointerBlockWidth/2}px`,
            //     top: `${windowHeight/2-pointerBlockHeight/2}px`
            // }, {fill: "forwards"});
        }
    });
</script>

<div class="floating-block {show?'visible fade-in':''}" 
    bind:this={window_block}>
    {@render children?.()} 
</div>