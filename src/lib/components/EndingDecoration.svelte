<script>
    import tapiocafox from '$lib/assets/tapiocafox_small.png';
</script>
<div 
    style:display="flex"
    style:color="black"
    style:margin-block-start="1rem"
    style:margin-block-end="1rem"
    style:align-items="center">
    <div>
        <button
        class="no-style"
        onclick={()=>{
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }}>
            <img alt="TapiocaFox" style:height="24px" src={tapiocafox}/>
        </button>
        <p style:margin="0" style:font-size="xx-small">© {new Date().getFullYear()} [ TapiocaFox |</p>
        <!-- <p style:margin="0" style:font-size="xx-small">© {new Date().getFullYear()} TapiocaFox.</p> -->
    </div>
</div>
