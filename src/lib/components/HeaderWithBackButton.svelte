<script>
    import BackButton from "./BackButton.svelte";
    let {text = "Header"} = $props();
</script>
<h1>{text}<BackButton inline={true}/></h1>