<script>
    import icon from '$lib/assets/icon.png';
</script>
<div 
    style:display="flex"
    style:color="dimgrey"
    style:margin-block-end="0.5rem"
    style:gap="12px">
    <div style:width="auto">
        <img style:height="54px" style:width="54px" src={icon}/>
    </div>
    <div 
        style:flex-grow="1"
        style:display="flex"
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
                tapiocafox.com
            </button>
            <p style:margin="4px 0 0 0 "
            style:font-family="'Courier New', Courier, monospace"
            style:font-size="x-small">©2025 TapiocaFox. End of the page.</p>
        </div>
    </div>
</div>
