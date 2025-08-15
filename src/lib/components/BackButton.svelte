<script  lang="ts">
  let {text = "go back"} = $props();
</script>
<button style:display="block"
    style:width="fit-content"
    style:padding="0.1em 0.5em"
    style:border="1px solid black"
    style:font-size="small"
    style:margin="12px 0"
    style:background-color="unset"
    style:text-decoration="none" onclick={()=>{window.history.back(); return false;}}>« {text}</button>
