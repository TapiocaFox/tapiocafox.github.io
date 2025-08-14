<script  lang="ts">
  let {text = "go back"} = $props();
</script>
<p 
    style:display="block"
    style:width="fit-content"
    style:padding="0 0.5em"
    style:border="1px solid black">
<a href="#" style:text-decoration="none" onclick={()=>{window.history.back();}}>« {text}</a>
</p>