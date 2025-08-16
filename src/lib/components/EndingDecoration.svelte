<div 
    style:display="flex"
    style:color="dimgrey"
    style:margin-block-end="0.5rem"
    style:gap="12px">
    <div style:width="auto">
        <div class="grid" 
            style:display="inline-grid"
            style:margin="8px 0">
            {#each { length: 9 }, num}
                {#if num == 0}
                    <div class="item" 
                        style:border-radius="6px"
                        style:background-color="darkorange"
                        style:border="2px solid darkorange"
                        style:width="8px"
                        style:height="8px">
                    </div>
                {:else if num == 8}
                    <div class="item" 
                        style:background-color="none"
                        style:border="none"
                        style:width="10px"
                        style:height="10px">
                        <!-- &gt; -->
                    </div>

                {:else}
                    <div class="item" 
                        style:background-color="dimgrey"
                        style:border="1px solid dimgrey"
                        style:width="10px"
                        style:height="10px">
                    </div>
                {/if}
            {/each}
        </div>
    </div>
    <div 
        style:flex-grow="1"
        style:display="flex"
        style:font-family="'Courier New', Courier, monospace"
        style:align-items="center">
        <div>
            <button
                style:border="none"
                style:background-color="unset"
                style:font-size="medium"
                style:font-family="inherit"
                style:color="inherit"
                style:padding="0 0"
                onclick={()=>{
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                }}>
                TapiocaFox.com
            </button>
            <p style:margin="4px 0 0 0 "
            style:font-size="x-small">©2025 TapiocaFox. End of the page.</p>
        </div>
    </div>
</div>
