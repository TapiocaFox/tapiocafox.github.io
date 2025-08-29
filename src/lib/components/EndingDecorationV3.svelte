<script>
    import icon from '$lib/assets/icon.png';
</script>
<div 
    style:flex-grow="1"
    style:display="flex"
    style:color="dimgrey"
    style:margin-block-end="1rem"
    style:align-items="center">
        <div>
            <button
                style:border="none"
                style:color="inherit"
                style:background-color="unset"
                style:font-family="'Courier New', Courier, monospace"
                style:font-size="medium"
                style:padding="0 0"
                onclick={()=>{
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                }}>
                &gt; tapioca<span style:color="var(--fox-primary-color)">fox</span>&nbsp;
            </button>
            <p style:margin="4px 0 0 0 "
            style:font-family="'Courier New', Courier, monospace"
            style:font-size="x-small">©2025 TapiocaFox. End of the page.</p>
        </div>
    </div>
