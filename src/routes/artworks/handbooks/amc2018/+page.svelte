<script lang="ts">
    import HeaderWithBackButton from '$lib/components/HeaderWithBackButton.svelte';
	import handbook from '$lib/assets/handbooks/AMC2018Handbook.pdf';
</script>
<div class="header_content_format full_height_with_nav_offset">
	<div class="header">
		<HeaderWithBackButton text="NCTU AMC 2018"/>
		<!-- <h1>AMC 2018</h1> -->
		<p class="bold-annotation">This is the handbook for high school students who attended Applied Mathematics Camp in Summer 2018. It is designed to get them into the situation with clear instructions, and to be as welcoming as possible. I designed, laid out, and broke the materials down into asset pieces. So the team can work together in parallel. Aesthetic-wise, I was influenced by illustrated books and UI design.</p>
	</div>
	<div class="content">
		<embed src={handbook} style:width="100%" style:height="100%" type="application/pdf">
	</div>
</div>