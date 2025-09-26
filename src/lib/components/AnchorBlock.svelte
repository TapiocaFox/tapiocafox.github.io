<script lang="ts">
    let { children, anchor: HTMLElement, show = $bindable(false) } = $props();
</script>

{#if show}
{@render children?.()}
{/if}