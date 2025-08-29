<script>
    import icon from '$lib/assets/icon_dark.png';
</script>
<div 
    style:display="flex"
    style:color="dimgrey"
    style:margin-block-start="1rem"
    style:margin-block-end="1rem"
    style:gap="9px">
    <div style:width="auto">
        <img alt="Icon" style:height="50px" style:width="50px" src={icon}/>
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
                TapiocaFox.com
            </button>
            <p style:margin="3px 0 4px 0"
            style:font-family="'Courier New', Courier, monospace"
            style:font-size="x-small">©2025 TapiocaFox. End of the page.</p>
        </div>
    </div>
</div>
